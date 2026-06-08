"""
ProvIT - estadisticas_services.py
Descripción: Capa de servicio para el módulo de Estadísticas - Caso de Uso de Análisis de Compras Inteligente.

Patrón de Diseño: ESTRATEGIA (Strategy)
    Permite intercambiar dinámicamente el algoritmo de cálculo de escala
    según la variable evaluada (Precio, Calidad o Velocidad), sin modificar el código que los consume.

Jerarquía del patrón:
    EstrategiaCalculoEscala   ← Interfaz abstracta (contrato)
    ├── EstrategiaPrecio      ← Escala por posición en rango global
    ├── EstrategiaCalidad     ← Escala directa (campo ya es 1-5)
    └── EstrategiaVelocidad   ← Escala por días de retraso (puntualidad)
    ContextoCalculoEscala     ← Ejecuta la estrategia inyectada

Métodos principales expuestos (nomenclatura del proyecto - verboAdjetivo):
    - verFiltrosAnalisis()
    - verAnalisisProveedor()
    - verTopProveedores() OJO: este no llegamos a aplicar aún
    - calcularEvolucionAnual()
"""

from abc import ABC, abstractmethod
import calendar
from datetime import date
from typing import Optional

from django.db.models import Avg, Min, Max
from rest_framework.exceptions import NotFound

from .models import (
    Proveedor,
    Producto,
    ProveedorProducto,
    DetallePedido,
    Pedido,
)


# =============================================================================
# PATRÓN ESTRATEGIA — Interfaz abstracta
# =============================================================================

class EstrategiaCalculoEscala(ABC):
    """
    Interfaz base del Patrón Estrategia.
    Define el contrato que todas las estrategias de cálculo deben cumplir. Todas las escalas están en rango 1 a 5.
    """
    ESCALA_MIN = 1
    ESCALA_MAX = 5

    @abstractmethod
    def calcularEscala(self, datos: dict) -> Optional[float]:
        """
        Calcula y retorna la escala (1.0 - 5.0) según los datos recibidos.
        Retorna None si no hay datos suficientes para calcular.
        """
        pass

    def _normalizarEscala(self, valor: float) -> float:
        """Garantiza que el resultado quede dentro del rango 1-5."""
        return round(max(self.ESCALA_MIN, min(self.ESCALA_MAX, valor)), 2)


# =============================================================================
# PATRÓN ESTRATEGIA — Estrategias concretas
# =============================================================================

class EstrategiaPrecio(EstrategiaCalculoEscala):
    """
    Estrategia concreta: Cálculo de escala de PRECIO.
    """
    def calcularEscala(self, datos: dict) -> Optional[float]:
        precio_promedio   = datos.get('precio_promedio')
        precio_min_global = datos.get('precio_min_global')
        precio_max_global = datos.get('precio_max_global')

        if precio_promedio is None or precio_min_global is None or precio_max_global is None:
            return None

        # Forzamos la conversión de todos los valores a float xq sino teníamos problemas en los cálculos por distintos tipos de datos.
        precio_promedio = float(precio_promedio)
        precio_min_global = float(precio_min_global)
        precio_max_global = float(precio_max_global)

        # Usamos un valor por defecto con Rango igual (todos los proveedores tienen el mismo precio o escala neutra)
        if precio_max_global == precio_min_global:
            return 3.0
        # Normalizar: 0.0 = más caro y 1.0 = más barato
        posicion = (precio_max_global - precio_promedio) / (precio_max_global - precio_min_global)

        # Convertir a escala 1-5
        escala = posicion * 4 + 1
        return self._normalizarEscala(escala)


class EstrategiaCalidad(EstrategiaCalculoEscala):
    """
    Estrategia concreta: Cálculo de escala de CALIDAD.

    El campo 'calidad' en ProveedorProducto ya está definido en escala 1-5
    (5 = Excelente, 1 = Muy malo). Solo se calcula el promedio del período.
    """
    def calcularEscala(self, datos: dict) -> Optional[float]:
        calidad_promedio = datos.get('calidad_promedio')
        if calidad_promedio is None:
            return None
        return self._normalizarEscala(calidad_promedio)


