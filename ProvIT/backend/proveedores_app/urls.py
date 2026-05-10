"""
Descripción: Definición de rutas de la API.
"""

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    ProveedorListaView,
    ProveedorDetalleView,
    ProveedorReactivarView,
    UsuarioRegistroView, 
)

urlpatterns = [
    # ==========================================
    # SEGURIDAD Y AUTENTICACIÓN
    # ==========================================
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("registro/", UsuarioRegistroView.as_view(), name="usuario_registro"),

    # ==========================================
    # MÓDULO PROVEEDORES
    # ==========================================
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