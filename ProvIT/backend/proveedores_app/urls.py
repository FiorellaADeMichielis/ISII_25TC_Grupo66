"""
Descripción: Definición de rutas de la API de ProvIT.
"""
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views.permisos_helpers_views import (
    UsuarioRegistroView,
    ProvITLoginView,
    ProductoListaView,
    ProvinciaListaView,
    LocalidadListaView,
)
from .views.estadisticas_views import (
    EstadisticasFiltrosView,
    EstadisticasAnalisisProveedorView,
)
from .views.proveedor_views import (
    ProveedorListaView,
    ProveedorDetalleView,
    ProveedorReactivarView,
)
from .views.pedido_views import (
    PedidoCambiarEstadoView,
    PedidoListaView,
    PedidoRegistrarEntregaView,
)
from .views.gerente_views import (
    UsuarioListarView,
    UsuarioAgregarView,
    UsuarioEliminarView,
    UsuarioEditarView,
    UsuarioReactivarView,
    UsuarioMetricasView,
)

urlpatterns = [
    # ==========================================
    # SEGURIDAD Y AUTENTICACIÓN
    # ==========================================
    path("login/", ProvITLoginView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("registro/", UsuarioRegistroView.as_view(), name="usuario_registro"),

    # ==========================================
    # MÓDULO PROVEEDORES
    # ==========================================
    path("proveedores/", ProveedorListaView.as_view(), name="proveedor-lista"),
    path("proveedores/<int:pk>/", ProveedorDetalleView.as_view(), name="proveedor-detalle"),
    path("proveedores/<int:pk>/reactivar/", ProveedorReactivarView.as_view(), name="proveedor-reactivar"),
                
    # ==========================================
    # MÓDULO ESTADÍSTICAS
    # ==========================================
    path("estadisticas", EstadisticasFiltrosView.as_view(), name="estadisticas"),
    path("estadisticas/filtros/", EstadisticasFiltrosView.as_view(), name="estadisticas-filtros"),
    path("estadisticas/analisis-proveedor/", EstadisticasAnalisisProveedorView.as_view(), name="estadisticas-analisis-proveedor"),

    # ==========================================
    # MÓDULO PEDIDOS
    # ==========================================
    path("pedidos/", PedidoListaView.as_view(), name="pedidos-lista"),
    path("pedidos/<int:pk>/entrega/", PedidoRegistrarEntregaView.as_view(), name="pedido-registrar-entrega"),
    path("pedidos/<int:pk>/estado/", PedidoCambiarEstadoView.as_view(), name="pedido-cambiar-estado"),

    # ==========================================
    # MÓDULO PRODUCTOS
    # ==========================================
    path("productos/", ProductoListaView.as_view(), name="productos-lista"),

    # ==========================================
    # MÓDULO GERENTE - GESTIÓN USUARIOS
    # ==========================================
    path('usuarios/', UsuarioListarView.as_view(), name='listar_usuarios'),
    path('usuarios/registrar/', UsuarioAgregarView.as_view(), name='agregar_usuario'),
    path('usuarios/<int:pk>/', UsuarioEditarView.as_view(), name='editar_usuario'),
    path('usuarios/<int:pk>/eliminar/', UsuarioEliminarView.as_view(), name='eliminar_usuario'),
    path('usuarios/<int:pk>/reactivar/', UsuarioReactivarView.as_view(), name='reactivar_usuario'),
    path('usuarios/metricas/', UsuarioMetricasView.as_view(), name='metricas_usuarios'),
]
