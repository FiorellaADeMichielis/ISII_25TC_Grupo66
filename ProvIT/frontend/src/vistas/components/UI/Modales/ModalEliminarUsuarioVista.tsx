import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';
import type { Usuario } from '../../../../modelos/types/usuarios.types';

interface ModalEliminarUsuarioVistaProps {
  usuario: Usuario; 
  inputValue: string;
  setInputValue: (value: string) => void;
  isDeleting: boolean;
  error: string | null;
  isBotonHabilitado: boolean;
  onClose: () => void;
  onConfirm: () => void; 
}

export const ModalEliminarUsuarioVista = ({
  usuario,
  inputValue,
  setInputValue,
  isDeleting,
  error,
  isBotonHabilitado,
  onClose,
  onConfirm
}: ModalEliminarUsuarioVistaProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-red-100">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center p-6 border-b border-red-100 bg-red-50/50">
          <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Eliminar Usuario
          </h2>
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="p-6 space-y-6">
          <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg text-sm">
            <p><strong>Advertencia:</strong> Estás a punto de eliminar el usuario <strong>{usuario.nombre}</strong>. Esta acción quitará su acceso al sistema inmediatamente.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Para confirmar, escribe el correo electrónico del usuario: <br/>
              <span className="font-bold text-slate-900 select-all bg-slate-100 px-1 py-0.5 rounded">{usuario.email}</span>
            </label>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={usuario.email}
              disabled={isDeleting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
              autoComplete="off"
              autoCorrect="off"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        {/* PIE DEL MODAL */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={!isBotonHabilitado || isDeleting}
            className={`px-5 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors ${
              isBotonHabilitado 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200' 
                : 'bg-red-300 text-red-50 cursor-not-allowed'
            }`}
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar usuario'}
          </button>
        </div>

      </div>
    </div>
  );
};