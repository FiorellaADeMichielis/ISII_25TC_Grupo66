import { useState } from 'react';
import { Star, FileText, FileSpreadsheet, Mail, Download } from 'lucide-react';
import type { Reporte, FormatoExportacion } from '../../../../modelos/types/reportes.types';

interface TablaReportesProps {
  reportes: Reporte[];
  isLoading: boolean;
  onToggleDestacado: (id: string, estadoActual: boolean) => void;
  onExportar: (id: string, formato: FormatoExportacion) => void;
}

export const TablaReportes = ({ 
  reportes, 
  isLoading, 
  onToggleDestacado, 
  onExportar 
}: TablaReportesProps) => {
  // Este estado es puramente visual (UI), por lo que está bien que viva en el Dumb Component
  const [menuActivo, setMenuActivo] = useState<string | null>(null);

  // Estado de carga (Spinner o Mensaje)
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-slate-500 font-medium animate-pulse">Cargando inteligencia de datos...</span>
      </div>
    );
  }

  // Estado vacío (Empty State)
  if (reportes.length === 0) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">No hay reportes disponibles</h3>
        <p className="text-slate-500 max-w-sm mt-1">
          No se encontraron reportes que coincidan con los filtros actuales. Probá cambiando los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 shadow-sm bg-white z-0 relative pb-16">
      <table className="w-full text-left text-sm text-slate-600">
        
        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4 w-16 text-center">Fav</th>
            <th className="px-6 py-4">Detalle del Reporte</th>
            <th className="px-6 py-4">Categoría</th>
            <th className="px-6 py-4">Generado Por</th>
            <th className="px-6 py-4">Fecha</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-100">
          {reportes.map((reporte) => (
            <tr key={reporte.id} className="hover:bg-slate-50/80 transition-colors group">
              
              {/* ACCIÓN: Destacar */}
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => onToggleDestacado(reporte.id, reporte.destacado)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  title={reporte.destacado ? "Quitar de destacados" : "Añadir a destacados"}
                >
                  <Star className={`w-5 h-5 transition-colors ${reporte.destacado ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`} />
                </button>
              </td>

              {/* DATOS: Título y Descripción */}
              <td className="px-6 py-4">
                <p className="font-semibold text-slate-900">{reporte.titulo}</p>
                <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs" title={reporte.descripcion}>
                  {reporte.descripcion}
                </p>
              </td>

              {/* DATOS: Tipo (Badge semántico) */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                  {reporte.tipo}
                </span>
              </td>

              {/* DATOS: Autor */}
              <td className="px-6 py-4 font-medium text-slate-700">
                {reporte.autor.nombre}
              </td>

              {/* DATOS: Fecha */}
              <td className="px-6 py-4 text-slate-500">
                {reporte.fechaCreacion}
              </td>

              {/* ACCIÓN: Exportar (Menú Dropdown) */}
              <td className="px-6 py-4 text-right relative">
                <button 
                  onClick={() => setMenuActivo(menuActivo === reporte.id ? null : reporte.id)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-label="Opciones de exportación"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Dropdown de Opciones */}
                {menuActivo === reporte.id && (
                  <div className="absolute right-8 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => { onExportar(reporte.id, 'pdf'); setMenuActivo(null); }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-red-500" /> Exportar a PDF
                    </button>
                    <button 
                      onClick={() => { onExportar(reporte.id, 'excel'); setMenuActivo(null); }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Exportar a Excel
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button 
                      onClick={() => { onExportar(reporte.id, 'email'); setMenuActivo(null); }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-blue-500" /> Enviar por Correo
                    </button>
                  </div>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};