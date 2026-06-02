
import React from 'react';
import { X } from 'lucide-react';
import type { Proveedor, Direccion } from '../../../types/proveedor.types';
import { SelectorUbicacion } from '../SelectorUbicacion';

// Definimos la estructura de errores
export interface ErroresForm {
  cuit?: string;
  telefono?: string;
  altura?: string;
  nombre?: string;
  email?: string;
  general?: string;
}

interface ModalVistaProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Omit<Proveedor, 'id'>;
  errores: ErroresForm;
  isSubmitting: boolean;
  isEdicion: boolean;
  puedeEditarEstado: boolean;
  onChangeData: (datos: Partial<Omit<Proveedor, 'id'>>) => void;
  onChangeDireccion: (campo: keyof Direccion, valor: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalFormularioProveedorVista = ({
  isOpen,
  onClose,
  formData,
  errores,
  isSubmitting,
  isEdicion,
  puedeEditarEstado,
  onChangeData,
  onChangeDireccion,
  onSubmit,
}: ModalVistaProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isEdicion ? 'Modificá los datos del proveedor.' : 'Registrá un nuevo proveedor.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="overflow-y-auto p-6">
          <form id="form-proveedor" onSubmit={onSubmit} className="space-y-4">
            
            {/* Error general */}
            {errores.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg font-medium">
                {errores.general}
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Datos de Contacto</h3>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text" required
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                    ${errores.nombre ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                  value={formData.nombre}
                  onChange={(e) => onChangeData({ nombre: e.target.value })}
                />
                {errores.nombre && <p className="text-xs text-red-500 mt-1 font-medium">{errores.nombre}</p>}
              </div>

              {/* CUIT */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CUIT</label>
                <input
                  type="text" inputMode="numeric" required
                  placeholder="Ej: 30123456789 (Sin guiones)"
                  maxLength={11}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                    ${errores.cuit ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                  value={formData.cuit}
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, '');
                    onChangeData({ cuit: soloNumeros });
                  }}
                />
                {errores.cuit && <p className="text-xs text-red-500 mt-1 font-medium">{errores.cuit}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email" required
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                      ${errores.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                    value={formData.email}
                    onChange={(e) => onChangeData({ email: e.target.value })}
                  />
                  {errores.email && <p className="text-xs text-red-500 mt-1 font-medium">{errores.email}</p>}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text" inputMode="numeric" required
                    placeholder="Ej: 5491145678900"
                    maxLength={13}
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                      ${errores.telefono ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                    value={formData.telefono}
                    onChange={(e) => {
                      const soloNumeros = e.target.value.replace(/\D/g, '');
                      onChangeData({ telefono: soloNumeros });
                    }}
                  />
                  {errores.telefono && <p className="text-xs text-red-500 mt-1 font-medium">{errores.telefono}</p>}
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Dirección Comercial</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calle</label>
                  <input
                    type="text" required
                    placeholder="Ej: Av. Independencia"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.direcciones[0]?.calle || ''}
                    onChange={(e) => onChangeDireccion('calle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Altura</label>
                  <input
                    type="number" required
                    placeholder="Ej: 1500" min="1"
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                      ${errores.altura ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                    value={formData.direcciones[0]?.altura || ''}
                    onChange={(e) => onChangeDireccion('altura', Number(e.target.value))}
                  />
                  {errores.altura && <p className="text-xs text-red-500 mt-1 font-medium">{errores.altura}</p>}
                </div>
              </div>
              <div className="mt-4">
                <SelectorUbicacion
                  localidadSeleccionada={formData.direcciones[0]?.fk_localidad || ''}
                  onChangeLocalidad={(idLoc) => onChangeDireccion('fk_localidad', idLoc)}
                  provinciaInicial={formData.direcciones[0]?.id_provincia}
                />
              </div>
            </div>

            {/* Estado (RBAC aplicado) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estado
                {!puedeEditarEstado && (
                  <span className="text-xs text-red-500 ml-2 font-normal">
                    (Solo Administradores o Gerencia)
                  </span>
                )}
              </label>
              <select
                disabled={!puedeEditarEstado}
                className={`w-full px-4 py-2 rounded-lg outline-none transition-colors border
                  ${puedeEditarEstado ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'}`}
                value={formData.estado}
                onChange={(e) => onChangeData({ estado: e.target.value as 'Activo' | 'Inactivo' })}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </form>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 shrink-0 bg-white">
          <button
            type="button" onClick={onClose} disabled={isSubmitting}
            className="px-5 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit" form="form-proveedor" disabled={isSubmitting}
            className={`px-5 py-2 text-white font-medium rounded-lg transition-colors
              ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};