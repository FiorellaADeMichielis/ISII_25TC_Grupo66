from abc import ABC, abstractmethod
from django.db.models import Q
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from .models import Reporte, TipoReporte, Proveedor, Usuario
from .estadisticas_services import ServicioAnalisisCompras

# =============================================================================
# PATRÓN TEMPLATE METHOD - Clases para Listar Reportes
# Con este patrón creamos una clase abstracta general con los métodos que se 
# comparten de la sección Reportes p/distintos perfiles, pero redefiniendo los
# mismos en clases concretas según Admin|Gernete, con restricciones o métodos específicos en cada una. 
# =============================================================================

class ListadorReportesBase(ABC):
    """
    Clase Abstracta: Define la base para listar y buscar reportes.
    """
    def obtener_listado(self, usuario, termino_busqueda=None):
        """
        Template Method (Patrón de diseño Plantilla): El algoritmo principal que no cambia.
        1. Obtiene la base de datos permitida.
        2. Aplica los filtros de búsqueda si existen.
        3. Da formato a los resultados.
        """
        queryset = self._obtener_queryset_base(usuario)
        
        if termino_busqueda:
            queryset = self._aplicar_busqueda(queryset, termino_busqueda)
            
        return self._formatear_resultados(queryset)

    @abstractmethod
    def _obtener_queryset_base(self, usuario):
        """Debe ser implementado por las subclases (Define permisos de visibilidad)."""
        pass

    @abstractmethod
    def _aplicar_busqueda(self, queryset, termino_busqueda):
        """Debe ser implementado por las subclases (Define criterios de búsqueda)."""
        pass

    def _formatear_resultados(self, queryset):
        """Paso común: Formatea la salida para la tabla del frontend."""
        # Se optimiza la consulta con select_related para traer las foráneas en un solo viaje
        reportes = queryset.select_related('fk_tipo_reporte', 'fk_proveedor', 'fk_usuario').order_by('-fecha_generacion')
        
        return [
            {
                'id_reporte': r.id_reporte,
                'fecha_generacion': r.fecha_generacion.strftime('%Y-%m-%d %H:%M'),
                'tipo_reporte': r.fk_tipo_reporte.nombre_tipo,
                'proveedor': r.fk_proveedor.nombre_proveedor if r.fk_proveedor else 'General',
                'autor': f"{r.fk_usuario.nombre_usuario} {r.fk_usuario.apellido_usuario}",
                'periodo': f"{r.fecha_inicio_filtro} a {r.fecha_fin_filtro}",
                'puntaje_precio': r.escala_precio
            }
            for r in reportes
        ]


class ListadorReportesAdministrador(ListadorReportesBase):
    """
    Subclase concreta para el perfil Administrador (Rol 2).
    """
    def _obtener_queryset_base(self, usuario):
        # Solo ve SUS propios reportes
        return Reporte.objects.filter(fk_usuario_id=usuario.id_usuario)

    def _aplicar_busqueda(self, queryset, termino_busqueda):
        # Solo puede buscar por nombre de proveedor
        return queryset.filter(fk_proveedor__nombre_proveedor__icontains=termino_busqueda)


class ListadorReportesGerente(ListadorReportesBase):
    """
    Subclase concreta para el perfil Gerente (Rol 3).
    """
    def _obtener_queryset_base(self, usuario):
        # Ve TODOS los reportes del sistema
        return Reporte.objects.all()

    def _aplicar_busqueda(self, queryset, termino_busqueda):
        # Puede buscar por proveedor o por nombre/apellido del administrador que lo creó
        return queryset.filter(
            Q(fk_proveedor__nombre_proveedor__icontains=termino_busqueda) |
            Q(fk_usuario__nombre_usuario__icontains=termino_busqueda) |
            Q(fk_usuario__apellido_usuario__icontains=termino_busqueda)
        )


# =============================================================================
# SERVICIO PRINCIPAL DE REPORTES: Funcionalidades según perfil Admin | Gerente
#ADMIN: 
# Ver lista de Reportes propios / Ver detalles / Filtros y Búsquedas / Guardar reporte 
#GERENTE: 
# Ver lista de todos los Reportes / Ver detalles / Filtros y Búsquedas / Exportar 
# =============================================================================