class EstrategiaVelocidad(EstrategiaCalculoEscala):
    """
    Estrategia concreta: Cálculo de escala de VELOCIDAD DE ENTREGA.

    Evalúa la puntualidad promedio: fecha_entrega_real - fecha_entrega_esperada.
    Valor positivo = llegó tarde. Valor negativo o cero = a tiempo o antes.

    Escala de puntualidad:
        5 (Excelente)  → Entregado a tiempo o antes (≤ 0 días de retraso)
        4 (Bueno)      → 1 a 2 días de retraso
        3 (Normal)     → 3 a 5 días de retraso
        2 (Bajo)       → 6 a 10 días de retraso
        1 (Muy malo)   → Más de 10 días de retraso
    """
    # (límite_inferior_exclusivo, límite_superior_inclusivo, escala_asignada)
    RANGOS = [
        (float('-inf'), 0,           5),
        (0,             2,           4),
        (2,             5,           3),
        (5,             10,          2),
        (10,            float('inf'), 1),
    ]

    def calcularEscala(self, datos: dict) -> Optional[float]:
        promedio_dias = datos.get('promedio_dias_retraso')
        if promedio_dias is None:
            return None

        for minimo, maximo, escala in self.RANGOS:
            if minimo < promedio_dias <= maximo:
                return float(escala)

        return 1.0  # Fallback de seguridad


# =============================================================================
# PATRÓN ESTRATEGIA — Contexto
# =============================================================================

class ContextoCalculoEscala:
    """
    Contexto del Patrón Estrategia.
    Recibe una estrategia inyectada y la ejecuta.
    Permite cambiar la estrategia en tiempo de ejecución sin modificar el código cliente.
    """
    def __init__(self, estrategia: EstrategiaCalculoEscala):
        self._estrategia = estrategia

    def cambiarEstrategia(self, estrategia: EstrategiaCalculoEscala) -> None:
        """Permite intercambiar la estrategia activa en tiempo de ejecución."""
        self._estrategia = estrategia

    def ejecutarCalculo(self, datos: dict) -> Optional[float]:
        """Delega el cálculo a la estrategia activa."""
        return self._estrategia.calcularEscala(datos)


# =============================================================================
# FÁBRICA DE ESTRATEGIAS (Helper)
# =============================================================================

def obtenerEstrategiaPorVariable(variable: str) -> EstrategiaCalculoEscala:
    """
    Retorna la estrategia concreta según la variable solicitada.
    Centraliza la instanciación y evita lógica condicional dispersa.
    """
    estrategias = {
        'precio':    EstrategiaPrecio(),
        'calidad':   EstrategiaCalidad(),
        'velocidad': EstrategiaVelocidad(),
    }
    if variable not in estrategias:
        raise ValueError(
            f"Variable '{variable}' no reconocida. Opciones válidas: precio, calidad, velocidad."
        )
    return estrategias[variable]


# =============================================================================
# Métodos INTERNOS de ayuda para otros cálculos necesarios en el análisis
# y Métodos para generar la Recomendación según los resultados de las variables de la escala
# =============================================================================

def _calcularDiasRetraso(pedido: Pedido) -> Optional[float]:
    """
    Calcula los días de diferencia entre la entrega real y la esperada.
    Positivo = tardío | Negativo = anticipado | 0 = puntual.
    Retorna None si el pedido no tiene fecha_entrega_real registrada.
    """
    if not pedido.fecha_entrega_real or not pedido.fecha_entrega_esperada:
        return None
    return (pedido.fecha_entrega_real - pedido.fecha_entrega_esperada).days


def _obtenerDiasRetrasoLista(pedidos_qs) -> list:
    """
    Recorre un queryset de pedidos y retorna la lista de días de retraso
    válidos (excluye pedidos sin fecha_entrega_real).
    """
    resultado = []
    for pedido in pedidos_qs:
        dias = _calcularDiasRetraso(pedido)
        if dias is not None:
            resultado.append(dias)
    return resultado


