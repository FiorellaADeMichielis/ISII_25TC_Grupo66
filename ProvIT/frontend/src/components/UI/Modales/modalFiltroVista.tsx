import type { FiltrosAnalisis } from '../../../types/analisis.types'; // Importamos el contrato

// Definimos estrictamente qué necesita la vista para dibujarse
interface ModalFiltrosVistaProps {
  filtros: FiltrosAnalisis;
  onProveedorChange: (id: string) => void;
  onFechaDesdeChange: (fecha: string) => void;
  onFechaHastaChange: (fecha: string) => void;
  onCancelar: () => void;
  onAplicar: () => void;
}

export const ModalFiltrosVista = ({
  filtros,
  onProveedorChange,
  onFechaDesdeChange,
  onFechaHastaChange,
  onCancelar,
  onAplicar
}: ModalFiltrosVistaProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Configurar Análisis</h2>
        
        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <select 
              className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={filtros.proveedorId}
              onChange={(e) => onProveedorChange(e.target.value)}
            >
              <option value="">Seleccione un proveedor...</option>
              <option value="1">Proveedor Alpha</option>
              <option value="2">Distribuidora Beta</option>
              <option value="3">Insumos Gamma</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filtros.fechaDesde}
                onChange={(e) => onFechaDesdeChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filtros.fechaHasta}
                onChange={(e) => onFechaHastaChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onCancelar}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onAplicar}
            disabled={!filtros.proveedorId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ver análisis
          </button>
        </div>
      </div>
    </div>
  );
};