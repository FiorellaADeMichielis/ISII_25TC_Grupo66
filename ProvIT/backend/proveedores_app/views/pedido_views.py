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
#  CONTROLADORES DEL MÓDULO PEDIDOS
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
        