def _calcularPuntajePonderado(
    precio: Optional[float],
    calidad: Optional[float],
    velocidad: Optional[float],
    variables: list,
) -> Optional[float]:
    """
    Calcula el puntaje promedio según las variables seleccionadas.
    Si 'todos' está en la lista, incluye las tres variables por igual.
    Retorna None si ninguna variable tiene datos disponibles.
    """
    if 'todos' in variables:
        variables = ['precio', 'calidad', 'velocidad']

    mapa = {'precio': precio, 'calidad': calidad, 'velocidad': velocidad}
    valores = [mapa[v] for v in variables if mapa.get(v) is not None]

    if not valores:
        return None
    return round(sum(valores) / len(valores), 2)


def _generarRecomendacion(
    nombre_proveedor: str,
    escala_precio: Optional[float],
    escala_calidad: Optional[float],
    escala_velocidad: Optional[float],
) -> str:
    """
    Genera un texto de recomendación basado en los puntajes del proveedor.
    Identifica fortalezas y debilidades para orientar la decisión de compra.
    """
    puntaje_total = _calcularPuntajePonderado(
        escala_precio, escala_calidad, escala_velocidad, ['todos']
    )

    if puntaje_total is None:
        return (
            f"No hay datos suficientes en el período seleccionado para "
            f"evaluar a {nombre_proveedor}."
        )

    fortalezas  = []
    debilidades = []

    if escala_precio is not None:
        if escala_precio >= 4:
            fortalezas.append("precio competitivo")
        elif escala_precio <= 2:
            debilidades.append("precio elevado respecto al mercado")

    if escala_calidad is not None:
        if escala_calidad >= 4:
            fortalezas.append("alta calidad de productos")
        elif escala_calidad <= 2:
            debilidades.append("calidad por debajo del estándar")

    if escala_velocidad is not None:
        if escala_velocidad >= 4:
            fortalezas.append("entregas puntuales")
        elif escala_velocidad <= 2:
            debilidades.append("demoras frecuentes en las entregas")

    texto = f"El proveedor {nombre_proveedor} obtuvo un puntaje general de {puntaje_total:.1f}/5. "

    if fortalezas:
        texto += f"Fortalezas destacadas: {', '.join(fortalezas)}. "
    if debilidades:
        texto += f"Áreas a considerar: {', '.join(debilidades)}. "

    if puntaje_total >= 4.0:
        texto += "Se recomienda como proveedor prioritario para futuras compras."
    elif puntaje_total >= 3.0:
        texto += "Es un proveedor aceptable. Se sugiere monitorear su evolución."
    else:
        texto += "Se recomienda evaluar proveedores alternativos para este rubro."

    return texto


