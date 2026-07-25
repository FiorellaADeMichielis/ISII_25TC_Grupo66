"""
Descripción: Vistas DRF que exponen la API REST del CRUD de Proveedores.
             Patrón MVC: la View recibe el request HTTP, delega la lógica
             al service y devuelve un Response JSON estandarizado.

Nomenclatura de métodos alineada al documento de IS (Casos de Uso):
verProveedores / verProveedor / agregarProveedor /
             editarProveedor / eliminarProveedor / reactivarProveedor

Endpoints:
    GET    /api/proveedores/                  → verProveedores
    POST   /api/proveedores/                  → agregarProveedor
    GET    /api/proveedores/{id}/             → verProveedor
    PUT    /api/proveedores/{id}/             → editarProveedor (completo)
    PATCH  /api/proveedores/{id}/             → editarProveedor (parcial)
    DELETE /api/proveedores/{id}/             → eliminarProveedor (baja lógica)
    PATCH  /api/proveedores/{id}/reactivar/   → reactivarProveedor (Admin)
"""
"""
Descripción: Vistas DRF que exponen la API REST del sistema.
             Patrón MVC: la View (Controlador) recibe el request HTTP,
             valida permisos, delega la lógica al service y devuelve un JSON.
"""

from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.core.exceptions import ObjectDoesNotExist

from . import services, pedido_services
from .models import Usuario, Producto
from .serializers import UsuarioRegistroSerializer, ProductoSerializer, ProvITTokenSerializer
from rest_framework import generics

from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import date
from .estadisticas_services import ServicioAnalisisCompras

from .usuarios_gerente_services import ServicioUsuariosGerente
# ===========================================================================
# 1. PERMISOS PERSONALIZADOS (Role-Based Access Control)
# ===========================================================================
class EsAdministrador(BasePermission):
    """
    Regla de negocio (Seguridad): Permite el acceso únicamente a usuarios 
    con rol de Administrador (ID = 2).
    """
    message = "Acceso denegado. Se requieren privilegios de Administrador."

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.fk_rol.id_rol == 2
        )
# ===========================================================================
# 2. HELPERS (Estandarización de Respuestas)
# ===========================================================================

def respuestaExitosa(data=None, mensaje: str = None, codigo: int = status.HTTP_200_OK):
    cuerpo = {"success": True}
    if mensaje: cuerpo["mensaje"] = mensaje
    if data is not None: cuerpo["data"] = data
    return Response(cuerpo, status=codigo)

def respuestaError(detalle, codigo: int = status.HTTP_400_BAD_REQUEST):
    return Response({"success": False, "errores": detalle}, status=codigo)

# ===========================================================================
# 3. CONTROLADOR DE IDENTIDAD (Registro)
# ===========================================================================
class ProvITLoginView(TokenObtainPairView):
    """
    POST /api/login/
    Login personalizado que autentica contra el modelo Usuario de ProvIT.
    """
    serializer_class  = ProvITTokenSerializer
    permission_classes = [AllowAny]
# ===========================================================================
# 4. CONTROLADORES DEL MÓDULO PROVEEDORES
# ===========================================================================
class ProveedorListaView(APIView):
    """ GET y POST en /api/proveedores/ """
    permission_classes = [IsAuthenticated] # Blindaje JWT

    def get(self, request):
        solo_activos = request.query_params.get("todos", "false").lower() != "true"
        data = services.verProveedores(solo_activos=solo_activos)

        if not data:
            return respuestaExitosa(data=[], mensaje="No hay proveedores registrados.")
        return respuestaExitosa(data=data)

    def post(self, request):
        try:
            data = services.agregarProveedor(request.data)
            return respuestaExitosa(
                data=data,
                mensaje="Proveedor agregado exitosamente.",
                codigo=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return respuestaError(e.detail)

class ProveedorDetalleView(APIView):
    """ GET, PUT, PATCH, DELETE en /api/proveedores/{id}/ """
    permission_classes = [IsAuthenticated] # Blindaje JWT

    def get(self, request, pk):
        try:
            data = services.verProveedor(pk)
            return respuestaExitosa(data=data)
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        return self._editarProveedor(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._editarProveedor(request, pk, parcial=True)

    def _editarProveedor(self, request, pk, parcial: bool):
        try:
            data = services.editarProveedor(pk, request.data, parcial=parcial)
            return respuestaExitosa(data=data, mensaje="Proveedor actualizado exitosamente.")
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)

    def delete(self, request, pk):
        # Validación de roles manual para un método específico
        if request.user.fk_rol.id_rol != 2:
            return respuestaError("No tienes permisos de Administrador para dar de baja.", status.HTTP_403_FORBIDDEN)
        
        try:
            resultado = services.eliminarProveedor(pk)
            return respuestaExitosa(data=resultado["proveedor"], mensaje=resultado["mensaje"])
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)

