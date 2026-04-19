"""
Descripción: Definición de rutas de la API de Proveedores.
             Nomenclatura de vistas alineada al documento de IS.

Tabla de endpoints:
┌──────────────────────────────────────────────┬────────┬─────────────────────────────────────────┐
│ URL                                          │ Método │ Función / Caso de Uso                   │
├──────────────────────────────────────────────┼────────┼─────────────────────────────────────────┤
│ /api/proveedores/                            │ GET    │ verProveedores (activos)                │
│ /api/proveedores/?todos=true                 │ GET    │ verProveedores (todos)                  │
│ /api/proveedores/                            │ POST   │ agregarProveedor                        │
│ /api/proveedores/<int:pk>/                   │ GET    │ verProveedor (detalle)                  │
│ /api/proveedores/<int:pk>/                   │ PUT    │ editarProveedor (completo)              │
│ /api/proveedores/<int:pk>/                   │ PATCH  │ editarProveedor (parcial)               │
│ /api/proveedores/<int:pk>/                   │ DELETE │ eliminarProveedor (baja lógica)         │
│ /api/proveedores/<int:pk>/reactivar/         │ PATCH  │ reactivarProveedor (Admin)              │
└──────────────────────────────────────────────┴────────┴─────────────────────────────────────────┘
"""

from django.urls import path
from .views import (
    ProveedorListaView,
    ProveedorDetalleView,
    ProveedorReactivarView,
)

urlpatterns = [
    # verProveedores + agregarProveedor
    path(
        "proveedores/",
        ProveedorListaView.as_view(),
        name="proveedor-lista",
    ),
    # verProveedor + editarProveedor + eliminarProveedor
    path(
        "proveedores/<int:pk>/",
        ProveedorDetalleView.as_view(),
        name="proveedor-detalle",
    ),
    # reactivarProveedor (Admin)
    path(
        "proveedores/<int:pk>/reactivar/",
        ProveedorReactivarView.as_view(),
        name="proveedor-reactivar",
    ),
]