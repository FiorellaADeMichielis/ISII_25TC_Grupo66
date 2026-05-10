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

from . import services
from .models import Usuario
from .serializers import UsuarioRegistroSerializer

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
class UsuarioRegistroView(generics.CreateAPIView):
    """
    POST /api/registro/
    Caso de Uso: Registrar un nuevo usuario.
    Actor: Público (AllowAny)
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioRegistroSerializer
    permission_classes = [AllowAny] # Excepción de seguridad: No requiere JWT
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