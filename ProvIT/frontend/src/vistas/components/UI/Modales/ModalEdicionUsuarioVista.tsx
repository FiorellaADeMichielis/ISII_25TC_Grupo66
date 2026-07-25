import React from 'react';
import { X, User, Badge, Shield, Mail } from 'lucide-react';
import type { ErroresFormUsuario } from '../../../../modelos/types/usuarios.types';

interface ModalEditarVistaProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { nombre: string; apellido: string; dni: string; email: string; rol_id: string };
  errores: ErroresFormUsuario;
  isSubmitting: boolean;
  nombreUsuario?: string;
  onChangeData: (datos: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalEdicionUsuarioVista = ({
  isOpen, onClose, formData, errores, isSubmitting, nombreUsuario, onChangeData, onSubmit
}: ModalEditarVistaProps) => {
  if (!isOpen) return null;

  const inputClass = (error?: string) => 
    `w-full pl-9 pr-3 py-2 text-sm border rounded-lg outline-none transition-colors 
    ${error ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Editar Usuario</h2>
              <p className="text-xs text-slate-500">Actualizando información de {nombreUsuario}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="form-editar-usuario" onSubmit={onSubmit} className="space-y-4" noValidate>
            
            {errores.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg font-medium">
                {errores.general}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    className={inputClass(errores.nombre)}
                    value={formData.nombre}
                    onChange={(e) => onChangeData({ nombre: e.target.value })}
                  />
                </div>
                {errores.nombre && <p className="mt-1 text-xs font-medium text-red-500">{errores.nombre}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Apellido</label>
                <input 
                  type="text" 
                  className={inputClass(errores.apellido)}
                  value={formData.apellido}
                  onChange={(e) => onChangeData({ apellido: e.target.value })}
                />
                {errores.apellido && <p className="mt-1 text-xs font-medium text-red-500">{errores.apellido}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">DNI</label>
                <div className="relative">
                  <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    inputMode="numeric"
                    maxLength={8}
                    className={inputClass(errores.dni)}
                    value={formData.dni}
                    onChange={(e) => onChangeData({ dni: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                {errores.dni && <p className="mt-1 text-xs font-medium text-red-500">{errores.dni}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Rol en el Sistema</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    className={inputClass()}
                    value={formData.rol_id}
                    onChange={(e) => onChangeData({ rol_id: e.target.value })}
                  >
                    <option value="1">Operador (Rol 1)</option>
                    <option value="2">Administrador (Rol 2)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email" 
                  className={inputClass(errores.email)}
                  value={formData.email}
                  onChange={(e) => onChangeData({ email: e.target.value })}
                />
              </div>
              {errores.email && <p className="mt-1 text-xs font-medium text-red-500">{errores.email}</p>}
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 shrink-0 bg-white">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="form-editar-usuario" 
            disabled={isSubmitting} 
            className="px-5 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  );
};