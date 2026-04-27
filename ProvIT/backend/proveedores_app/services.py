"""
Descripción: Capa de servicio (lógica de negocio) para el CRUD de Proveedores.
             Las views delegan en estos métodos para mantener el patrón MVC limpio:
             - View    → recibe HTTP, delega al service, devuelve Response.
             - Service → contiene las reglas de negocio y acceso a datos.
             - Model   → sólo estructura de datos.
 
             Toda operación de escritura usa transaction.atomic() para garantizar
             consistencia en SQL Server (RF-01, RNF-05).
 
Funciones con nombres alineado a Casos de Uso:
    - verProveedores()
    - verProveedor()
    - agregarProveedor()
    - editarProveedor()
    - eliminarProveedor()
    - reactivarProveedor()
"""
 
from django.db import transaction
from rest_framework.exceptions import NotFound, ValidationError
from .models import Proveedor
from .serializers import ProveedorSerializer, ProveedorWriteSerializer
from .models import Provincia, Localidad
from .serializers import ProvinciaSerializer, LocalidadSerializer

def verProvincias():
    """Devuelve todas las provincias ordenadas alfabéticamente."""
    provincias = Provincia.objects.all().order_by('nombre_provincia')
    return ProvinciaSerializer(provincias, many=True).data

def verLocalidades(provincia_id=None):
    """
    Devuelve las localidades. Si se pasa provincia_id, filtra por esa provincia.
    """
    if provincia_id is not None:
        localidades = Localidad.objects.filter(fk_provincia=provincia_id)
    else:
        localidades = Localidad.objects.all()
        
    localidades = localidades.order_by('nombre_localidad')
    return LocalidadSerializer(localidades, many=True).data
# ---------------------------------------------------------------------------
# Caso de Uso: Ver Proveedores (HU#3.x / RF1.1)
# Actores: Operador / Administrador / Gerente
# ---------------------------------------------------------------------------
 
def verProveedores(solo_activos: bool = True) -> list:
    """
    Devuelve la lista de proveedores serializada.
 
    Parámetros:
        solo_activos (bool): Si True, filtra sólo proveedores con estado=True.
                             Si False, devuelve todos (uso administrativo).
 
    Regla de negocio:
        - HU#3.3: Los proveedores dados de baja (estado=False) NO aparecen
          en el listado principal.
        - El módulo de análisis de riesgo puede pedir todos (solo_activos=False).
    """
    if solo_activos:
        queryset = Proveedor.objects.filter(estado=True).prefetch_related(
            "direcciones__fk_localidad__fk_provincia"
        )
    else:
        queryset = Proveedor.objects.all().prefetch_related(
            "direcciones__fk_localidad__fk_provincia"
        )
 
    serializer = ProveedorSerializer(queryset, many=True)
    return serializer.data
 
 
# ---------------------------------------------------------------------------
# Caso de Uso: Ver Proveedor (detalle individual)
# Actores: Operador / Administrador / Gerente
# ---------------------------------------------------------------------------
 
def verProveedor(id_proveedor: int) -> dict:
    """
    Retorna el detalle completo de un proveedor por su ID.
 
    Lanza NotFound (HTTP 404) si el proveedor no existe.
    """
    try:
        proveedor = Proveedor.objects.prefetch_related(
            "direcciones__fk_localidad__fk_provincia"
        ).get(pk=id_proveedor)
    except Proveedor.DoesNotExist:
        raise NotFound(
            detail=f"No se encontró un proveedor con ID {id_proveedor}."
        )
 
    serializer = ProveedorSerializer(proveedor)
    return serializer.data
 
 
# ---------------------------------------------------------------------------
# Caso de Uso: Agregar Proveedor  (HU#3.1 / RF1.1)
# Actor: Operador
# ---------------------------------------------------------------------------
@transaction.atomic
def agregarProveedor(data: dict) -> dict:
    """
    Crea un nuevo proveedor junto con sus direcciones.
 
    Parámetros:
        data (dict): Payload del request (nombre, CUIT, teléfono, etc.)
 
    Retorna:
        dict con los datos del proveedor creado (incluye id_proveedor asignado).
 
    Lanza:
        ValidationError (HTTP 400) si los datos no son válidos.
 
    Reglas de negocio:
        - HU#3.1: El CUIT debe ser único. Si ya existe, bloquea el guardado
          y muestra "El proveedor ya existe".
        - RF1.1: Se registra el proveedor con sus contactos y dirección.
        - @transaction.atomic: Si la creación de una dirección falla,
          el proveedor tampoco se guarda (consistencia total en SQL Server).
    """
    serializer = ProveedorWriteSerializer(data=data)
 
    if not serializer.is_valid():
        raise ValidationError(serializer.errors)
 
    proveedor = serializer.save()
 
    # Devolver representación completa con direcciones detalladas
    return ProveedorSerializer(proveedor).data
 
 
