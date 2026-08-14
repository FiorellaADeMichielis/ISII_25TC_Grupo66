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

from services import proveedor_services
from ..models import Usuario, Producto
from ..serializers import UsuarioRegistroSerializer, ProductoSerializer, ProvITTokenSerializer
from rest_framework import generics

from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import date
from ..services import pedido_services
from ..services.estadisticas_services import ServicioAnalisisCompras

from ..services.usuarios_gerente_services import ServicioUsuariosGerente
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
# 5. CONTROLADORES DE CATÁLOGOS (Ubicaciones)
# ===========================================================================
class ProvinciaListaView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = proveedor_services.verProvincias()
        return respuestaExitosa(data=data)

class LocalidadListaView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        provincia_id = request.query_params.get("provincia_id")
        if provincia_id and provincia_id.isdigit():
            provincia_id = int(provincia_id)
        else:
            provincia_id = None
        data = proveedor_services.verLocalidades(provincia_id=provincia_id)
        return respuestaExitosa(data=data)

# ===========================================================================
# 8. CONTROLADORES DEL MÓDULO PRODUCTOS   
# ===========================================================================

class ProductoListaView(generics.ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