def _calcularEscalasPorPeriodo(
    proveedor_id: int,
    fecha_inicio: date,
    fecha_fin: date,
    producto_id: Optional[int],
    rango_precios_global: dict,
) -> dict:
    """
    Calcula las tres escalas (precio, calidad, velocidad) para un proveedor
    en un período dado. Reutilizado por verAnalisisProveedor y calcularEvolucionAnual.
    """
    contexto = ContextoCalculoEscala(EstrategiaCalidad())

    # ── Calidad ───────────────────────────────────────────────────────────────
   # ── Promedio Ponderado por volumen de compra del periodo) ──────────
    
    # 1. Buscamos qué se compró exactamente en este año
    detalles_periodo = DetallePedido.objects.filter(
        fk_pedido__fk_proveedor_id=proveedor_id,
        fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin)
    )
    if producto_id:
        detalles_periodo = detalles_periodo.filter(fk_producto_id=producto_id)

    # 2. Traemos el catálogo actual del proveedor y lo armamos como un diccionario rápido {id_producto: calidad}
    catalogo_calidad = dict(
        ProveedorProducto.objects.filter(fk_proveedor_id=proveedor_id)
        .values_list('fk_producto_id', 'calidad')
    )

    suma_calidad = 0
    total_productos = 0

    # 3. Cruzamos la información en memoria (Equivalente al JOIN propuesto)
    for detalle in detalles_periodo:
        # Obtenemos la calidad del catálogo para este producto (Fallback de 3.0 si por algún motivo no existe)
        calidad_producto = catalogo_calidad.get(detalle.fk_producto_id, 3.0)
        
        # Ponderamos: (calidad * cantidad comprada)
        suma_calidad += (calidad_producto * detalle.cantidad_producto)
        total_productos += detalle.cantidad_producto

    # 4. Calculamos el promedio final para el gráfico
    if total_productos > 0:
        calidad_prom = suma_calidad / total_productos
    else:
        # Fallback de seguridad: Si no compraron nada en este año, 
        # devolvemos el promedio general de su catálogo actual para que la línea no caiga a 0.
        cat_qs = ProveedorProducto.objects.filter(fk_proveedor_id=proveedor_id)
        if producto_id:
            cat_qs = cat_qs.filter(fk_producto_id=producto_id)
        cal_agregada = cat_qs.aggregate(avg=Avg('calidad'))['avg']
        calidad_prom = float(cal_agregada) if cal_agregada is not None else 3.0

    contexto.cambiarEstrategia(EstrategiaCalidad())
    escala_calidad = contexto.ejecutarCalculo({'calidad_promedio': calidad_prom})

    # ── Precio ────────────────────────────────────────────────────────────────
    detalles_proveedor = DetallePedido.objects.filter(
        fk_pedido__fk_proveedor_id=proveedor_id,
        fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin),
    )
    if producto_id:
        detalles_proveedor = detalles_proveedor.filter(fk_producto_id=producto_id)

    precio_prom = detalles_proveedor.aggregate(avg=Avg('precio_unitario'))['avg']
    contexto.cambiarEstrategia(EstrategiaPrecio())
    escala_precio = contexto.ejecutarCalculo({
        'precio_promedio':   precio_prom,
        'precio_min_global': rango_precios_global.get('min_precio'),
        'precio_max_global': rango_precios_global.get('max_precio'),
    })

    # ── Velocidad ─────────────────────────────────────────────────────────────
    pedidos_qs = Pedido.objects.filter(
        fk_proveedor_id=proveedor_id,
        fecha_emision__range=(fecha_inicio, fecha_fin),
        fecha_entrega_real__isnull=False,
    )
    if producto_id:
        pedidos_qs = pedidos_qs.filter(
            detalles__fk_producto_id=producto_id
        ).distinct()

    dias_lista    = _obtenerDiasRetrasoLista(pedidos_qs)
    promedio_dias = sum(dias_lista) / len(dias_lista) if dias_lista else None

    contexto.cambiarEstrategia(EstrategiaVelocidad())
    escala_velocidad = contexto.ejecutarCalculo({'promedio_dias_retraso': promedio_dias})

    return {
        'precio':    escala_precio,
        'calidad':   escala_calidad,
        'velocidad': escala_velocidad,
    }


# =============================================================================
# SERVICIO: FILTROS
# =============================================================================

def verFiltrosAnalisis() -> dict:
    """
    Caso de Uso: Análisis de Compra — Poblar filtros del frontend.

    Retorna los proveedores activos, todos los productos disponibles
    y un mapa de qué productos provee cada proveedor.
    El frontend lo usa para construir los dropdowns de filtro.
    """
    proveedores = list(
        Proveedor.objects.filter(estado=True)
        .values('id_proveedor', 'nombre_proveedor')
        .order_by('nombre_proveedor')
    )

    productos = list(
        Producto.objects.all()
        .values('id_producto', 'nombre_producto', 'fk_categoria__nombre_categoria')
        .order_by('nombre_producto')
    )

    # Mapa de productos por proveedor para los filtros en cascada
    relaciones = ProveedorProducto.objects.select_related(
        'fk_proveedor', 'fk_producto'
    ).values(
        'fk_proveedor__id_proveedor',
        'fk_producto__id_producto',
        'fk_producto__nombre_producto',
    )

    productos_por_proveedor: dict = {}
    for rel in relaciones:
        pid = rel['fk_proveedor__id_proveedor']
        if pid not in productos_por_proveedor:
            productos_por_proveedor[pid] = []
        productos_por_proveedor[pid].append({
            'id_producto':     rel['fk_producto__id_producto'],
            'nombre_producto': rel['fk_producto__nombre_producto'],
        })

    return {
        'proveedores':             proveedores,
        'productos':               productos,
        'productos_por_proveedor': productos_por_proveedor,
    }


