"""
Descripción: Serializers DRF para el CRUD de Proveedores.
             - DireccionSerializer: serializa la dirección anidada dentro del proveedor.
             - ProveedorSerializer: serializa el proveedor con sus direcciones (lectura).
             - ProveedorWriteSerializer: valida y crea/edita proveedor + direcciones (escritura).
             Validaciones implementadas según HU#3.1 (CUIT único) y RF1.1/RF1.2.
"""

from rest_framework import serializers
from .models import Proveedor, Direccion, Localidad, Provincia


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
        Si algo falla, se hace rollback automático (atómico via services.py).
        """
        direcciones_data = validated_data.pop("direcciones", [])
        proveedor = Proveedor.objects.create(**validated_data)

        for dir_data in direcciones_data:
            Direccion.objects.create(fk_proveedor=proveedor, **dir_data)

        return proveedor

    # ------------------------------------------------------------------
    # Actualización con direcciones anidadas (estrategia: reemplazar)
    # ------------------------------------------------------------------

    def update(self, instance, validated_data):
        """
        Actualiza los campos del proveedor.
        Para las direcciones usa estrategia "reemplazar":
        elimina las existentes y recrea las nuevas.
        Esto simplifica la lógica para el MVP (HU#3.2).
        """
        direcciones_data = validated_data.pop("direcciones", None)

        # Actualizar campos del proveedor
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Si se envían direcciones, reemplazar las existentes
        if direcciones_data is not None:
            instance.direcciones.all().delete()
            for dir_data in direcciones_data:
                Direccion.objects.create(fk_proveedor=instance, **dir_data)

        return instance