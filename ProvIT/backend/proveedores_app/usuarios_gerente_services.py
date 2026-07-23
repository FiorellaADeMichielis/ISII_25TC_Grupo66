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
    def buscarUsuario(cls, termino_busqueda):
        """
        Busca usuarios por Nombre, Apellido o Correo.
        El operador | (OR) junto con Q permite buscar en múltiples columnas a la vez.
        'icontains' ignora mayúsculas y minúsculas.
        """
        if not termino_busqueda:
            return cls.verUsuarios()

        # Primero excluimos al gerente, luego aplicamos los filtros de texto
        usuarios = Usuario.objects.select_related('fk_rol').exclude(fk_rol_id=3).filter(
            Q(nombre_usuario__icontains=termino_busqueda) |
            Q(apellido_usuario__icontains=termino_busqueda) |
            Q(correo_usuario__icontains=termino_busqueda)
        ).order_by('id_usuario')
        
        return [cls._formatear_usuario(u) for u in usuarios]

    @classmethod
    def filtrarUsuarios(cls, estado=None, rol_id=None):
        """
        Filtra la lista por Estado (1=Activo, 0=Inactivo) y/o Rol (1=Operador, 2=Administrador).
        Permite aplicar uno o ambos filtros de manera dinámica.
        """
        # Partimos de la base de todos los usuarios
        queryset = Usuario.objects.select_related('fk_rol').exclude(fk_rol_id=3)

        # Si se envió un filtro de estado, lo aplicamos
        if estado is not None:
            # Convertimos a booleano: asume que si llega un '1' o True, es activo.
            es_activo = str(estado) == '1' or estado is True
            queryset = queryset.filter(estado=es_activo)

        # Si se envió un filtro de rol, lo aplicamos
        if rol_id is not None:
            queryset = queryset.filter(fk_rol_id=rol_id)

        queryset = queryset.order_by('id_usuario')
        return [cls._formatear_usuario(u) for u in queryset]

    @staticmethod
    def _formatear_usuario(usuario):
        """
        Método auxiliar privado para estandarizar la salida a diccionarios.
        Facilita la conversión a JSON en las vistas (views.py).
        """
        return {
            'id_usuario': usuario.id_usuario,
            'nombre_completo': f"{usuario.nombre_usuario} {usuario.apellido_usuario}",
            'correo_usuario': usuario.correo_usuario,
            'estado': usuario.estado,  # True (1) = Activo, False (0) = Inactivo
            'rol_id': usuario.fk_rol.id_rol if usuario.fk_rol else None,
            'rol_nombre': usuario.fk_rol.nombre if usuario.fk_rol else "Sin rol"
        }

    
    """
    #HU-7.1 Gestion Usuarios: CRUD GERENTE
    Métodos de CRUD para la sección de Usuario en perfil Gerente:
    verUsuarios
    agregarUsuario(permite ingresar manualmente un usuario y asigna por default una contraseña con su DNI)
    editarUsuario(modificar su Cargo o permisos en el sistema)
    eliminarUsuario(baja lógica de Estado activo/inactivo, en inactivo se inhabilita el ingreso al sistema)
     """
    @classmethod
    def verUsuarios(cls):
        """
        Trae toda la lista de usuarios.
        Usa select_related para traer los datos del Rol en una sola consulta SQL (JOIN automático).
        """
        usuarios = Usuario.objects.select_related('fk_rol').exclude(fk_rol_id=3).order_by('id_usuario')
        return [cls._formatear_usuario(u) for u in usuarios]

    
    @classmethod
    def agregarUsuario(cls, nombre, apellido, dni, correo, rol_id):
        """
        Añade un usuario nuevo.
        Asigna el DNI como contraseña por defecto y lo encripta antes de guardarlo.
        """
        try:
            # Validación preventiva para no chocar con el "unique=True" del modelo
            if Usuario.objects.filter(correo_usuario=correo).exists():
                return {'success': False, 'mensaje': 'El correo ya está registrado en el sistema.'}
            
            # Encriptamos el DNI convertido a string
            password_hasheada = make_password(str(dni))

            nuevo_usuario = Usuario.objects.create(
                nombre_usuario=nombre,
                apellido_usuario=apellido,
                dni=dni,
                correo_usuario=correo,
                contrasena=password_hasheada,
                fk_rol_id=rol_id,
                estado=True  # Siempre nace activo
            )
            return {
                'success': True, 
                'mensaje': 'Usuario creado exitosamente. La contraseña temporal es su DNI.',
                'id_usuario': nuevo_usuario.id_usuario
            }
        except Exception as e:
            return {'success': False, 'mensaje': f'Error al guardar en base de datos: {e}'}

    @classmethod
    def eliminarUsuario(cls, usuario_id):
        """
        Baja (y alta) lógica del usuario. 
        Invierte el estado actual impidiendo o permitiendo su login.
        """
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            
            # Invertimos el estado (Baja/Alta lógica)
            usuario.estado = not usuario.estado 
            usuario.save()
            
            accion = "inactivado" if not usuario.estado else "reactivado"
            return {
                'success': True,
                'mensaje': f'Usuario {accion} correctamente.',
                'nuevo_estado': usuario.estado
            }
        except Usuario.DoesNotExist:
            return {'success': False, 'mensaje': 'El usuario no existe.'}

    @classmethod
    def editarUsuario(cls, usuario_id, nuevo_rol_id):
        """
        Modifica exclusivamente el Cargo (Rol) del usuario.
        Ej: Pasa de Operador (1) a Administrador (2).
        """
        try:
            # Traemos el usuario y su rol actual
            usuario = Usuario.objects.select_related('fk_rol').get(id_usuario=usuario_id)
            
            # Actualizamos la clave foránea directamente
            usuario.fk_rol_id = nuevo_rol_id
            usuario.save()
            
            # Refrescamos desde la BD para devolver el nombre del nuevo rol al frontend
            usuario.refresh_from_db()
            
            return {
                'success': True,
                'mensaje': 'Cargo actualizado correctamente.',
                'nuevo_rol': usuario.fk_rol.nombre
            }
        except Usuario.DoesNotExist:
            return {'success': False, 'mensaje': 'El usuario no existe.'}
        except Exception as e:
            return {'success': False, 'mensaje': f'Error al actualizar el cargo: {e}'}

    @classmethod
    def obtenerMetricas(cls):
        """
        Calcula las estadísticas generales de los usuarios para las tarjetas (KPIs).
        """
        # Partimos de la base excluyendo al Gerente (rol 3)
        base_qs = Usuario.objects.exclude(fk_rol_id=3)

        # Hacemos los conteos directamente en la BD para máxima velocidad
        return {
            "nombre": "Usuarios del Sistema",
            "total": base_qs.count(),
            "activos": base_qs.filter(estado=True).count(),
            "inactivos": base_qs.filter(estado=False).count(),
            "administradores": base_qs.filter(fk_rol_id=2).count(),
            "operadores": base_qs.filter(fk_rol_id=1).count(),
            "estaCargando": False
        }