# =============================================================================
# SERVICIO: ANÁLISIS DE UN PROVEEDOR
# =============================================================================

def verAnalisisProveedor(
    proveedor_id: int,
    fecha_inicio: date,
    fecha_fin: date,
    producto_id: Optional[int] = None,
) -> dict:
    """
    Caso de Uso: Análisis de Compra de un Proveedor.

    Calcula las escalas de Precio, Calidad y Velocidad para el proveedor
    (y opcionalmente un producto específico) en el período indicado.

    Parámetros:
        proveedor_id  (int):  ID del proveedor a analizar.
        fecha_inicio  (date): Inicio del período de análisis.
        fecha_fin     (date): Fin del período de análisis.
        producto_id   (int):  ID del producto a filtrar. None = todos los productos.

    Retorna datos para:
        - graficaTorta:  Puntajes globales del período (Precio, Calidad, Velocidad).
        - graficaLineas: Evolución anual de las escalas dentro del período.
        - recomendacion: Texto de asesoramiento basado en los puntajes.

    Lanza:
        NotFound (HTTP 404) si el proveedor no existe.
    """
    try:
        proveedor = Proveedor.objects.get(pk=proveedor_id)
    except Proveedor.DoesNotExist:
        raise NotFound(detail=f"No se encontró el proveedor con ID {proveedor_id}.")

    # Rango de precios global del período (todos los proveedores del mismo producto)
    detalles_global = DetallePedido.objects.filter(
        fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin),
    )
    if producto_id:
        detalles_global = detalles_global.filter(fk_producto_id=producto_id)

    rango_global = detalles_global.aggregate(
        min_precio=Min('precio_unitario'),
        max_precio=Max('precio_unitario'),
    )

    # Escalas del período completo (para la gráfica de torta)
    escalas = _calcularEscalasPorPeriodo(
        proveedor_id=proveedor_id,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        producto_id=producto_id,
        rango_precios_global=rango_global,
    )
    grafica_lineas = calcularEvolucion(
    proveedor_id=proveedor_id,
    fecha_inicio=fecha_inicio,
    fecha_fin=fecha_fin,
    producto_id=producto_id,
    rango_global=rango_global,
)

    # Recomendación textual
    recomendacion = _generarRecomendacion(
        nombre_proveedor=proveedor.nombre_proveedor,
        escala_precio=escalas['precio'],
        escala_calidad=escalas['calidad'],
        escala_velocidad=escalas['velocidad'],
    )

    return {
        'proveedor':     {'id': proveedor.id_proveedor, 'nombre': proveedor.nombre_proveedor},
        'producto_id':   producto_id,
        'periodo':       {'desde': str(fecha_inicio), 'hasta': str(fecha_fin)},
        'graficaTorta':  escalas,
        'graficaLineas': grafica_lineas,
        'recomendacion': recomendacion,
    }


def calcularEvolucionAnual(
    proveedor_id: int,
    fecha_inicio: date,
    fecha_fin: date,
    producto_id: Optional[int] = None,
    rango_precios_global: Optional[dict] = None,
) -> list:
    """
    Caso de Uso: Análisis de Compra — Evolución anual de un proveedor.

    Calcula las escalas (Precio, Calidad, Velocidad) año por año dentro
    del período. Alimenta la gráfica de líneas del análisis individual.

    El rango_precios_global se mantiene fijo para todo el período
    para que los valores sean comparables entre años.
    """
    if rango_precios_global is None:
        rango_precios_global = {'min_precio': None, 'max_precio': None}

    resultado = []
    for anio in range(fecha_inicio.year, fecha_fin.year + 1):
        inicio_anio = date(anio, 1, 1)
        fin_anio    = date(anio, 12, 31)

        escalas_anio = _calcularEscalasPorPeriodo(
            proveedor_id=proveedor_id,
            fecha_inicio=inicio_anio,
            fecha_fin=fin_anio,
            producto_id=producto_id,
            rango_precios_global=rango_precios_global,
        )

        resultado.append({
            'anio':      anio,
            'precio':    escalas_anio['precio'],
            'calidad':   escalas_anio['calidad'],
            'velocidad': escalas_anio['velocidad'],
        })

    return resultado

