"""
ProvIT - estadisticas_services.py
Descripción: Capa de servicio para el módulo de Estadísticas - Caso de Uso de Análisis de Compras Inteligente.

Patrón de Diseño: ESTRATEGIA (Strategy)
    Permite intercambiar dinámicamente el algoritmo de cálculo de escala
    según la variable evaluada (Precio, Calidad o Velocidad), sin modificar el código que los consume.

Clases Jerarquía del patrón Estrategia:
    EstrategiaCalculoEscala   ← Interfaz abstracta (contrato)
    ├── EstrategiaPrecio      ← Escala por posición en rango global
    ├── EstrategiaCalidad     ← Escala directa (campo ya es 1-5)
    └── EstrategiaVelocidad   ← Escala por días de retraso (puntualidad)
    ContextoCalculoEscala     ← Ejecuta la estrategia inyectada

 Clase serviciosAnalisisCompras (métodos complementarios para los cálculos del análisis): 
    - verFiltrosAnalisis()
    - verAnalisisProveedor()
    - calcularEvolucionAnual()
    - _calcularEscalaPorPeriodo()
    - _generarRecomendacion()
"""

from abc import ABC, abstractmethod
import calendar
from datetime import date
from typing import Optional

from django.db.models import Avg, Min, Max
from rest_framework.exceptions import NotFound

from ..models import (
    Proveedor,
    Producto,
    ProveedorProducto,
    DetallePedido,
    Pedido,
)
from django.db import connection
from django.db.models import Min, Max

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
# CLASE ServicioAnslisisCompras
# Contiene Métodos de cálculos y analisis para generar la Recomendación según los resultados de las variables de la escala
# =============================================================================