class ProveedorReactivarView(APIView):
    """ PATCH /api/proveedores/{id}/reactivar/ """
    # Blindaje doble: Requiere JWT válido Y Rol de Administrador
    permission_classes = [IsAuthenticated, EsAdministrador]

    def patch(self, request, pk):
        try:
            resultado = services.reactivarProveedor(pk)
            return respuestaExitosa(data=resultado["proveedor"], mensaje=resultado["mensaje"])
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)
# ===========================================================================
# 5. CONTROLADORES DE CATÁLOGOS (Ubicaciones)
# ===========================================================================
class ProvinciaListaView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = services.verProvincias()
        return respuestaExitosa(data=data)

class LocalidadListaView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        provincia_id = request.query_params.get("provincia_id")
        if provincia_id and provincia_id.isdigit():
            provincia_id = int(provincia_id)
        else:
            provincia_id = None
        data = services.verLocalidades(provincia_id=provincia_id)
        return respuestaExitosa(data=data)

# ===========================================================================
# 6. CONTROLADORES DE ESTADÍSTICAS — ANÁLISIS DE COMPRAS INTELIGENTE
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
# ===========================================================================
# 7. CONTROLADORES DEL MÓDULO PEDIDOS
# ===========================================================================

class PedidoListaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Usamos pedido_services que importamos arriba
            data = pedido_services.verPedidos()
            if not data:
                return respuestaExitosa(data=[], mensaje="No hay pedidos registrados.")
            return respuestaExitosa(data=data)
        except Exception as e:
            return respuestaError(f"Error al obtener los pedidos: {str(e)}", status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        if request.user.fk_rol.id_rol != 1:
            return respuestaError("Acceso denegado. Solo los Operadores pueden registrar pedidos.", status.HTTP_403_FORBIDDEN)

        try:
            data = pedido_services.registrarPedido(request.data, request.user)
            return respuestaExitosa(
                data=data,
                mensaje="Pedido registrado exitosamente.",
                codigo=status.HTTP_201_CREATED,
            )
        except ObjectDoesNotExist:
            return respuestaError("El proveedor o el producto indicado no existe.", status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return respuestaError(f"Error al registrar el pedido: {str(e)}")


class PedidoRegistrarEntregaView(APIView):
    """ 
    PATCH /api/pedidos/{id}/entrega/ 
    Método de clase: registrarEntrega(fecha:Date)
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol not in [1, 2]:
            return respuestaError("No tienes permisos para registrar entregas.", status.HTTP_403_FORBIDDEN)

        fecha_entrega = request.data.get('fecha_entrega')
        if not fecha_entrega:
            return respuestaError("El campo 'fecha_entrega' es obligatorio.", status.HTTP_400_BAD_REQUEST)

        try:
            data = pedido_services.registrarEntrega(pk, fecha_entrega)
            return respuestaExitosa(data=data, mensaje="Entrega registrada exitosamente.")
        except ObjectDoesNotExist as e:
            return respuestaError(str(e), status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return respuestaError(f"Error al registrar entrega: {str(e)}")


class PedidoCambiarEstadoView(APIView):
    """ 
    PATCH /api/pedidos/{id}/estado/ 
    Método de clase: cambiarEstado(nuevoEstado:String)
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol not in [1, 2]:
            return respuestaError("No tienes permisos para cambiar el estado.", status.HTTP_403_FORBIDDEN)

        nuevo_estado = request.data.get('nuevo_estado')
        if not nuevo_estado:
            return respuestaError("El campo 'nuevo_estado' es obligatorio.", status.HTTP_400_BAD_REQUEST)

        try:
            data = pedido_services.cambiarEstado(pk, nuevo_estado)
            return respuestaExitosa(data=data, mensaje=f"Estado cambiado a {nuevo_estado}.")
        except ObjectDoesNotExist as e:
            return respuestaError(str(e), status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return respuestaError(f"Error al cambiar estado: {str(e)}")
        
# ===========================================================================
# 8. CONTROLADORES DEL MÓDULO PRODUCTOS   
# ===========================================================================

class ProductoListaView(generics.ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

# =============================================================================
# MÓDULO GERENTE: GESTIÓN DE USUARIOS
# =============================================================================

class UsuarioListarView(APIView):
    """
    GET /api/usuarios/
    Obtiene todos los usuarios, con opciones de búsqueda y filtro.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Validación de seguridad: Solo el Gerente (rol 3) puede ver esta pantalla
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos de Gerente para acceder a esta información.", status.HTTP_403_FORBIDDEN)

        # Usamos query_params propio de DRF en lugar de GET
        termino_busqueda = request.query_params.get('busqueda', None)
        estado = request.query_params.get('estado', None)
        rol_id = request.query_params.get('rol_id', None)

        if termino_busqueda:
            usuarios = ServicioUsuariosGerente.buscarUsuario(termino_busqueda)
        elif estado is not None or rol_id is not None:
            if rol_id:
                rol_id = int(rol_id)
            usuarios = ServicioUsuariosGerente.filtrarUsuarios(estado, rol_id)
        else:
            usuarios = ServicioUsuariosGerente.verUsuarios()

        return respuestaExitosa(data=usuarios, mensaje="Lista de usuarios obtenida.")


class UsuarioAgregarView(APIView):
    """
    POST /api/usuarios/registrar/
    Añade un nuevo usuario al sistema.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para agregar usuarios.", status.HTTP_403_FORBIDDEN)

        # DRF procesa automáticamente el JSON en request.data
        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')
        dni = request.data.get('dni')
        correo = request.data.get('correo')
        rol_id = request.data.get('rol_id')

        if not all([nombre, apellido, dni, correo, rol_id]):
            return respuestaError("Todos los campos son obligatorios.", status.HTTP_400_BAD_REQUEST)

        resultado = ServicioUsuariosGerente.agregarUsuario(nombre, apellido, dni, correo, rol_id)
        
        if resultado['success']:
            # ✅ VERSIÓN DEFINITIVA: Solo enviamos data y mensaje
            return respuestaExitosa(
                data={'id_usuario': resultado['id_usuario']}, 
                mensaje=resultado['mensaje']
            )
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)

class UsuarioEliminarView(APIView):
    """
    PATCH /api/gerente/usuarios/{pk}/eliminar/
    Realiza la baja/alta lógica del usuario (toggle de estado).
    Usamos PATCH porque modifica parcialmente el objeto.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para inhabilitar usuarios.", status.HTTP_403_FORBIDDEN)

        resultado = ServicioUsuariosGerente.eliminarUsuario(pk)
        
        if resultado['success']:
            return respuestaExitosa(data={'nuevo_estado': resultado['nuevo_estado']}, mensaje=resultado['mensaje'])
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_404_NOT_FOUND)

class UsuarioMetricasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            data = ServicioUsuariosGerente.obtenerMetricas()
            return respuestaExitosa(data=data, mensaje="Métricas obtenidas correctamente.")
        except Exception as e:
            # 🚀 ESTO EXPONDRÁ EL ERROR EXACTO EN TU PANTALLA O CONSOLA
            import traceback
            error_detallado = traceback.format_exc()
            print("--- ERROR EN MÉTRICAS ---")
            print(error_detallado)
            return Response(
                {"success": False, "errores": str(e), "detalles": error_detallado}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        
class UsuarioEditarRolView(APIView):
    """
    PATCH /api/gerente/usuarios/{pk}/editar-rol/
    Modifica el Cargo (Rol) de un usuario.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para cambiar roles.", status.HTTP_403_FORBIDDEN)

        nuevo_rol_id = request.data.get('nuevo_rol_id')
        if not nuevo_rol_id:
            return respuestaError("El campo 'nuevo_rol_id' es obligatorio.", status.HTTP_400_BAD_REQUEST)

        resultado = ServicioUsuariosGerente.editarUsuario(pk, nuevo_rol_id)
        
        if resultado['success']:
            return respuestaExitosa(data={'nuevo_rol': resultado['nuevo_rol']}, mensaje=resultado['mensaje'])
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)