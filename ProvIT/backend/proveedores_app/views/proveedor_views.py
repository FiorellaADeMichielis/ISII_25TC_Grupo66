
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
from .permisos_helpers_views import respuestaExitosa, respuestaError, EsAdministrador

# ===========================================================================
# CONTROLADORES DEL MÓDULO PROVEEDORES
# ===========================================================================

class ProveedorListaView(APIView):
    """ GET y POST en /api/proveedores/ """
    permission_classes = [IsAuthenticated] # Blindaje JWT

    def get(self, request):
        solo_activos = request.query_params.get("todos", "false").lower() != "true"
        data = proveedor_services.verProveedores(solo_activos=solo_activos)

        if not data:
            return respuestaExitosa(data=[], mensaje="No hay proveedores registrados.")
        return respuestaExitosa(data=data)

    def post(self, request):
        try:
            data = proveedor_services.agregarProveedor(request.data)
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
            data = proveedor_services.verProveedor(pk)
            return respuestaExitosa(data=data)
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        return self._editarProveedor(request, pk, parcial=False)

    def patch(self, request, pk):
        return self._editarProveedor(request, pk, parcial=True)

    def _editarProveedor(self, request, pk, parcial: bool):
        try:
            data = proveedor_services.editarProveedor(pk, request.data, parcial=parcial)
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
            resultado = proveedor_services.eliminarProveedor(pk)
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
            resultado = proveedor_services.reactivarProveedor(pk)
            return respuestaExitosa(data=resultado["proveedor"], mensaje=resultado["mensaje"])
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)