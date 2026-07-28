from django.db.models import Q
from django.contrib.auth.hashers import make_password
from .models import Usuario, Rol

class ServicioUsuariosGerente:

    '''
    #Metodos HU-7.2 SeccionGerente: 
    Métodos para la sección de Usuario (realizar búsqueda, aplicar filtros)
    _formatear_usuario
    buscarUsuario
    filtrarUsuarios
    '''
    @classmethod
    def obtenerMetricas(cls):
        """
        Calcula los KPIs necesarios para las tarjetas superiores del dashboard de usuarios.
        Excluye al Gerente (fk_rol_id=3) para contar únicamente a los usuarios gestionados.
        """
        try:
            queryset_base = Usuario.objects.select_related('fk_rol').exclude(fk_rol_id=3)

            total = queryset_base.count()
            activos = queryset_base.filter(estado=True).count()
            inactivos = queryset_base.filter(estado=False).count()
            
            administradores = queryset_base.filter(fk_rol_id=2).count()
            operadores = queryset_base.filter(fk_rol_id=1).count()

            return {
                "nombre": "Resumen de Usuarios",
                "total": total,
                "activos": activos,
                "inactivos": inactivos,
                "administradores": administradores,
                "operadores": operadores
            }
        except Exception as e:
            raise Exception(f"Error al calcular las métricas de usuarios: {str(e)}")

    @classmethod
    def obtenerListaUsuarios(cls, termino=None, estado=None, rol_id=None):
        """
        Retorna la lista de usuarios. Permite combinar búsqueda de texto con 
        filtros exactos de estado y rol al mismo tiempo.
        """
        queryset = Usuario.objects.select_related('fk_rol').exclude(fk_rol_id=3)

        # 1. Filtro por texto (Buscador)
        if termino:
            queryset = queryset.filter(
                Q(nombre_usuario__icontains=termino) |
                Q(apellido_usuario__icontains=termino) |
                Q(correo_usuario__icontains=termino)
            )
            
        # 2. Filtro por Estado 
        if estado is not None and estado != '':
            es_activo = str(estado) == '1' or str(estado).lower() == 'true'
            queryset = queryset.filter(estado=es_activo)

        # 3. Filtro por Rol 
        if rol_id is not None and rol_id != '':
            queryset = queryset.filter(fk_rol_id=rol_id)

        queryset = queryset.order_by('id_usuario')
        return [cls._formatear_usuario(u) for u in queryset]

    
    @staticmethod
    def _formatear_usuario(usuario):
        # Manejo seguro por si el nombre del atributo del rol es 'nombre_rol' o 'nombre'
        nombre_rol = "Sin rol"
        if usuario.fk_rol:
            nombre_rol = getattr(usuario.fk_rol, 'nombre_rol', getattr(usuario.fk_rol, 'nombre', "Sin rol"))

        return {
            'id_usuario': usuario.id_usuario,
            'nombre_usuario': usuario.nombre_usuario,
            'apellido_usuario': usuario.apellido_usuario,
            'dni': usuario.dni,
            'correo_usuario': usuario.correo_usuario,
            'estado': usuario.estado,
            'fk_rol': usuario.fk_rol.id_rol if usuario.fk_rol else None,
            'rol': nombre_rol
        }

    @classmethod
    def verUsuarios(cls):
        usuarios = Usuario.objects.select_related('fk_rol').all()
        lista_resultado = []
        for u in usuarios:
            nombre_rol = "Sin rol"
            if u.fk_rol:
                nombre_rol = getattr(u.fk_rol, 'nombre_rol', getattr(u.fk_rol, 'nombre', "Sin rol"))

            lista_resultado.append({
                "id_usuario": u.id_usuario,
                "nombre_usuario": u.nombre_usuario,
                "apellido_usuario": u.apellido_usuario,
                "dni": u.dni,
                "correo_usuario": u.correo_usuario,
                "fk_rol": u.fk_rol.id_rol if u.fk_rol else None,
                "rol": nombre_rol,
                "estado": u.estado
            })
        return lista_resultado

    @classmethod
    def agregarUsuario(cls, nombre, apellido, dni, correo, rol_id):
        try:
            if Usuario.objects.filter(correo_usuario=correo).exists():
                return {'success': False, 'mensaje': 'El correo ya está registrado en el sistema.'}
            
            try:
                rol_obj = Rol.objects.get(pk=rol_id)
            except Rol.DoesNotExist:
                return {'success': False, 'mensaje': 'El rol seleccionado no es válido.'}

            password_hasheada = make_password(str(dni))

            nuevo_usuario = Usuario.objects.create(
                nombre_usuario=nombre,
                apellido_usuario=apellido,
                dni=dni,
                correo_usuario=correo,
                contrasena=password_hasheada,
                fk_rol=rol_obj,
                estado=True
            )
            return {
                'success': True, 
                'mensaje': 'Usuario creado exitosamente.',
                'id_usuario': nuevo_usuario.id_usuario
            }
        except Exception as e:
            return {'success': False, 'mensaje': f'Error al guardar en base de datos: {e}'}

    @classmethod
    def eliminarUsuario(cls, usuario_id):
        """
        Baja lógica: Fuerza el estado a False (Inactivo).
        """
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            
            # Seguridad: Si ya está inactivo, no hacemos nada
            if not usuario.estado:
                return {'success': False, 'mensaje': 'El usuario ya se encuentra inactivo.'}

            usuario.estado = False 
            usuario.save()
            
            return {
                'success': True,
                'mensaje': 'Usuario inactivado correctamente.',
                'nuevo_estado': usuario.estado
            }
        except Usuario.DoesNotExist:
            return {'success': False, 'mensaje': 'El usuario no existe.'}

    @classmethod
    def reactivarUsuario(cls, usuario_id):
        """
        Alta lógica: Fuerza el estado a True (Activo).
        """
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            
            # Seguridad: Si ya está activo, no hacemos nada
            if usuario.estado:
                return {'success': False, 'mensaje': 'El usuario ya se encuentra activo.'}

            usuario.estado = True 
            usuario.save()
            
            return {
                'success': True,
                'mensaje': 'Usuario reactivado correctamente.',
                'nuevo_estado': usuario.estado
            }
        except Usuario.DoesNotExist:
            return {'success': False, 'mensaje': 'El usuario no existe.'}
    @classmethod
    def editarUsuario(cls, usuario_id, nombre, apellido, dni, correo, rol_id):
        """
        Actualiza los datos generales de un usuario (Nombre, Apellido, DNI, Correo, Rol)
        excluyendo la contraseña por motivos de seguridad.
        """
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            
            # Validar unicidad de DNI y Correo si cambiaron
            if Usuario.objects.filter(dni=dni).exclude(id_usuario=usuario_id).exists():
                return {'success': False, 'mensaje': 'El DNI ingresado ya se encuentra registrado en el sistema.'}
            
            if Usuario.objects.filter(correo_usuario=correo).exclude(id_usuario=usuario_id).exists():
                return {'success': False, 'mensaje': 'El correo electrónico ya está en uso por otro usuario.'}

            try:
                rol_obj = Rol.objects.get(pk=rol_id)
            except Rol.DoesNotExist:
                return {'success': False, 'mensaje': 'El rol seleccionado no es válido.'}

            usuario.nombre_usuario = nombre
            usuario.apellido_usuario = apellido
            usuario.dni = dni
            usuario.correo_usuario = correo
            usuario.fk_rol = rol_obj
            usuario.save()
            
            return {
                'success': True,
                'mensaje': 'Usuario actualizado exitosamente.',
                'data': cls._formatear_usuario(usuario)
            }
        except Usuario.DoesNotExist:
            return {'success': False, 'mensaje': 'El usuario no existe.'}
        except Exception as e:
            return {'success': False, 'mensaje': f'Error al actualizar el usuario: {e}'}