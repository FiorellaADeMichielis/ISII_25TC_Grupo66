import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GrillaKpi } from '../components/organismos/Grilla';
import { PanelMetricasProveedor } from '../components/UI/PanelMetricas';
import { AlertaRecomendacion } from '../components/UI/Recomendacion';
import { GraficoDona } from '../components/UI/Graficos/dona'; 
import { GraficoLineas } from '../components/UI/Graficos/lineas';
import { ModalFiltrosAnalisis } from '../components/organismos/ModalFiltrosAnalisis'; // Modal para seleccionar filtros de análisis
import type { FiltrosAnalisis } from '../types/analisis.types';

export const Estadisticas = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosAnalisis | null>(null);

  // ==========================================
  // ESTADO Y LÓGICA DE LOS KPIs DINÁMICOS
  // ==========================================
  const [metricasKpi, setMetricasKpi] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });

  useEffect(() => {
    const cargarKpis = async () => {
      try {
        // Pedimos TODOS los proveedores a Django
        const response = await api.get('/proveedores/?todos=true');
        
        // Django devuelve: { success: true, data: [...] }
        const proveedores = response.data.data;

        // Calculamos las métricas en base al campo "estado" de tu modelo
        const total = proveedores.length;
        const activos = proveedores.filter((p: any) => p.estado === true).length;
        const inactivos = total - activos;

        // Actualizamos la pantalla con los datos reales
        setMetricasKpi({ total, activos, inactivos });

      } catch (error) {
        console.error("Error al cargar los KPIs:", error);
      }
    };

    cargarKpis();
  }, []); // El array vacío hace que esto se ejecute una sola vez al entrar
  // ==========================================

  const handleAplicarFiltros = (nuevosFiltros: FiltrosAnalisis) => {
    setFiltrosActivos(nuevosFiltros);
    setMostrarAnalisis(true);
    setModalAbierto(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800 relative">
      
      <h1 className="text-2xl font-bold mb-6">Tableros</h1>
      
      {/* Pasamos los datos vivos a la grilla */}
      <GrillaKpi 
        total={metricasKpi.total} 
        activos={metricasKpi.activos} 
        inactivos={metricasKpi.inactivos} 
      />
      
      <div className="mb-8 border-t border-gray-200">
        <button 
          onClick={() => setModalAbierto(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          Análisis de compras
        </button>
      </div>

      {mostrarAnalisis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Proveedor Seleccionado: {filtrosActivos?.proveedorId}
              </h2>
            </div>
            <GraficoDona />
            <PanelMetricasProveedor />
          </div>

          <div className="flex flex-col gap-6">
            <GraficoLineas />
            <AlertaRecomendacion />
          </div>
        </div>
      )}

      {modalAbierto && (
        <ModalFiltrosAnalisis 
          onCerrar={() => setModalAbierto(false)} 
          onAplicar={handleAplicarFiltros} 
        />
      )}

    </div>
  );
};