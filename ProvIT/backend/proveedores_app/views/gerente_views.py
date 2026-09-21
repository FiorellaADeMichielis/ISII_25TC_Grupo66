from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ..services.usuarios_gerente_services import ServicioUsuariosGerente
from .permisos_helpers_views import respuestaExitosa, respuestaError

# =============================================================================
# MÓDULO GERENTE: GESTIÓN DE USUARIOS
# =============================================================================

class UsuarioListarView(APIView):
    """
    GET /api/usuarios/
    Obtiene todos los usuarios, combinando búsqueda por texto y filtros (estado/rol).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos de Gerente para acceder a esta información.", status.HTTP_403_FORBIDDEN)

        termino = request.query_params.get('buscar', None)  
        estado = request.query_params.get('estado', None)
        rol_id = request.query_params.get('rol_id', None)

        usuarios = ServicioUsuariosGerente.obtenerListaUsuarios(termino, estado, rol_id)
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

        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')
        dni = request.data.get('dni')
        correo = request.data.get('correo')
        rol_id = request.data.get('rol_id')

        if not all([nombre, apellido, dni, correo, rol_id]):
            return respuestaError("Todos los campos son obligatorios.", status.HTTP_400_BAD_REQUEST)

        resultado = ServicioUsuariosGerente.agregarUsuario(nombre, apellido, dni, correo, rol_id)
        
        if resultado['success']:
            return respuestaExitosa(
                data={'id_usuario': resultado['id_usuario']}, 
                mensaje=resultado['mensaje'],
                codigo=status.HTTP_201_CREATED
            )
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)


class UsuarioEliminarView(APIView):
    """
    PATCH /api/usuarios/{pk}/eliminar/
    Realiza la baja lógica del usuario (Fuerza el estado a False).
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para inhabilitar usuarios.", status.HTTP_403_FORBIDDEN)

        resultado = ServicioUsuariosGerente.eliminarUsuario(pk)
        
        if resultado['success']:
            return respuestaExitosa(data={'nuevo_estado': resultado['nuevo_estado']}, mensaje=resultado['mensaje'])
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)


class UsuarioReactivarView(APIView):
    """
    PATCH /api/usuarios/{pk}/reactivar/
    Realiza el alta lógica del usuario (Fuerza el estado a True).
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para reactivar usuarios.", status.HTTP_403_FORBIDDEN)

        resultado = ServicioUsuariosGerente.reactivarUsuario(pk)
        
        if resultado['success']:
            return respuestaExitosa(data={'nuevo_estado': resultado['nuevo_estado']}, mensaje=resultado['mensaje'])
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)


class UsuarioMetricasView(APIView):
    """
    GET /api/usuarios/metricas/
    Calcula los KPIs cuantitativos de la plantilla de usuarios para el Gerente.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos de Gerente para acceder a las métricas.", status.HTTP_403_FORBIDDEN)
        try:
            data = ServicioUsuariosGerente.obtenerMetricas()
            return respuestaExitosa(data=data, mensaje="Métricas obtenidas correctamente.")
        except Exception as e:
            import traceback
            error_detallado = traceback.format_exc()
            print("--- ERROR EN MÉTRICAS ---")
            print(error_detallado)
            return Response(
                {"success": False, "errores": str(e), "detalles": error_detallado}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UsuarioEditarView(APIView):
    """
    PUT /api/usuarios/{pk}/
    Permite actualizar los datos generales de un usuario (Nombre, Apellido, DNI, Correo, Rol)
    excluyendo la contraseña.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.fk_rol.id_rol != 3:
            return respuestaError("No tienes permisos para editar usuarios.", status.HTTP_403_FORBIDDEN)

        datos = request.data
        nombre = datos.get('nombre')
        apellido = datos.get('apellido')
        dni = datos.get('dni')
        correo = datos.get('correo')
        rol_id = datos.get('rol_id')

        if not all([nombre, apellido, dni, correo, rol_id]):
            return respuestaError("Todos los campos (nombre, apellido, dni, correo, rol_id) son obligatorios.", status.HTTP_400_BAD_REQUEST)

        resultado = ServicioUsuariosGerente.editarUsuario(
            usuario_id=pk,
            nombre=nombre,
            apellido=apellido,
            dni=dni,
            correo=correo,
            rol_id=rol_id
        )
        
        if resultado['success']:
            return respuestaExitosa(data=resultado['data'], mensaje=resultado['mensaje'])
        else:
            return respuestaError(resultado['mensaje'], status.HTTP_400_BAD_REQUEST)