"""
Descripción: Serializers DRF para el CRUD de Proveedores.
             - DireccionSerializer: serializa la dirección anidada dentro del proveedor.
             - ProveedorSerializer: serializa el proveedor con sus direcciones (lectura).
             - ProveedorWriteSerializer: valida y crea/edita proveedor + direcciones (escritura).
             Validaciones implementadas según HU#3.1 (CUIT único) y RF1.1/RF1.2.
"""
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from .models import Producto, Proveedor, Direccion, Localidad, Provincia, Usuario, Rol
from django.contrib.auth.hashers import make_password


class UsuarioRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nombre_usuario', 'apellido_usuario', 'dni', 'fk_rol', 'correo_usuario', 'contrasena']
        extra_kwargs = {
            'contrasena': {'write_only': True} # Evita que la contraseña se devuelva en el JSON de respuesta
        }
    def create(self, validated_data):
        # Asigna un rol por defecto si no viene en el request
        try:
            rol_elegido = validated_data['fk_rol']
        except Rol.DoesNotExist:
            raise serializers.ValidationError("El rol por defecto no existe en la base de datos.")
        # Hasheamos la contraseña (Seguridad Crítica)
        contrasena_hasheada = make_password(validated_data['contrasena'])
        # Creamos el usuario
        usuario = Usuario.objects.create(
            nombre_usuario=validated_data['nombre_usuario'],
            apellido_usuario=validated_data['apellido_usuario'],
            dni=validated_data['dni'],
            correo_usuario=validated_data['correo_usuario'],
            contrasena=contrasena_hasheada,
            fk_rol=rol_elegido,
            estado=True
        )
        return usuario