# ---------------------------------------------------------------------------
# Caso de Uso: Editar Proveedor  (HU#3.2 / RF1.2)
# Actor: Operador
# ---------------------------------------------------------------------------
 
@transaction.atomic
def editarProveedor(id_proveedor: int, data: dict, parcial: bool = False) -> dict:
    """
    Actualiza los datos de un proveedor existente.
 
    Parámetros:
        id_proveedor (int): PK del proveedor a modificar.
        data (dict): Payload con los campos a actualizar.
        parcial (bool): Si True, permite actualizar sólo algunos campos (PATCH).
                        Si False, requiere todos los campos (PUT).
 
    Reglas de negocio:
        - HU#3.2: El operador puede modificar cualquier campo del proveedor.
        - La validación de CUIT único excluye el proveedor actual al editar.
        - @transaction.atomic: El proveedor y sus direcciones se actualizan
          en conjunto o ninguno (consistencia total).
    """
    try:
        proveedor = Proveedor.objects.get(pk=id_proveedor)
    except Proveedor.DoesNotExist:
        raise NotFound(
            detail=f"No se encontró un proveedor con ID {id_proveedor}."
        )
 
    serializer = ProveedorWriteSerializer(
        proveedor, data=data, partial=parcial
    )
 
    if not serializer.is_valid():
        raise ValidationError(serializer.errors)
 
    proveedor_actualizado = serializer.save()
 
    return ProveedorSerializer(proveedor_actualizado).data
 
 
# ---------------------------------------------------------------------------
# Caso de Uso: Eliminar Proveedor — Baja Lógica  (HU#3.3 / RF1.3)
# Actor: Administrador
# ---------------------------------------------------------------------------
 
@transaction.atomic
def eliminarProveedor(id_proveedor: int) -> dict:
    """
    Realiza la baja lógica del proveedor cambiando su estado a False.
    NO elimina el registro de la base de datos (baja lógica).
 
    Parámetros:
        id_proveedor (int): PK del proveedor a desactivar.
 
    Reglas de negocio:
        - HU#3.3 / RF1.3: El proveedor pasa a estado=False ("Inactivo"),
          desapareciendo del listado principal y de las opciones de compra.
        - Si el proveedor ya está inactivo, retorna error 400.
        - La baja lógica preserva todo el historial de pedidos y facturas
          asociados (integridad referencial del DER).
 
    Retorna:
        dict con mensaje de confirmación y datos del proveedor.
    """
    try:
        proveedor = Proveedor.objects.get(pk=id_proveedor)
    except Proveedor.DoesNotExist:
        raise NotFound(
            detail=f"No se encontró un proveedor con ID {id_proveedor}."
        )
 
    if not proveedor.estado:
        raise ValidationError(
            {"detail": f"El proveedor '{proveedor.nombre_proveedor}' ya se encuentra inactivo."}
        )
 
    proveedor.estado = False
    proveedor.save(update_fields=["estado"])
 
    return {
        "mensaje": f"El proveedor '{proveedor.nombre_proveedor}' se dio de baja exitosamente.",
        "proveedor": ProveedorSerializer(proveedor).data,
    }
 
 
# ---------------------------------------------------------------------------
# Función auxiliar: Reactivar Proveedor  (uso exclusivo del Administrador)
# ---------------------------------------------------------------------------
 
@transaction.atomic
def reactivarProveedor(id_proveedor: int) -> dict:
    """
    Reactiva un proveedor previamente dado de baja (estado False → True).
    Acción reservada para el rol Administrador (RF-05).
 
    Parámetros:
        id_proveedor (int): PK del proveedor a reactivar.
    """
    try:
        proveedor = Proveedor.objects.get(pk=id_proveedor)
    except Proveedor.DoesNotExist:
        raise NotFound(
            detail=f"No se encontró un proveedor con ID {id_proveedor}."
        )
 
    if proveedor.estado:
        raise ValidationError(
            {"detail": f"El proveedor '{proveedor.nombre_proveedor}' ya se encuentra activo."}
        )
 
    proveedor.estado = True
    proveedor.save(update_fields=["estado"])
 
    return {
        "mensaje": f"El proveedor '{proveedor.nombre_proveedor}' fue reactivado exitosamente.",
        "proveedor": ProveedorSerializer(proveedor).data,
    }