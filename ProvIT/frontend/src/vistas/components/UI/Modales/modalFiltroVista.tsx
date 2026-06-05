import React from 'react';
import type { OpcionSelect } from '../../../../modelos/types/analisis.types';

export interface ModalFiltrosVistaProps {
  tipoBusqueda: 'proveedor' | 'producto';
  opcionesDropdown: OpcionSelect[];
  elementoSeleccionado: number | '';
  fechaInicio: string;
  fechaFin: string;
  isLoading: boolean;
  onCambiarTipo: (tipo: 'proveedor' | 'producto') => void;
  onChangeElemento: (id: number | '') => void;
  onChangeFechaInicio: (fecha: string) => void;
  onChangeFechaFin: (fecha: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ModalFiltrosVista = ({
  tipoBusqueda,
  opcionesDropdown,
  elementoSeleccionado,
  fechaInicio,
  fechaFin,
  isLoading,
  onCambiarTipo,
  onChangeElemento,
  onChangeFechaInicio,
  onChangeFechaFin,
  onSubmit,
  onClose
}: ModalFiltrosVistaProps) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl relative">
        
        {/* Botón de Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h3 className="font-bold text-gray-800 text-xl">Análisis de Estadísticas</h3>
          <p className="text-sm text-gray-500 mt-1">Definí los parámetros de tu búsqueda</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* RENGLÓN 1: Slide Button (Toggle) */}
          <div className="flex flex-col items-center">
            <div className="relative flex w-full bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-inner">
              {/* Fondo blanco que se desliza (El slider) */}
              <div 
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-md shadow transition-transform duration-300 ease-in-out ${
                  tipoBusqueda === 'producto' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
              ></div>
              
              {/* Opción Proveedor */}
              <button
                type="button"
                onClick={() => onCambiarTipo('proveedor')}
                className={`relative flex-1 py-2 text-sm font-bold z-10 transition-colors ${
                  tipoBusqueda === 'proveedor' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Por Proveedor
              </button>
              
              {/* Opción Producto */}
              <button
                type="button"
                onClick={() => onCambiarTipo('producto')}
                className={`relative flex-1 py-2 text-sm font-bold z-10 transition-colors ${
                  tipoBusqueda === 'producto' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Por Producto
              </button>
            </div>
          </div>

          {/* RENGLÓN 2: Input Desplegable de Datos desde la BD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar {tipoBusqueda === 'proveedor' ? 'Proveedor' : 'Producto'} *
            </label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors bg-gray-50 hover:bg-white"
              value={elementoSeleccionado}
              onChange={(e) => onChangeElemento(e.target.value === '' ? '' : Number(e.target.value))}
              required
            >
              <option value="" disabled>Seleccione una opción de la lista...</option>
              {opcionesDropdown.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          {/* RENGLÓN 3: Fechas (Opcionales) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Rango de fechas (Opcional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={fechaInicio}
                  onChange={(e) => onChangeFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={fechaFin}
                  onChange={(e) => onChangeFechaFin(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <span className="font-bold">ℹ️ Info:</span> Si no especificás fechas, se analizará todo el historial disponible.
            </p>
          </div>

          {/* RENGLÓN 4: Botones de Acción */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading || elementoSeleccionado === ''}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center items-center min-w-[140px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Analizar Datos'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};