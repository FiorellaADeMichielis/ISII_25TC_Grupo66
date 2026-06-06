import React from 'react';
import type { OpcionSelect } from '../../../../modelos/types/analisis.types';

export interface ModalFiltrosVistaProps {
  tipoBusqueda: 'proveedor' | 'producto';
  opcionesDropdown: OpcionSelect[];
  elementoSeleccionado: number | '';
  fechaInicio: string;
  fechaFin: string;
  isLoading: boolean;
  errors?: { elemento?: string; fechaInicio?: string; fechaFin?: string }; // <--- AGREGADO
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
  errors, // <--- RECIBIDO
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
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h3 className="font-bold text-gray-800 text-xl">Análisis de Estadísticas</h3>
          <p className="text-sm text-gray-500 mt-1">Definí los parámetros de tu búsqueda</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          
          <div className="flex flex-col items-center">
            <div className="relative flex w-full bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-inner">
              <div 
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-md shadow transition-transform duration-300 ease-in-out ${
                  tipoBusqueda === 'producto' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
              ></div>
              <button
                type="button"
                onClick={() => onCambiarTipo('proveedor')}
                className={`relative flex-1 py-2 text-sm font-bold z-10 transition-colors ${
                  tipoBusqueda === 'proveedor' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Por Proveedor
              </button>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar {tipoBusqueda === 'proveedor' ? 'Proveedor' : 'Producto'} *
            </label>
            <select 
              className={`w-full border p-2.5 rounded-lg outline-none transition-colors ${
                errors?.elemento ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              }`}
              value={elementoSeleccionado}
              onChange={(e) => onChangeElemento(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="" disabled>Seleccione una opción de la lista...</option>
              {opcionesDropdown.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
            {errors?.elemento && <p className="text-red-500 text-xs mt-1">{errors.elemento}</p>}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Rango de fechas (Opcional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
                <input 
                  type="date" 
                  className={`w-full border p-2 rounded-lg outline-none ${
                    errors?.fechaInicio ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                  value={fechaInicio}
                  onChange={(e) => onChangeFechaInicio(e.target.value)}
                />
                {errors?.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
                <input 
                  type="date" 
                  className={`w-full border p-2 rounded-lg outline-none ${
                    errors?.fechaFin ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                  value={fechaFin}
                  onChange={(e) => onChangeFechaFin(e.target.value)}
                />
                {errors?.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>}
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <span className="font-bold">ℹ️ Info:</span> Si no especificás fechas, se analizará todo el historial.
            </p>
          </div>

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
              disabled={isLoading}
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