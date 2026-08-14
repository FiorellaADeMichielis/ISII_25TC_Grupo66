
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.core.exceptions import ObjectDoesNotExist

from services import proveedor_services
from ..models import Usuario, Producto
from ..serializers import UsuarioRegistroSerializer, ProductoSerializer, ProvITTokenSerializer
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import date
from ..services import pedido_services
from ..services.estadisticas_services import ServicioAnalisisCompras

from ..services.usuarios_gerente_services import ServicioUsuariosGerente
from ProvIT.backend.proveedores_app.views.permisos_helpers_views import respuestaError, respuestaExitosa
# ===========================================================================
# CONTROLADORES DE ESTADÍSTICAS — ANÁLISIS DE COMPRAS INTELIGENTE
# ===========================================================================
 
class EstadisticasFiltrosView(APIView):
    """
    GET /api/estadisticas/filtros/
 
    Caso de Uso: Análisis de Compra — Cargar filtros del formulario.
    Actor: Operador / Administrador / Gerente
 
    Retorna los proveedores activos, todos los productos y el mapa de qué productos ofrece cada proveedor.
    El frontend usa la rta para construir los dropdowns de Proveedor y Producto en cascada.
 
    Respuesta 200:
    {
        "success": true,
        "data": {
            "proveedores": [ { "id_proveedor": 1, "nombre_proveedor": "..." } ],
            "productos":   [ { "id_producto": 1, "nombre_producto": "..." } ],
            "productos_por_proveedor": { "1": [ {...}, {...} ] }
        }
    }
    """
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        data = ServicioAnalisisCompras.verFiltrosAnalisis()
        return respuestaExitosa(data=data)
 
 