def calcularEvolucionMensual(
    proveedor_id: int, 
    anio: int, 
    producto_id: Optional[int], 
    rango_precios_global: dict
) -> list:
    """Calcula la evolución mes a mes para un año específico."""
    resultado = []
    
    for mes in range(1, 13):
        _, ultimo_dia = calendar.monthrange(anio, mes)
        inicio_periodo = date(anio, mes, 1)
        fin_periodo = date(anio, mes, ultimo_dia)

        escalas = _calcularEscalasPorPeriodo(
            proveedor_id, inicio_periodo, fin_periodo, producto_id, rango_precios_global
        )
        
        # Guarda el mes como identificador clave
        resultado.append({
            'mes': mes, 
            'precio': escalas['precio'],
            'calidad': escalas['calidad'],
            'velocidad': escalas['velocidad']
        })
    return resultado
def calcularEvolucion(proveedor_id, fecha_inicio, fecha_fin, producto_id, rango_global):
    
    print(f"DEBUG: Inicio: {fecha_inicio}, Fin: {fecha_fin}")
    print(f"DEBUG: ¿Son iguales los años?: {fecha_inicio.year == fecha_fin.year}")

    if fecha_inicio.year == fecha_fin.year:
        print("DEBUG: Entrando en lógica MENSUAL")
        return calcularEvolucionMensual(proveedor_id, fecha_inicio.year, producto_id, rango_global)
    
    print("DEBUG: Entrando en lógica ANUAL")
    return calcularEvolucionAnual(proveedor_id, fecha_inicio, fecha_fin, producto_id, rango_global)
# =============================================================================
# SERVICIO: TOP 3 PROVEEDORES / PRODUCTOS
#Falta su visualización- Ver si llegamos a agregar o no
# =============================================================================

def verTopProveedores(
    fecha_inicio: date,
    fecha_fin: date,
    variables: list,
    tipo: str = 'mejor',
    filtro_por: str = 'proveedor',
    limite: int = 3,
) -> dict:
    """
    Caso de Uso: Análisis de Compra — Ranking Top N.

    Calcula el ranking de proveedores o productos según las variables
    y el período seleccionados.

    Parámetros:
        fecha_inicio (date):  Inicio del período.
        fecha_fin    (date):  Fin del período.
        variables    (list):  Lista de variables a ponderar.
                              Opciones: ['precio'], ['calidad'], ['velocidad'], ['todos']
        tipo         (str):   'mejor' (desc) | 'peor' (asc).
        filtro_por   (str):   'proveedor' | 'producto'.
        limite       (int):   Cantidad de resultados (default: 3).

    Retorna datos para:
        - graficaBarras: Puntaje total por entidad (proveedor o producto).
        - graficaLineas: Evolución anual de cada entidad del top.
    """
    if filtro_por == 'proveedor':
        return _calcularTopPorProveedor(fecha_inicio, fecha_fin, variables, tipo, limite)
    return _calcularTopPorProducto(fecha_inicio, fecha_fin, variables, tipo, limite)


def _calcularRangoGlobalPreciosTop(fecha_inicio: date, fecha_fin: date) -> dict:
    """
    Calcula el rango min-max de precios global para normalizar los puntajes
    de todos los proveedores/productos de manera consistente.
    """
    return DetallePedido.objects.filter(
        fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin),
    ).aggregate(
        min_precio=Min('precio_unitario'),
        max_precio=Max('precio_unitario'),
    )


