import { X, UserPlus, Shield, Mail, Badge, User } from 'lucide-react';
// Asegúrate de que la ruta del hook sea la correcta según tu estructura
import { useModalRegistro } from '../../../../modelos-vista/hooks/useRegistro';
import { type ModalFormulario } from '../../../../modelos/types/ui.types';

export const ModalRegistro = ({ isOpen, onClose, onSuccess }: ModalFormulario) => {
  const { formData, isLoading, errorServidor, erroresLocales, handleChange, handleSubmit } = useModalRegistro(onSuccess);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      
      {/* Contenedor Principal del Modal */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registrar Nuevo Usuario</h2>
              <p className="text-xs text-slate-500">Crea una cuenta corporativa y asigna sus privilegios.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Error del Backend (Ej: El correo ya existe) */}
          {errorServidor && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {errorServidor}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/*Campo: Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nombre</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${erroresLocales.nombre ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                <input 
                  type="text" 
                  name="nombre"
                  required
                  placeholder="Ej. Juan"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    erroresLocales.nombre 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {erroresLocales.nombre && <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{erroresLocales.nombre}</p>}
            </div>

            {/*Campo: Apellido */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Apellido</label>
              <input 
                type="text" 
                name="apellido"
                required
                placeholder="Ej. Pérez"
                value={formData.apellido}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresLocales.apellido 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {erroresLocales.apellido && <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{erroresLocales.apellido}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/*Campo: DNI */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">DNI (Contraseña)</label>
              <div className="relative">
                <Badge className={`absolute left-3 top-1/2 -translate-y-1/2 ${erroresLocales.dni ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                <input 
                  type="number" 
                  name="dni"
                  required
                  placeholder="Ej. 35123456"
                  value={formData.dni}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    erroresLocales.dni 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {erroresLocales.dni && <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{erroresLocales.dni}</p>}
            </div>

            {/* Campo: Rol */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Rol en el Sistema</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  name="rol_id"
                  value={formData.rol_id}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="1">Operador (Rol 1)</option>
                  <option value="2">Administrador (Rol 2)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Campo: Correo Electrónico */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${erroresLocales.email ? 'text-red-400' : 'text-slate-400'}`} size={16} />
              <input 
                type="email" 
                name="email"
                required
                placeholder="juan.perez@provit.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  erroresLocales.email 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
            </div>
            {erroresLocales.email && <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{erroresLocales.email}</p>}
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                'Registrar Usuario'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};