class EstadisticasAnalisisProveedorView(APIView):
    """
    GET /api/estadisticas/analisis-proveedor/
 
    Caso de Uso: Análisis de Compra — Análisis individual de un proveedor.
    Actor: Operador / Administrador / Gerente
 
    Query params obligatorios:
        proveedor_id  (int)   → ID del proveedor a analizar
        fecha_inicio  (date)  → Inicio del período (formato: YYYY-MM-DD)
        fecha_fin     (date)  → Fin del período (formato: YYYY-MM-DD)
 
    Query params opcionales:
        producto_id   (int)   → Si se omite, analiza todos los productos del proveedor
 
    Respuesta 200:
    {
        "success": true,
        "data": {
            "proveedor":     { "id": 1, "nombre": "Distribuidora Norte" },
            "producto_id":   null,
            "periodo":       { "desde": "2021-01-01", "hasta": "2025-12-31" },
            "graficaTorta":  { "precio": 4.2, "calidad": 3.8, "velocidad": 4.5 },
            "graficaLineas": [
                { "anio": 2021, "precio": 3.0, "calidad": 4.0, "velocidad": 5.0 },
                { "anio": 2022, "precio": 3.5, "calidad": 4.0, "velocidad": 4.0 },
                ...
            ],
            "recomendacion": "El proveedor ... obtuvo un puntaje de ..."
        }
    }
 
    Respuesta 400: Parámetros inválidos o faltantes.
    Respuesta 404: Proveedor no encontrado.
    """
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        # ── Lectura de parámetros ─────────────────────────────────────────
        proveedor_id = request.query_params.get('proveedor_id')
        producto_id  = request.query_params.get('producto_id')
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin    = request.query_params.get('fecha_fin')
 
        # ── Validación de parámetros obligatorios ─────────────────────────
        if not proveedor_id or not fecha_inicio or not fecha_fin:
            return respuestaError({
                'detalle': (
                    "Los parámetros 'proveedor_id', 'fecha_inicio' y 'fecha_fin' "
                    "son obligatorios."
                )
            })
 
        # ── Conversión y validación de tipos ──────────────────────────────
        try:
            proveedor_id = int(proveedor_id)
            fecha_inicio = date.fromisoformat(fecha_inicio)
            fecha_fin    = date.fromisoformat(fecha_fin)
            producto_id  = int(producto_id) if producto_id else None
        except (ValueError, TypeError):
            return respuestaError({
                'detalle': (
                    "Parámetros inválidos. "
                    "Las fechas deben estar en formato YYYY-MM-DD y los IDs deben ser enteros."
                )
            })
 
        if fecha_inicio > fecha_fin:
            return respuestaError({
                'detalle': "La fecha de inicio no puede ser posterior a la fecha de fin."
            })
 
        # ── Ejecución del servicio ─────────────────────────────────────────
        try:
            data = ServicioAnalisisCompras.verAnalisisProveedor(
                proveedor_id=proveedor_id,
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin,
                producto_id=producto_id,
            )
            return respuestaExitosa(data=data)
 
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return respuestaError(
                {'detalle': f"Error interno al procesar el análisis: {str(e)}"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
 
    """
    class EstadisticasTopProveedoresView(APIView):
   
    GET /api/estadisticas/top-proveedores/
 
    Caso de Uso: Análisis de Compra — Ranking Top N Mejores/Peores.
    Actor: Operador / Administrador / Gerente
 
    Query params obligatorios:
        fecha_inicio  (date)         → Inicio del período (YYYY-MM-DD)
        fecha_fin     (date)         → Fin del período (YYYY-MM-DD)
 
    Query params opcionales:
        tipo          (str)          → 'mejor' (default) | 'peor'
        filtro_por    (str)          → 'proveedor' (default) | 'producto'
        variables     (list[str])    → precio | calidad | velocidad | todos (default)
                                       Enviar múltiples: ?variables=precio&variables=calidad
        limite        (int)          → Cantidad de resultados (default: 3)
 
    Respuesta 200:
    {
        "success": true,
        "data": {
            "tipo":       "mejor",
            "filtro_por": "proveedor",
            "variables":  ["todos"],
            "periodo":    { "desde": "2021-01-01", "hasta": "2025-12-31" },
            "graficaBarras": [
                { "nombre": "Proveedor 1", "puntaje": 4.5, "precio": 5.0, "calidad": 4.0, "velocidad": 4.5 },
                { "nombre": "Proveedor 2", "puntaje": 4.0, ... },
                { "nombre": "Proveedor 3", "puntaje": 3.8, ... }
            ],
            "graficaLineas": [
                { "anio": 2021, "Proveedor 1": 4.2, "Proveedor 2": 3.8, "Proveedor 3": 3.5 },
                { "anio": 2022, ... },
                ...
            ]
        }
    }
 
    Respuesta 400: Parámetros inválidos o faltantes.
    
    permission_classes = [IsAuthenticated]
 
    VARIABLES_VALIDAS = {'precio', 'calidad', 'velocidad', 'todos'}
 
    def get(self, request):
        # ── Lectura de parámetros ─────────────────────────────────────────
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin    = request.query_params.get('fecha_fin')
        tipo         = request.query_params.get('tipo', 'mejor')
        filtro_por   = request.query_params.get('filtro_por', 'proveedor')
        variables    = request.query_params.getlist('variables') or ['todos']
        limite_raw   = request.query_params.get('limite', '3')
 
        # ── Validación de parámetros obligatorios ─────────────────────────
        if not fecha_inicio or not fecha_fin:
            return respuestaError({
                'detalle': "Los parámetros 'fecha_inicio' y 'fecha_fin' son obligatorios."
            })
 
        # ── Conversión y validación de tipos ──────────────────────────────
        try:
            fecha_inicio = date.fromisoformat(fecha_inicio)
            fecha_fin    = date.fromisoformat(fecha_fin)
            limite       = int(limite_raw)
        except (ValueError, TypeError):
            return respuestaError({
                'detalle': "Formato de fecha inválido. Use YYYY-MM-DD. El límite debe ser un entero."
            })
 
        if fecha_inicio > fecha_fin:
            return respuestaError({
                'detalle': "La fecha de inicio no puede ser posterior a la fecha de fin."
            })
 
        # ── Validación de opciones ─────────────────────────────────────────
        if tipo not in ('mejor', 'peor'):
            return respuestaError({
                'detalle': "El parámetro 'tipo' debe ser 'mejor' o 'peor'."
            })
 
        if filtro_por not in ('proveedor', 'producto'):
            return respuestaError({
                'detalle': "El parámetro 'filtro_por' debe ser 'proveedor' o 'producto'."
            })
 
        variables_invalidas = set(variables) - self.VARIABLES_VALIDAS
        if variables_invalidas:
            return respuestaError({
                'detalle': (
                    f"Variables inválidas: {', '.join(variables_invalidas)}. "
                    f"Opciones válidas: {', '.join(self.VARIABLES_VALIDAS)}."
                )
            })
 
        if limite < 1 or limite > 10:
            return respuestaError({
                'detalle': "El límite debe ser un número entre 1 y 10."
            })
 
        # ── Ejecución del servicio ─────────────────────────────────────────
        try:
            data = verTopProveedores(
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin,
                variables=variables,
                tipo=tipo,
                filtro_por=filtro_por,
                limite=limite,
            )
            return respuestaExitosa(data=data)
 
        except Exception as e:
            return respuestaError(
                {'detalle': f"Error interno al calcular el ranking: {str(e)}"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
"""