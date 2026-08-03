// src/vistas/paginas/Reportes.tsx

import { useState } from 'react';
import { Search, Filter, X, Star, BarChart3 } from 'lucide-react';
import { useReportes } from '../../modelos-vista/hooks/useReportes';
import { TablaReportes } from '../components/UI/Tablas/TablaReportes';

export const Reportes = () => {
  // ESTADO DE UI: Solo le pertenece a esta pantalla (abrir/cerrar panel)
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // LÓGICA DE NEGOCIO: 100% delegada al Custom Hook (Caso de Uso)
  const { 
    reportes, 
    isLoading,
    filtros, 
    setFiltros, 
    handleToggleDestacado, 
    handleExportar,
    autoresDisponibles
  } = useReportes();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Inteligencia de Datos
          </h1>
          <p className="text-slate-500 mt-1">
            Visualiza y exporta los análisis estadísticos y predictivos compartidos por los Administradores.
          </p>
        </div>
      </header>

      {/* CONTROLES (SMART): Capturan la intención del usuario y actualizan el estado del Hook */}
      <div className="bg-white rounded-t-2xl border-t border-l border-r border-slate-200 shadow-sm z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
          
          {/* Input de Búsqueda */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar reporte por título o tema..." 
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Botones de Acción Global */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setFiltros({ ...filtros, soloDestacados: !filtros.soloDestacados })}
              className={`px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 border rounded-lg transition-colors shadow-sm ${
                filtros.soloDestacados ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-4 h-4 ${filtros.soloDestacados ? 'fill-yellow-500 text-yellow-500' : ''}`} /> 
              Destacados
            </button>

            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 border rounded-lg transition-colors shadow-sm ${
                mostrarFiltros ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" /> Filtros
              {(filtros.autorId || filtros.rangoFecha !== 'todos') && (
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Panel Desplegable de Filtros */}
        {mostrarFiltros && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row gap-6 animate-in slide-in-from-top-2 duration-200">
            
            <div className="flex flex-col gap-1.5 w-full sm:w-1/4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generado por</label>
              <select 
                value={filtros.autorId}
                onChange={(e) => setFiltros({ ...filtros, autorId: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Todos los administradores</option>
                {autoresDisponibles.map(autor => (
                  <option key={autor.id} value={autor.id}>{autor.nombre}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full sm:w-1/4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Período de Análisis</label>
              <select 
                value={filtros.rangoFecha}
                onChange={(e) => setFiltros({ ...filtros, rangoFecha: e.target.value as any })}
                className="w-full p-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="todos">Cualquier fecha</option>
                <option value="semana">Últimos 7 días</option>
                <option value="mes">Últimos 30 días</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              {(filtros.autorId || filtros.rangoFecha !== 'todos') && (
                <button 
                  onClick={() => setFiltros({ ...filtros, autorId: '', rangoFecha: 'todos' })}
                  className="text-sm flex items-center gap-1 text-slate-500 font-medium hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" /> Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* COMPONENTE DUMB: Recibe los datos y callbacks, no toma decisiones */}
      <div className="-mt-8">
        <TablaReportes 
          reportes={reportes}
          isLoading={isLoading}
          onToggleDestacado={handleToggleDestacado}
          onExportar={handleExportar}
        />
      </div>

    </div>
  );
};