class ServicioReportes:
    """
    Fachada que expone las funcionalidades del módulo de Reportes al controlador (views.py).
    """
    
    @staticmethod
    def listar_reportes(usuario, termino_busqueda=None):
        """
        Fábrica simple que instancia el Listador correcto según el rol del usuario.
        Rol 2 = Administrador | Rol 3 = Gerente
        """
        if usuario.fk_rol.id_rol == 2:
            listador = ListadorReportesAdministrador()
        elif usuario.fk_rol.id_rol == 3:
            listador = ListadorReportesGerente()
        else:
            raise PermissionDenied("Rol no autorizado para visualizar reportes.")
            
        return listador.obtener_listado(usuario, termino_busqueda)

    @staticmethod
    def guardar_reporte_proveedor(usuario_id, proveedor_id, fecha_inicio, fecha_fin, producto_id=None):
        """
        Administrador: Captura el análisis en vivo y lo congela en la tabla Reporte.
        """
        # 1. Obtener/crear el Tipo de Reporte correspondiente
        tipo_reporte, _ = TipoReporte.objects.get_or_create(
            id_tipo_reporte=1, 
            defaults={'nombre_tipo': 'Análisis por Proveedor'}
        )
        
        # 2. Ejecutar el análisis utilizando el servicio existente de estadísticas
        # Esto nos asegura que las reglas de negocio de cálculos no se dupliquen
        datos_analisis = ServicioAnalisisCompras.verAnalisisProveedor(
            proveedor_id, fecha_inicio, fecha_fin, producto_id
        )
        
        # 3. Guardar el Snapshot Inmutable en la base de datos
        nuevo_reporte = Reporte.objects.create(
            fecha_inicio_filtro=fecha_inicio,
            fecha_fin_filtro=fecha_fin,
            fk_usuario_id=usuario_id,
            fk_tipo_reporte=tipo_reporte,
            fk_proveedor_id=proveedor_id,
            fk_producto_id=producto_id,
            escala_precio=datos_analisis['graficaTorta'].get('precio'),
            escala_calidad=datos_analisis['graficaTorta'].get('calidad'),
            escala_velocidad=datos_analisis['graficaTorta'].get('velocidad'),
            recomendacion_texto=datos_analisis.get('recomendacion'),
            datos_completos_snapshot=datos_analisis # Guardamos el JSON completo
        )
        
        return {'success': True, 'id_reporte': nuevo_reporte.id_reporte, 'mensaje': 'Reporte guardado exitosamente.'}

    @staticmethod
    def ver_detalle_reporte(usuario, reporte_id):
        """
        Administrador y Gerente: Devuelve el JSON completo guardado previamente.
        Incluye validación de seguridad para que el perfil Admin no vea reportes de otros Admins.
        """
        try:
            reporte = Reporte.objects.select_related('fk_proveedor', 'fk_usuario').get(pk=reporte_id)
            
            # Validación: Si es Admin (Rol 2), solo puede ver si es el autor
            if usuario.fk_rol.id_rol == 2 and reporte.fk_usuario_id != usuario.id_usuario:
                raise PermissionDenied("No tienes permisos para visualizar este reporte.")
                
            return {
                'id_reporte': reporte.id_reporte,
                'fecha_generacion': reporte.fecha_generacion.strftime('%Y-%m-%d %H:%M'),
                'autor': f"{reporte.fk_usuario.nombre_usuario} {reporte.fk_usuario.apellido_usuario}",
                'proveedor': reporte.fk_proveedor.nombre_proveedor if reporte.fk_proveedor else None,
                'recomendacion_texto': reporte.recomendacion_texto,
                'snapshot': reporte.datos_completos_snapshot # El payload para recrear los gráficos
            }
        except Reporte.DoesNotExist:
            raise ObjectDoesNotExist("El reporte solicitado no existe.")

    @staticmethod
    def exportar_reporte_pdf(usuario, reporte_id):
        """
        Gerente: Funcionalidad exclusiva para obtener los datos puros para exportación.
        Como acordamos delegar la creación visual al frontend con html2pdf.js/TypeScript,
        este método valida el rol y entrega el Snapshot intacto para su renderizado.
        """
        if usuario.fk_rol.id_rol != 3:
            raise PermissionDenied("Acción exclusiva para el perfil Gerente.")
            
        # Reutilizamos la lógica de ver detalles ya que contiene exactamente la info necesaria
        return ServicioReportes.ver_detalle_reporte(usuario, reporte_id)