def _calcularTopPorProveedor(
    fecha_inicio: date,
    fecha_fin: date,
    variables: list,
    tipo: str,
    limite: int,
) -> dict:
    """
    Calcula el Top de proveedores. Itera sobre todos los activos,
    calcula su puntaje ponderado y ordena según tipo (mejor/peor).
    """
    rango_global = _calcularRangoGlobalPreciosTop(fecha_inicio, fecha_fin)
    proveedores  = Proveedor.objects.filter(estado=True)
    puntajes     = []

    for proveedor in proveedores:
        escalas = _calcularEscalasPorPeriodo(
            proveedor_id=proveedor.id_proveedor,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            producto_id=None,
            rango_precios_global=rango_global,
        )
        puntaje = _calcularPuntajePonderado(
            escalas['precio'], escalas['calidad'], escalas['velocidad'], variables
        )
        if puntaje is not None:
            puntajes.append({
                'id':        proveedor.id_proveedor,
                'nombre':    proveedor.nombre_proveedor,
                'puntaje':   puntaje,
                'precio':    escalas['precio'],
                'calidad':   escalas['calidad'],
                'velocidad': escalas['velocidad'],
            })

    puntajes.sort(key=lambda x: x['puntaje'], reverse=(tipo == 'mejor'))
    top = puntajes[:limite]

    grafica_barras = [
        {
            'nombre':    item['nombre'],
            'puntaje':   item['puntaje'],
            'precio':    item['precio'],
            'calidad':   item['calidad'],
            'velocidad': item['velocidad'],
        }
        for item in top
    ]

    grafica_lineas = _calcularEvolucionTop(
        entidades=top,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        variables=variables,
        rango_global=rango_global,
        filtro_por='proveedor',
    )

    return {
        'tipo':          tipo,
        'filtro_por':    'proveedor',
        'variables':     variables,
        'periodo':       {'desde': str(fecha_inicio), 'hasta': str(fecha_fin)},
        'graficaBarras': grafica_barras,
        'graficaLineas': grafica_lineas,
    }


def _calcularTopPorProducto(
    fecha_inicio: date,
    fecha_fin: date,
    variables: list,
    tipo: str,
    limite: int,
) -> dict:
    """
    Calcula el Top de productos. Promedia los valores de todos los
    proveedores que ofrecen cada producto en el período.
    """
    rango_global = _calcularRangoGlobalPreciosTop(fecha_inicio, fecha_fin)
    productos    = Producto.objects.all()
    puntajes     = []
    contexto     = ContextoCalculoEscala(EstrategiaCalidad())

    for producto in productos:
        # Calidad promedio de todos los proveedores del producto
        calidad_prom = ProveedorProducto.objects.filter(
            fk_producto_id=producto.id_producto,
            ultima_actualizacion__range=(fecha_inicio, fecha_fin),
        ).aggregate(avg=Avg('calidad'))['avg']

        contexto.cambiarEstrategia(EstrategiaCalidad())
        escala_calidad = contexto.ejecutarCalculo({'calidad_promedio': calidad_prom})

        # Precio promedio de todos los pedidos del producto
        precio_prom = DetallePedido.objects.filter(
            fk_producto_id=producto.id_producto,
            fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin),
        ).aggregate(avg=Avg('precio_unitario'))['avg']

        contexto.cambiarEstrategia(EstrategiaPrecio())
        escala_precio = contexto.ejecutarCalculo({
            'precio_promedio':   precio_prom,
            'precio_min_global': rango_global.get('min_precio'),
            'precio_max_global': rango_global.get('max_precio'),
        })

        # Velocidad promedio de todos los pedidos que incluyen el producto
        pedidos_ids = DetallePedido.objects.filter(
            fk_producto_id=producto.id_producto,
            fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin),
        ).values_list('fk_pedido_id', flat=True)

        pedidos = Pedido.objects.filter(
            id_pedido__in=pedidos_ids,
            fecha_entrega_real__isnull=False,
        )
        dias_lista    = _obtenerDiasRetrasoLista(pedidos)
        promedio_dias = sum(dias_lista) / len(dias_lista) if dias_lista else None

        contexto.cambiarEstrategia(EstrategiaVelocidad())
        escala_velocidad = contexto.ejecutarCalculo({'promedio_dias_retraso': promedio_dias})

        puntaje = _calcularPuntajePonderado(
            escala_precio, escala_calidad, escala_velocidad, variables
        )
        if puntaje is not None:
            puntajes.append({
                'id':        producto.id_producto,
                'nombre':    producto.nombre_producto,
                'puntaje':   puntaje,
                'precio':    escala_precio,
                'calidad':   escala_calidad,
                'velocidad': escala_velocidad,
            })

    puntajes.sort(key=lambda x: x['puntaje'], reverse=(tipo == 'mejor'))
    top = puntajes[:limite]

    grafica_barras = [
        {
            'nombre':    item['nombre'],
            'puntaje':   item['puntaje'],
            'precio':    item['precio'],
            'calidad':   item['calidad'],
            'velocidad': item['velocidad'],
        }
        for item in top
    ]

    grafica_lineas = _calcularEvolucionTop(
        entidades=top,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        variables=variables,
        rango_global=rango_global,
        filtro_por='producto',
    )

    return {
        'tipo':          tipo,
        'filtro_por':    'producto',
        'variables':     variables,
        'periodo':       {'desde': str(fecha_inicio), 'hasta': str(fecha_fin)},
        'graficaBarras': grafica_barras,
        'graficaLineas': grafica_lineas,
    }


