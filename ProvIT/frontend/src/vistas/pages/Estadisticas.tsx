import { useState, useEffect } from 'react';
import { api } from '../../modelos/services/api'; // Para cargar los KPIs de proveedores activos/inactivos
import { useEstadisticas } from '../../modelos-vista/hooks/useEstadisticas';
import { GrillaKpi } from '../../vistas/components/organismos/Grilla';
import { PanelMetricas } from '../../vistas/components/organismos/PanelMetricas';
import { AlertaRecomendacion } from '../../vistas/components/UI/Recomendacion';
import { GraficoDona } from '../../vistas/components/UI/Graficos/dona'; 
import { GraficoLineas } from '../../vistas/components/UI/Graficos/lineas';
import { ModalFiltrosAnalisis } from '../../vistas/components/organismos/ModalFiltrosAnalisis';
import type { FiltrosAnalisisProveedor } from '../../modelos/types/analisis.types';

export const Estadisticas = () => {
  const [modalAbierto, setModalAbierto] = useState(false);

  // 1. CONECTA EL VIEWMODEL (Para los filtros y gráficos)
  const { 
    filtrosDisponibles, 
    analisis, 
    loading: cargandoAnalisis, 
    error,
    cargarFiltros,
    analizarProveedor 
  } = useEstadisticas();

  // 2. ESTADO Y LÓGICA DE LOS KPIs DINÁMICOS
  const [metricasKpi, setMetricasKpi] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });

  useEffect(() => {
    //Busca los datos para llenar el Modal
    cargarFiltros();

    //Busca los proveedores para calcular los KPIs de arriba
    const cargarKpis = async () => {
      try {
        const response = await api.get('/proveedores/?todos=true');  
        const proveedores = response.data.data || response.data;

        const total = proveedores.length;
        const activos = proveedores.filter((p: any) => p.estado === true).length;
        const inactivos = total - activos;

        setMetricasKpi({ total, activos, inactivos });
      } catch (error) {
        console.error("Error al cargar los KPIs:", error);
      }
    };

    cargarKpis();
  }, [cargarFiltros]); 

  // 3. MANEJADOR DEL MODAL
  const handleAplicarFiltros = (nuevosFiltros: FiltrosAnalisisProveedor) => {
    // pasa la orden de buscar al backend
    analizarProveedor(nuevosFiltros); 
    // Cierra el modal
    setModalAbierto(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800 relative">
      
      <h1 className="text-2xl font-bold mb-6">Tableros</h1>
      
      {/* --- KPIs FIJOS ARRIBA --- */}
      <GrillaKpi 
        total={metricasKpi.total} 
        activos={metricasKpi.activos} 
        inactivos={metricasKpi.inactivos} 
      />
      
      {/* --- BOTÓN PARA ABRIR MODAL --- */}
      <div className="mb-8 border-t border-gray-200">
        <button 
          onClick={() => setModalAbierto(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2"
        >
         Análisis de compras
        </button>
      </div>

      {/* --- MANEJO DE ESTADOS (Cargando y Error) --- */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {cargandoAnalisis && (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* --- RESULTADOS DEL ANÁLISIS --- */}
      {/* Solo se muestran cuando el backend ya devolvió el objeto "analisis" */}
      {!cargandoAnalisis && analisis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Columna Izquierda: grafico y Métricas Clave */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <div className="mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">
                Análisis de: <span className="text-blue-600">{analisis.proveedor}</span>
              </h2>
            </div>

            <GraficoDona datos={analisis.datosTorta} />
            
            {/* Extraemos los valores para el panel de métricas */}
            <PanelMetricas
              precio={analisis.datosTorta.find((d: any) => d.name === 'Precio')?.value || 0}
              calidad={analisis.datosTorta.find((d: any) => d.name === 'Calidad')?.value || 0}
              velocidad={analisis.datosTorta.find((d: any) => d.name === 'Velocidad')?.value || 0}
            />
          </div>

          {/* Columna Derecha: Evolución y Recomendación */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
              <h3 className="text-lg font-bold text-gray-700 mb-4">Evolución Histórica</h3>
              <GraficoLineas datos={analisis.datosLineas} />
            </div>
            
            <AlertaRecomendacion texto={analisis.recomendacion} />
          </div>

        </div>
      )}

      {/* --- MODAL FLOTANTE --- */}
      {/* Solo si tenemos los filtros listos desde el backend */}
      {modalAbierto && filtrosDisponibles && (
        <ModalFiltrosAnalisis 
          datosFiltrosUI={filtrosDisponibles} 
          isLoading={cargandoAnalisis}
          onClose={() => setModalAbierto(false)} 
          onAnalizar={handleAplicarFiltros}
        />
      )}

    </div>
  );
};