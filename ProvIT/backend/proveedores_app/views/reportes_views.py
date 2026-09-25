from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from .permisos_helpers_views import respuestaExitosa, respuestaError
from ..services.reportes_services import ServicioReportes 

# =============================================================================
# MÓDULO REPORTES: CONTROLADORES
# =============================================================================

class ReporteListarView(APIView):
    """
    GET /api/reportes/
    Lista los reportes del sistema.
    El servicio filtra automáticamente según el rol (Admin ve los suyos, Gerente ve todos).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        termino_busqueda = request.query_params.get('busqueda', None)
        
        try:
            # El servicio decide internamente qué Listador usar según request.user
            reportes = ServicioReportes.listar_reportes(request.user, termino_busqueda)
            return respuestaExitosa(data=reportes, mensaje="Listado de reportes obtenido.")
            
        except PermissionDenied as e:
            return respuestaError(str(e), status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return respuestaError(f"Error al listar reportes: {str(e)}", status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReporteGuardarView(APIView):
    """
    POST /api/reportes/guardar/
    Guarda una captura inmutable (Snapshot) de un análisis estadístico.
    Exclusivo para el perfil Administrador (Rol 2).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.fk_rol.id_rol != 2:
            return respuestaError("Solo un Administrador puede guardar nuevos reportes.", status.HTTP_403_FORBIDDEN)

        # Extraemos los datos necesarios para recrear el análisis
        proveedor_id = request.data.get('proveedor_id')
        fecha_inicio = request.data.get('fecha_inicio')
        fecha_fin = request.data.get('fecha_fin')
        producto_id = request.data.get('producto_id', None) # Opcional

        if not all([proveedor_id, fecha_inicio, fecha_fin]):
            return respuestaError("Proveedor, fecha_inicio y fecha_fin son obligatorios.", status.HTTP_400_BAD_REQUEST)

        try:
            resultado = ServicioReportes.guardar_reporte_proveedor(
                usuario_id=request.user.id_usuario,
                proveedor_id=proveedor_id,
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin,
                producto_id=producto_id
            )
            return respuestaExitosa(
                data={'id_reporte': resultado['id_reporte']}, 
                mensaje=resultado['mensaje'], 
                status_code=status.HTTP_201_CREATED
            )
        except Exception as e:
            return respuestaError(f"Error al guardar el reporte: {str(e)}", status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReporteDetalleView(APIView):
    """
    GET /api/reportes/{pk}/
    Devuelve los metadatos y el snapshot JSON completo de un reporte.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            detalle = ServicioReportes.ver_detalle_reporte(request.user, pk)
            return respuestaExitosa(data=detalle, mensaje="Detalle de reporte obtenido.")
            
        except PermissionDenied as e:
            return respuestaError(str(e), status.HTTP_403_FORBIDDEN)
        except ObjectDoesNotExist as e:
            return respuestaError(str(e), status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return respuestaError(f"Error interno: {str(e)}", status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReporteExportarPDFView(APIView):
    """
    GET /api/reportes/{pk}/exportar-pdf/
    Devuelve los datos puros para que el frontend renderice y exporte el PDF.
    Exclusivo para el perfil Gerente (Rol 3).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # El servicio ya tiene una validación estricta para asegurar que es un Gerente
            datos_exportacion = ServicioReportes.exportar_reporte_pdf(request.user, pk)
            return respuestaExitosa(data=datos_exportacion, mensaje="Datos listos para exportación a PDF.")
            
        except PermissionDenied as e:
            return respuestaError(str(e), status.HTTP_403_FORBIDDEN)
        except ObjectDoesNotExist as e:
            return respuestaError(str(e), status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return respuestaError(f"Error al preparar exportación: {str(e)}", status.HTTP_500_INTERNAL_SERVER_ERROR)