import React from 'react';
import { X } from 'lucide-react';
import type { Proveedor, Direccion } from '../../../../modelos/types/proveedor.types';
import { SelectorUbicacion } from '../SelectorUbicacion';
import { type ErroresForm } from "../../../../modelos/types/proveedor.types";

interface ModalVistaProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Omit<Proveedor, 'id'>;
  errores: ErroresForm & { calle?: string }; // Actualizado para soportar calle
  isSubmitting: boolean;
  isEdicion: boolean;
  puedeEditarEstado: boolean;
  onChangeData: (datos: Partial<Omit<Proveedor, 'id'>>) => void;
  onChangeDireccion: (campo: keyof Direccion, valor: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalProveedorVista = ({
  isOpen, onClose, formData, errores, isSubmitting, isEdicion,
  puedeEditarEstado, onChangeData, onChangeDireccion, onSubmit,
}: ModalVistaProps) => {
  if (!isOpen) return null;

  const inputClass = (error?: string) => 
    `w-full px-4 py-2 border rounded-lg outline-none transition-colors 
    ${error ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="form-proveedor" onSubmit={onSubmit} className="space-y-4" noValidate> 
            {/* Agregamos noValidate para asegurar que el navegador no bloquee el submit */}
            
            {errores.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg font-medium">
                {errores.general}
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Datos de Contacto</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text" 
                  // Quitamos el 'required' de todos los inputs
                  className={inputClass(errores.nombre)}
                  value={formData.nombre}
                  onChange={(e) => onChangeData({ nombre: e.target.value })}
                />
                {errores.nombre && <p className="text-xs text-red-500 mt-1 font-medium">{errores.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CUIT</label>
                <input
                  type="text" inputMode="numeric" 
                  placeholder="Ej: 30123456789 (Sin guiones)"
                  maxLength={11}
                  className={inputClass(errores.cuit)}
                  value={formData.cuit}
                  onChange={(e) => onChangeData({ cuit: e.target.value.replace(/\D/g, '') })}
                />
                {errores.cuit && <p className="text-xs text-red-500 mt-1 font-medium">{errores.cuit}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email" 
                    className={inputClass(errores.email)}
                    value={formData.email}
                    onChange={(e) => onChangeData({ email: e.target.value })}
                  />
                  {errores.email && <p className="text-xs text-red-500 mt-1 font-medium">{errores.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text" inputMode="numeric" 
                    placeholder="Ej: 5491145678900"
                    maxLength={13}
                    className={inputClass(errores.telefono)}
                    value={formData.telefono}
                    onChange={(e) => onChangeData({ telefono: e.target.value.replace(/\D/g, '') })}
                  />
                  {errores.telefono && <p className="text-xs text-red-500 mt-1 font-medium">{errores.telefono}</p>}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Dirección Comercial</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calle</label>
                  <input
                    type="text" 
                    className={inputClass(errores.calle)} // Implementado el inputClass y renderizado de error para Calle
                    value={formData.direcciones[0]?.calle || ''}
                    onChange={(e) => onChangeDireccion('calle', e.target.value)}
                  />
                  {errores.calle && <p className="text-xs text-red-500 mt-1 font-medium">{errores.calle}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Altura</label>
                  <input
                    type="number" 
                    min="1"
                    className={inputClass(errores.altura)}
                    value={formData.direcciones[0]?.altura || ''}
                    onChange={(e) => onChangeDireccion('altura', Number(e.target.value))}
                  />
                  {errores.altura && <p className="text-xs text-red-500 mt-1 font-medium">{errores.altura}</p>}
                </div>
              </div>
              <SelectorUbicacion
                localidadSeleccionada={formData.direcciones[0]?.fk_localidad || ''}
                onChangeLocalidad={(idLoc) => onChangeDireccion('fk_localidad', idLoc)}
                provinciaInicial={formData.direcciones[0]?.id_provincia}
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 shrink-0 bg-white">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" form="form-proveedor" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};