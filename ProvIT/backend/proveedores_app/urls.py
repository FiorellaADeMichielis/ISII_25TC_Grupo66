"""
Descripción: Definición de rutas de la API.
"""

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    PedidoCambiarEstadoView,
    PedidoListaView,
    PedidoRegistrarEntregaView,
    ProveedorListaView,
    ProveedorDetalleView,
    ProveedorReactivarView,
    ProvITLoginView,
    EstadisticasFiltrosView,
    EstadisticasAnalisisProveedorView,
    ProductoListaView,
    UsuarioEditarView,
    UsuarioListarView,
    UsuarioAgregarView,
    UsuarioEliminarView,
    UsuarioEditarRolView,
    UsuarioMetricasView
)

urlpatterns = [
                # ==========================================
                # SEGURIDAD Y AUTENTICACIÓN
                # ==========================================
                path("login/", ProvITLoginView.as_view(), name="token_obtain_pair"),
                path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

                # ==========================================
                # MÓDULO PROVEEDORES: 
                # ==========================================

                #Acá tengo verProveedores + agregarProveedor
                path("proveedores/",ProveedorListaView.as_view(),name="proveedor-lista",),
                # verProveedor + editarProveedor + eliminarProveedor
                path("proveedores/<int:pk>/", ProveedorDetalleView.as_view(),name="proveedor-detalle",),
                # reactivarProveedor (Admin)
                path("proveedores/<int:pk>/reactivar/",ProveedorReactivarView.as_view(), name="proveedor-reactivar",),
                
                # ==========================================
                # MÓDULO ESTADÍSTICAS (Análisis de Compras)
                # ==========================================

                path("estadisticas",EstadisticasFiltrosView.as_view(), name="estadisticas",),
                # Obtiene los datos iniciales para llenar los selectores (Filtros)
                path("estadisticas/filtros/",EstadisticasFiltrosView.as_view(), name="estadisticas-filtros"),
                # Realiza el análisis de un proveedor o producto específico
                path("estadisticas/analisis-proveedor/",EstadisticasAnalisisProveedorView.as_view(),name="estadisticas-analisis-proveedor"),

                #MÓDULO PEDIDOS
                path("pedidos/", PedidoListaView.as_view(), name="pedidos-lista"),
                # Método de clase: registrarEntrega(fecha:Date):void
                path("pedidos/<int:pk>/entrega/",  PedidoRegistrarEntregaView.as_view(), name="pedido-registrar-entrega"),
                # Método de clase: cambiarEstado(nuevoEstado:String):void
                path("pedidos/<int:pk>/estado/", PedidoCambiarEstadoView.as_view(), name="pedido-cambiar-estado"),

                # MÓDULO PRODUCTOS
                path("productos/", ProductoListaView.as_view(), name="productos-lista"),

                # ==========================================
                # MÓDULO GERENTE - GESTION USUARIOS
                # ==========================================
                path('usuarios/', UsuarioListarView.as_view(), name='listar_usuarios'),
                path('usuarios/registrar/', UsuarioAgregarView.as_view(), name='agregar_usuario'),
                path('usuarios/<int:pk>/', UsuarioEditarView.as_view(), name='editar_usuario'),
                path('usuarios/<int:pk>/eliminar/', UsuarioEliminarView.as_view(), name='eliminar_usuario'),
                path('usuarios/<int:pk>/editar-rol/', UsuarioEditarRolView.as_view(), name='editar_rol_usuario'),
                path('usuarios/metricas/', UsuarioMetricasView.as_view(), name='metricas_usuarios')
            ]