class ServicioAnalisisCompras:

    @staticmethod
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
        puntaje_total = ServicioAnalisisCompras._calcularPuntajePonderado(
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


    @staticmethod
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

        dias_lista    = ServicioAnalisisCompras._obtenerDiasRetrasoLista(pedidos_qs)
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

    @staticmethod
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
    
    @staticmethod
    def verAnalisisProveedor(
        proveedor_id: int,
        fecha_inicio: date,
        fecha_fin: date,
        producto_id: Optional[int] = None,
    ) -> dict:
        """
        Caso de Uso: Consultar Compras Inteligentes.

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

       # Rango de precios global del período (Delegado a SQL Server mediante SP)
        rango_global = ServicioAnalisisCompras._obtener_rango_global_seguro(fecha_inicio, fecha_fin, producto_id)

        # Escalas del período completo (para la gráfica de torta)
        escalas = ServicioAnalisisCompras._calcularEscalasPorPeriodo(
            proveedor_id=proveedor_id,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            producto_id=producto_id,
            rango_precios_global=rango_global,
        )
        grafica_lineas = ServicioAnalisisCompras.calcularEvolucion(
        proveedor_id=proveedor_id,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        producto_id=producto_id,
        rango_global=rango_global,
    )

        # Recomendación textual
        recomendacion = ServicioAnalisisCompras._generarRecomendacion(
            nombre_proveedor=proveedor.nombre_proveedor,
            escala_precio=escalas['precio'],
            escala_calidad=escalas['calidad'],
            escala_velocidad=escalas['velocidad'],
        )

        ServicioAnalisisCompras._registrar_auditoria_silenciosa(proveedor_id)
        return {
            'proveedor':     {'id': proveedor.id_proveedor, 'nombre': proveedor.nombre_proveedor},
            'producto_id':   producto_id,
            'periodo':       {'desde': str(fecha_inicio), 'hasta': str(fecha_fin)},
            'graficaTorta':  escalas,
            'graficaLineas': grafica_lineas,
            'recomendacion': recomendacion,
        }

    @staticmethod
    def calcularEvolucionAnual(
        proveedor_id: int,
        fecha_inicio: date,
        fecha_fin: date,
        producto_id: Optional[int] = None,
        rango_precios_global: Optional[dict] = None,
    ) -> list:
        """
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

            escalas_anio = ServicioAnalisisCompras._calcularEscalasPorPeriodo(
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

    @staticmethod
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

            escalas = ServicioAnalisisCompras._calcularEscalasPorPeriodo(
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
    
    @staticmethod
    def calcularEvolucion(proveedor_id, fecha_inicio, fecha_fin, producto_id, rango_global):
        
        print(f"DEBUG: Inicio: {fecha_inicio}, Fin: {fecha_fin}")
        print(f"DEBUG: ¿Son iguales los años?: {fecha_inicio.year == fecha_fin.year}")

        if fecha_inicio.year == fecha_fin.year:
            print("DEBUG: Entrando en lógica MENSUAL")
            return ServicioAnalisisCompras.calcularEvolucionMensual(proveedor_id, fecha_inicio.year, producto_id, rango_global)
        
        print("DEBUG: Entrando en lógica ANUAL")
        return ServicioAnalisisCompras.calcularEvolucionAnual(proveedor_id, fecha_inicio, fecha_fin, producto_id, rango_global)


    @staticmethod
    def _calcularDiasRetraso(pedido: Pedido) -> Optional[float]:
        """
        Calcula los días de diferencia entre la entrega real y la esperada.
        Positivo = tardío | Negativo = anticipado | 0 = puntual.
        Retorna None si el pedido no tiene fecha_entrega_real registrada.
        """
        if not pedido.fecha_entrega_real or not pedido.fecha_entrega_esperada:
            return None
        return (pedido.fecha_entrega_real - pedido.fecha_entrega_esperada).days


    @staticmethod
    def _obtenerDiasRetrasoLista(pedidos_qs) -> list:
        """
        Recorre un queryset de pedidos y retorna la lista de días de retraso
        válidos (excluye pedidos sin fecha_entrega_real).
        """
        resultado = []
        for pedido in pedidos_qs:
            dias = ServicioAnalisisCompras._calcularDiasRetraso(pedido)
            if dias is not None:
                resultado.append(dias)
        return resultado

    @staticmethod
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

    @staticmethod
    #Procedimiento Almacenado de Consulta: Obtenemos el rango entre fechas para los cálculos desde la BD.
    def _obtener_rango_global_seguro(fecha_inicio, fecha_fin, producto_id=None) -> dict:
        """
        Intenta usar el SP para mayor velocidad. Si falla, usa el ORM de Django como respaldo.
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "{CALL sp_ObtenerRangoGlobal (@FechaInicio=%s, @FechaFin=%s, @ProductoID=%s)}",
                    [fecha_inicio, fecha_fin, producto_id]
                )
                row = cursor.fetchone()
                # Si el SP trajo datos correctos, los retornamos
                if row and row[0] is not None:
                    return {'min_precio': row[0], 'max_precio': row[1]}
        
        except Exception as e:
            # Capturamos el error sin romper el sistema y mostramos en consola (para asegurarnos que si falla, saber que el error fue del Procedimiento)
            print(f"SP Falló. Usando Fallback: {e}")

        # FALLBACK (Plan B de seguridad, si falla la consulta por procedimiento, que consulte con ORM como hacía antes) 
        detalles_global = DetallePedido.objects.filter(fk_pedido__fecha_emision__range=(fecha_inicio, fecha_fin))
        if producto_id:
            detalles_global = detalles_global.filter(fk_producto_id=producto_id)
            
        return detalles_global.aggregate(min_precio=Min('precio_unitario'), max_precio=Max('precio_unitario'))
    
    @staticmethod
    #Procedimiento Almacenado de Actualización: Si hacemos un análisis de Proveedor, actualizamos la fecha 'ultima_actualizacion' en la tabla ProveedorProducto
    def _registrar_auditoria_silenciosa(proveedor_id):
        """
        Método 'Fire-and-forget'. Intenta registrar la auditoría, pero si falla, no detiene nada.
        """
        if not proveedor_id:
            return
            
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "{CALL sp_ActualizarAuditoriaCatalogo (@ProveedorID=%s)}",
                    [proveedor_id]
                )
        except Exception as e:
            print(f" Error silencioso de auditoría en SP: {e}")
            pass # El "pass" garantiza que el sistema siga funcionando, pero nos informa que no se hizo la actualización para verificar que funcione el procedimiento.