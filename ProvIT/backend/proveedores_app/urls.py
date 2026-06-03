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
    ProvITLoginView,
    EstadisticasFiltrosView,
    EstadisticasAnalisisProveedorView,
    EstadisticasTopProveedoresView
)

urlpatterns = [
    # ==========================================
    # SEGURIDAD Y AUTENTICACIÓN
    # ==========================================
    path("login/", ProvITLoginView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("registro/", UsuarioRegistroView.as_view(), name="usuario_registro"),

    # ==========================================
    # MÓDULO PROVEEDORES: 
    # ==========================================
    #Acá tengo verProveedores + agregarProveedor
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
    
    # ==========================================
    # MÓDULO ESTADÍSTICAS (Análisis de Compras)
    # ==========================================
    # Obtiene los datos iniciales para llenar los selectores (Filtros)
    path(
        "estadisticas/filtros/", 
        EstadisticasFiltrosView.as_view(), 
        name="estadisticas-filtros"
    ),
    # Realiza el análisis de un proveedor o producto específico
    path(
        "estadisticas/analisis-proveedor/", 
        EstadisticasAnalisisProveedorView.as_view(), 
        name="estadisticas-analisis-proveedor"
    ),
    # Genera el ranking Top Mejores/Peores
    path(
        "estadisticas/top-proveedores/", 
        EstadisticasTopProveedoresView.as_view(), 
        name="estadisticas-top-proveedores"
    ),
]