class UsuarioUpdateSerializer(serializers.ModelSerializer):
    """
    Serializa y valida la actualización de usuarios desde el panel de gerencia.
    """
    nombre = serializers.CharField(source='nombre_usuario')
    apellido = serializers.CharField(source='apellido_usuario')
    correo = serializers.EmailField(source='correo_usuario')
    dni = serializers.IntegerField()
    
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(), 
        source='fk_rol'
    )

    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nombre', 'apellido', 'dni', 'correo', 'rol_id', 'estado']
        read_only_fields = ['id_usuario']

    def validate_dni(self, value):
        qs = Usuario.objects.filter(dni=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("El DNI ingresado ya se encuentra registrado en el sistema.")
        return value

    def validate_correo(self, value):
        qs = Usuario.objects.filter(correo_usuario=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("El correo electrónico ya está en uso por otro usuario.")
        return value

    def update(self, instance, validated_data):
        instance.nombre_usuario = validated_data.get('nombre_usuario', instance.nombre_usuario)
        instance.apellido_usuario = validated_data.get('apellido_usuario', instance.apellido_usuario)
        instance.dni = validated_data.get('dni', instance.dni)
        instance.correo_usuario = validated_data.get('correo_usuario', instance.correo_usuario)
        instance.fk_rol = validated_data.get('fk_rol', instance.fk_rol)
        instance.save()
        return instance

    
class UsuarioListSerializer(serializers.ModelSerializer):
    """
    Serializer para listar los usuarios en la tabla del frontend.
    Incluye explícitamente el DNI y el nombre del rol asociado.
    """
    rol = serializers.CharField(source='fk_rol.nombre_rol', read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre_usuario',
            'apellido_usuario',
            'dni',            
            'correo_usuario',
            'fk_rol',
            'rol',
            'estado'
        ]
# ---------------------------------------------------------------------------
# Serializers de catálogos (sólo lectura, para los dropdowns del frontend)
# ---------------------------------------------------------------------------
class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ["id_provincia", "nombre_provincia"]

class LocalidadSerializer(serializers.ModelSerializer):
    provincia = ProvinciaSerializer(source="fk_provincia", read_only=True)

    class Meta:
        model = Localidad
        fields = ["id_localidad", "codigo_postal", "nombre_localidad", "provincia"]
# ---------------------------------------------------------------------------
# Serializers de Direccion
# ---------------------------------------------------------------------------
class DireccionSerializer(serializers.ModelSerializer):
    """
    Usado para leer direcciones con detalle de localidad/provincia.
    """
    localidad = LocalidadSerializer(source="fk_localidad", read_only=True)
    class Meta:
        model = Direccion
        fields = ["id_direccion", "calle", "altura", "localidad"]

class DireccionWriteSerializer(serializers.ModelSerializer):
    """
    Usado para crear/editar direcciones dentro del proveedor.
    Recibe sólo los IDs de FK (fk_localidad).
    """
    class Meta:
        model = Direccion
        fields = ["id_direccion", "calle", "altura", "fk_localidad"]
        extra_kwargs = {
            "id_direccion": {"required": False},    # Opcional en creación
        }

# ---------------------------------------------------------------------------
# Serializer de Proveedor — Lectura (GET list / GET detail)
# ---------------------------------------------------------------------------
class ProveedorSerializer(serializers.ModelSerializer):
    """
    Representación completa del proveedor, con direcciones anidadas y detalladas.
    Se usa en GET /proveedores/ y GET /proveedores/{id}/.
    """
    direcciones = DireccionSerializer(many=True, read_only=True)

    class Meta:
        model = Proveedor
        fields = [
            "id_proveedor",
            "nombre_proveedor",
            "telefono",
            "correo_proveedor",
            "cuit",
            "estado",
            "score_riesgo_actual",
            "direcciones",
        ]

# ---------------------------------------------------------------------------
# Serializer de Proveedor — Escritura (POST / PUT / PATCH)
# ---------------------------------------------------------------------------
class ProveedorWriteSerializer(serializers.ModelSerializer):
    """
    Crea o edita un proveedor junto con sus direcciones.
    Recibe las direcciones como lista anidada.

    Payload de ejemplo:
    {
        "nombre_proveedor": "Distribuidora Norte S.A.",
        "telefono": "3794123456",
        "correo_proveedor": "contacto@norte.com",
        "cuit": "30123456789",
        "direcciones": [
            { "calle": "San Juan", "altura": 1500, "fk_localidad": 1 }
        ]
    }
    """
    direcciones = DireccionWriteSerializer(many=True, required=False)
    class Meta:
        model = Proveedor
        fields = [
            "nombre_proveedor",
            "telefono",
            "correo_proveedor",
            "cuit",
            "direcciones",
        ]

    # ------------------------------------------------------------------
    # Validaciones de negocio
    # ------------------------------------------------------------------
    def validate_cuit(self, value):
        """
        RF1.1 / HU#3.1: El CUIT debe ser único.
        En edición se excluye el proveedor actual para permitir guardar sin cambiar el CUIT.
        """
        # Limpiar guiones por si el usuario los ingresó
        value = value.replace("-", "").strip()

        # Validar que sean sólo dígitos y longitud correcta (11 dígitos)
        if not value.isdigit() or len(value) != 11:
            raise serializers.ValidationError(
                "El CUIT debe contener exactamente 11 dígitos numéricos."
            )

        # Verificar unicidad (excluir instancia actual en update)
        qs = Proveedor.objects.filter(cuit=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "El proveedor ya existe. El CUIT ingresado ya está registrado en el sistema."
            )
        return value
    def validate_nombre_proveedor(self, value):
        """Nombre no puede ser vacío ni sólo espacios."""
        if not value or not value.strip():
            raise serializers.ValidationError(
                "El nombre del proveedor es obligatorio."
            )
        return value.strip()

    # ------------------------------------------------------------------
    # Creación con direcciones anidadas
    # ------------------------------------------------------------------
    def create(self, validated_data):
        """
        Crea el proveedor y sus direcciones en una sola transacción.
        """
        # Saca las direcciones validadas para evitar conflictos
        validated_data.pop("direcciones", [])
        proveedor = Proveedor.objects.create(**validated_data)
        # Lee directamente del payload original (initial_data)
        direcciones_raw = self.initial_data.get("direcciones", [])

        for dir_data in direcciones_raw:
            Direccion.objects.create(
                fk_proveedor=proveedor,
                calle=dir_data.get("calle"),
                altura=dir_data.get("altura"),
                fk_localidad_id=dir_data.get("fk_localidad") # Usa _id para asignar directamente el número
            )

        return proveedor

    # ------------------------------------------------------------------
    # Actualización con direcciones anidadas (estrategia: reemplazar)
    # ------------------------------------------------------------------

    def update(self, instance, validated_data):
        """
        Actualiza los campos del proveedor.
        Para las direcciones usa estrategia "reemplazar".
        """
        # Evita que DRF intente guardar las direcciones anidadas
        validated_data.pop("direcciones", None)
        # Actualiza campos del proveedor
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        direcciones_raw = self.initial_data.get("direcciones", None)
        # Si se envían direcciones, reemplaza las existentes
        if direcciones_raw is not None:
            instance.direcciones.all().delete()
            for dir_data in direcciones_raw:
                Direccion.objects.create(
                    fk_proveedor=instance,
                    calle=dir_data.get("calle"),
                    altura=dir_data.get("altura"),
                    fk_localidad_id=dir_data.get("fk_localidad") # Usa _id para asignar directamente el número
                )
        return instance

    # -------------------------------------------------------------
    # AUTENTICACIÓN JWT PERSONALIZADA
    # Permite login con correo_usuario en lugar de username desde la BD
    # -------------------------------------------------------------
class ProvITTokenSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado que autentica contra el modelo Usuario
    propio de ProvIT usando correo_usuario + contrasena.
    Reemplaza el comportamiento por defecto de SimpleJWT que busca
    en auth_user de Django.
    """
    # Reemplazamos los campos por defecto (username/password)
    username_field = 'username'

    username = serializers.EmailField()    # ← acepta "username" del frontend
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        correo   = attrs.get('username')   # ← leer como "username"
        password = attrs.get('password')

        try:
            usuario = Usuario.objects.select_related('fk_rol').get(
                correo_usuario=correo      # ← buscar por correo_usuario en la BD
            )
        except Usuario.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Credenciales inválidas. Por favor, verifica tus datos."}
            )

        # Verificar contraseña hasheada con check_password de Django
        if not check_password(password, usuario.contrasena):
            raise serializers.ValidationError(
                {"detail": "Credenciales inválidas. Por favor, verifica tus datos."}
            )

        # Verificar que el usuario esté activo
        if not usuario.estado:
            raise serializers.ValidationError(
                {"detail": "El usuario se encuentra inactivo. Contactá al administrador."}
            )

        # Generar el token JWT manualmente con datos del usuario ProvIT
        refresh = RefreshToken()
        refresh['user_id']  = usuario.id_usuario
        refresh['nombre']   = usuario.nombre_usuario
        refresh['apellido'] = usuario.apellido_usuario
        refresh['email']    = usuario.correo_usuario
        refresh['rol']      = usuario.fk_rol.id_rol

        return {
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        }
    
# ===========================================================================
#Producto Serializer
# ===========================================================================
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'