def _calcularEvolucionTop(
    entidades: list,
    fecha_inicio: date,
    fecha_fin: date,
    variables: list,
    rango_global: dict,
    filtro_por: str,
) -> list:
    """
    Calcula la evolución anual de las entidades del top (proveedores o productos).
    Retorna una lista de filas {anio, NombreEntidad1: puntaje, NombreEntidad2: ...}
    compatible directamente con los gráficos de líneas de Recharts.
    """
    resultado = []

    for anio in range(fecha_inicio.year, fecha_fin.year + 1):
        inicio_anio = date(anio, 1, 1)
        fin_anio    = date(anio, 12, 31)
        fila        = {'anio': anio}

        for entidad in entidades:
            if filtro_por == 'proveedor':
                escalas = _calcularEscalasPorPeriodo(
                    proveedor_id=entidad['id'],
                    fecha_inicio=inicio_anio,
                    fecha_fin=fin_anio,
                    producto_id=None,
                    rango_precios_global=rango_global,
                )
            else:
                # Para productos: calcular escalas promediando todos sus proveedores
                contexto = ContextoCalculoEscala(EstrategiaCalidad())

                cal_prom = ProveedorProducto.objects.filter(
                    fk_producto_id=entidad['id'],
                    ultima_actualizacion__range=(inicio_anio, fin_anio),
                ).aggregate(avg=Avg('calidad'))['avg']
                contexto.cambiarEstrategia(EstrategiaCalidad())
                escala_cal = contexto.ejecutarCalculo({'calidad_promedio': cal_prom})

                prec_prom = DetallePedido.objects.filter(
                    fk_producto_id=entidad['id'],
                    fk_pedido__fecha_emision__range=(inicio_anio, fin_anio),
                ).aggregate(avg=Avg('precio_unitario'))['avg']
                contexto.cambiarEstrategia(EstrategiaPrecio())
                escala_prec = contexto.ejecutarCalculo({
                    'precio_promedio':   prec_prom,
                    'precio_min_global': rango_global.get('min_precio'),
                    'precio_max_global': rango_global.get('max_precio'),
                })

                pedidos_ids = DetallePedido.objects.filter(
                    fk_producto_id=entidad['id'],
                    fk_pedido__fecha_emision__range=(inicio_anio, fin_anio),
                ).values_list('fk_pedido_id', flat=True)

                pedidos = Pedido.objects.filter(
                    id_pedido__in=pedidos_ids,
                    fecha_entrega_real__isnull=False,
                )
                dias      = _obtenerDiasRetrasoLista(pedidos)
                prom_dias = sum(dias) / len(dias) if dias else None
                contexto.cambiarEstrategia(EstrategiaVelocidad())
                escala_vel = contexto.ejecutarCalculo({'promedio_dias_retraso': prom_dias})

                escalas = {'precio': escala_prec, 'calidad': escala_cal, 'velocidad': escala_vel}

            fila[entidad['nombre']] = _calcularPuntajePonderado(
                escalas['precio'], escalas['calidad'], escalas['velocidad'], variables
            )

        resultado.append(fila)

    return resultado