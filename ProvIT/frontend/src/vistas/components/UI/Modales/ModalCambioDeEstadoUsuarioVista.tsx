import { AlertTriangle, X, Trash2, Loader2, RefreshCcw, CheckCircle } from 'lucide-react';
import type { Usuario } from '../../../../modelos/types/usuarios.types';

interface ModalCambioEstadoVistaProps {
  usuario: Usuario;
  accion: 'inactivar' | 'reactivar';
  inputValue: string;
  setInputValue: (value: string) => void;
  isProcessing: boolean;
  error: string | null;
  isBotonHabilitado: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalCambioEstadoVista = ({
  usuario, accion, inputValue, setInputValue, isProcessing, error, isBotonHabilitado, onClose, onConfirm
}: ModalCambioEstadoVistaProps) => {
  
  const isInactivar = accion === 'inactivar';
  
  // Variables dinámicas según la acción
  const IconoPrincipal = isInactivar ? AlertTriangle : RefreshCcw;
  const IconoBoton = isInactivar ? Trash2 : CheckCircle;
  const colorTema = isInactivar ? 'red' : 'emerald';
  const titulo = isInactivar ? 'Inactivar Usuario' : 'Reactivar Usuario';
  const textoBoton = isInactivar ? 'Sí, inactivar usuario' : 'Sí, reactivar usuario';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border ${isInactivar ? 'border-red-100' : 'border-emerald-100'}`}>
        
        {/* ENCABEZADO */}
        <div className={`flex justify-between items-center p-6 border-b ${isInactivar ? 'border-red-100 bg-red-50/50' : 'border-emerald-100 bg-emerald-50/50'}`}>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isInactivar ? 'text-red-700' : 'text-emerald-700'}`}>
            <IconoPrincipal className={`w-6 h-6 ${isInactivar ? 'text-red-600' : 'text-emerald-600'}`} />
            {titulo}
          </h2>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CUERPO */}
        <div className="p-6 space-y-6">
          <div className={`border p-4 rounded-lg text-sm ${isInactivar ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
            <p><strong>Advertencia:</strong> Estás a punto de {accion} el acceso del usuario <strong>{usuario.nombre}</strong>. {isInactivar ? 'Esta acción restringirá su uso del sistema.' : 'El usuario recuperará inmediatamente el acceso al sistema.'}</p>
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
              disabled={isProcessing}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${isInactivar ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-emerald-500/20 focus:border-emerald-500'}`}
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        {/* PIE */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={onConfirm}
            disabled={!isBotonHabilitado || isProcessing}
            className={`px-5 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors ${
              !isBotonHabilitado 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isInactivar 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
            }`}
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <IconoBoton className="w-5 h-5" />}
            {isProcessing ? 'Procesando...' : textoBoton}
          </button>
        </div>

      </div>
    </div>
  );
};