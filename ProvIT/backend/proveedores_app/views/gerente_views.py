
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

# =============================================================================
# MÓDULO GERENTE: GESTIÓN DE USUARIOS
# =============================================================================

class UsuarioListarView(APIView):
    """
    GET /api/gerente/usuarios/
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
    POST /api/gerente/usuarios/agregar/
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
            return respuestaExitosa(data={'id_usuario': resultado['id_usuario']}, mensaje=resultado['mensaje'], status_code=status.HTTP_201_CREATED)
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


class UsuarioEditarView(APIView):
    """
    PATCH usuarios/{pk}/editar/
    Modificación parcial: actualiza únicamente los campos enviados en el JSON.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para editar usuarios.", status.HTTP_403_FORBIDDEN)

        # Extraemos los datos. Si el frontend no envía alguno, request.data.get() devuelve None
        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')
        dni = request.data.get('dni')
        correo = request.data.get('correo')
        rol_id = request.data.get('rol_id')

        # Validamos que nos hayan enviado AL MENOS un campo para editar
        if not any([nombre, apellido, dni, correo, rol_id]):
            return respuestaError("Debe enviar al menos un campo para actualizar.", status.HTTP_400_BAD_REQUEST)

        # Enviamos los datos al servicio (algunos tendrán valor, otros serán None)
        resultado = ServicioUsuariosGerente.editarUsuario(
            usuario_id=pk, 
            nombre=nombre, 
            apellido=apellido, 
            dni=dni, 
            correo=correo, 
            rol_id=rol_id
        )
        
        if resultado['success']:
            return respuestaExitosa(data=resultado['usuario_actualizado'], mensaje=resultado['mensaje'])
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)