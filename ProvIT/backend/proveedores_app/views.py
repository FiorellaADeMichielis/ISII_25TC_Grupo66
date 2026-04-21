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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from django.shortcuts import render
from . import services


# ---------------------------------------------------------------------------
# Helper: formato de respuesta JSON estandarizado
# ---------------------------------------------------------------------------

def respuestaExitosa(data=None, mensaje: str = None, codigo: int = status.HTTP_200_OK):
    """
    Estructura uniforme para respuestas exitosas:
    { "success": true, "mensaje": "...", "data": { ... } }
    """
    cuerpo = {"success": True}
    if mensaje:
        cuerpo["mensaje"] = mensaje
    if data is not None:
        cuerpo["data"] = data
    return Response(cuerpo, status=codigo)


def respuestaError(detalle, codigo: int = status.HTTP_400_BAD_REQUEST):
    """
    Estructura uniforme para respuestas de error:
    { "success": false, "errores": { ... } }
    """
    return Response({"success": False, "errores": detalle}, status=codigo)


# ---------------------------------------------------------------------------
# Vista: Listado y Creación  →  /api/proveedores/
# ---------------------------------------------------------------------------

class ProveedorListaView(APIView):
    """
    Agrupa los casos de uso que operan sobre la colección de proveedores.

    GET  /api/proveedores/   → verProveedores
    POST /api/proveedores/   → agregarProveedor
    """

    def get(self, request):
        """
        Caso de Uso: Ver Proveedores
        Actor: Operador / Administrador / Gerente

        Lista proveedores activos (estado=True) por defecto.
        Query param ?todos=true devuelve también los inactivos (uso Admin).

        Respuesta 200:
        {
            "success": true,
            "data": [ { "id_proveedor": 1, "nombre_proveedor": "...", ... } ]
        }
        Respuesta 200 sin registros:
        {
            "success": true,
            "mensaje": "No hay proveedores registrados.",
            "data": []
        }
        """
        solo_activos = request.query_params.get("todos", "false").lower() != "true"
        data = services.verProveedores(solo_activos=solo_activos)

        if not data:
            return respuestaExitosa(
                data=[],
                mensaje="No hay proveedores registrados.",
            )

        return respuestaExitosa(data=data)

    def post(self, request):
        """
        Caso de Uso: Agregar Proveedor
        Actor: Operador

        Body esperado:
        {
            "nombre_proveedor": "Distribuidora Norte S.A.",
            "telefono": "3794123456",
            "correo_proveedor": "contacto@norte.com",
            "cuit": "30123456789",
            "direcciones": [
                { "calle": "San Juan", "altura": 1500, "fk_localidad": 1 }
            ]
        }

        Respuesta 201:
        { "success": true, "mensaje": "Proveedor agregado exitosamente.", "data": { ... } }

        Respuesta 400 (CUIT duplicado):
        { "success": false, "errores": { "cuit": ["El proveedor ya existe..."] } }
        """
        try:
            data = services.agregarProveedor(request.data)
            return respuestaExitosa(
                data=data,
                mensaje="Proveedor agregado exitosamente.",
                codigo=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return respuestaError(e.detail)


# ---------------------------------------------------------------------------
# Vista: Detalle, Edición y Baja  →  /api/proveedores/{id}/
# ---------------------------------------------------------------------------

class ProveedorDetalleView(APIView):
    """
    Agrupa los casos de uso que operan sobre un proveedor individual.

    GET    /api/proveedores/{id}/  → verProveedor
    PUT    /api/proveedores/{id}/  → editarProveedor (completo)
    PATCH  /api/proveedores/{id}/  → editarProveedor (parcial)
    DELETE /api/proveedores/{id}/  → eliminarProveedor (baja lógica)
    """

    def get(self, request, pk):
        """
        Caso de Uso: Ver Proveedor (detalle)
        Actor: Operador / Administrador / Gerente

        Respuesta 200:
        { "success": true, "data": { "id_proveedor": 1, ..., "direcciones": [...] } }

        Respuesta 404: No se encontró el proveedor.
        """
        try:
            data = services.verProveedor(pk)
            return respuestaExitosa(data=data)
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """
        Caso de Uso: Editar Proveedor — Actualización completa (PUT).
        Actor: Operador
        Requiere todos los campos en el body.
        """
        return self._editarProveedor(request, pk, parcial=False)

    def patch(self, request, pk):
        """
        Caso de Uso: Editar Proveedor — Actualización parcial (PATCH).
        Actor: Operador
        Sólo requiere los campos que se desean modificar.
        """
        return self._editarProveedor(request, pk, parcial=True)

    def _editarProveedor(self, request, pk, parcial: bool):
        """
        Lógica compartida para PUT y PATCH.
        Delega al service editarProveedor().
        """
        try:
            data = services.editarProveedor(pk, request.data, parcial=parcial)
            return respuestaExitosa(
                data=data,
                mensaje="Proveedor actualizado exitosamente.",
            )
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)

    def delete(self, request, pk):
        """
        Caso de Uso: Eliminar Proveedor — Baja lógica.
        Actor: Administrador

        Cambia estado a False. NO borra el registro físicamente (HU#3.3 / RF1.3).
        Preserva el historial de pedidos y facturas asociadas.

        Respuesta 200:
        { "success": true, "mensaje": "El proveedor se dio de baja exitosamente.", "data": {...} }

        Respuesta 400: El proveedor ya estaba inactivo.
        Respuesta 404: No se encontró el proveedor.
        """
        try:
            resultado = services.eliminarProveedor(pk)
            return respuestaExitosa(
                data=resultado["proveedor"],
                mensaje=resultado["mensaje"],
            )
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)


# ---------------------------------------------------------------------------
# Vista: Reactivar Proveedor  →  /api/proveedores/{id}/reactivar/
# ---------------------------------------------------------------------------

class ProveedorReactivarView(APIView):
    """
    PATCH /api/proveedores/{id}/reactivar/

    Caso de Uso: Reactivar Proveedor
    Actor: Administrador
    Reactiva un proveedor previamente dado de baja (estado False → True).
    """

    def patch(self, request, pk):
        """
        Respuesta 200:
        { "success": true, "mensaje": "El proveedor fue reactivado exitosamente.", "data": {...} }

        Respuesta 400: El proveedor ya estaba activo.
        Respuesta 404: No se encontró el proveedor.
        """
        try:
            resultado = services.reactivarProveedor(pk)
            return respuestaExitosa(
                data=resultado["proveedor"],
                mensaje=resultado["mensaje"],
            )
        except NotFound as e:
            return respuestaError(str(e.detail), status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return respuestaError(e.detail)
        
# ---------------------------------------------------------------------------
# Funciones auxiliares para Provincias y Localidades (uso en formularios de dirección)
# ---------------------------------------------------------------------------
class ProvinciaListaView(APIView):
    """
    GET /api/provincias/
    Devuelve la lista completa de provincias.
    """
    def get(self, request):
        data = services.verProvincias()
        return respuestaExitosa(data=data)

class LocalidadListaView(APIView):
    """
    GET /api/localidades/ o /api/localidades/?provincia_id={id}
    Devuelve localidades, opcionalmente filtradas por provincia.
    """
    def get(self, request):
        provincia_id = request.query_params.get("provincia_id")

        if provincia_id and provincia_id.isdigit():
            provincia_id = int(provincia_id)
        else:
            provincia_id = None
            
        data = services.verLocalidades(provincia_id=provincia_id)
        return respuestaExitosa(data=data)