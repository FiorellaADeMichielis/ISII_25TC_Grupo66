import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Proveedor } from '../../types/proveedor.types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedorEditando: Proveedor | null;
  onGuardar: (datos: Omit<Proveedor, 'id'>) => Promise<boolean>;
  rolUsuario: number;
}

const formInicial: Omit<Proveedor, 'id'> = {
  nombre: '', cuit: '', email: '', telefono: '', estado: 'Activo',
};

export const ModalFormularioProveedor = ({ isOpen, onClose, proveedorEditando, onGuardar, rolUsuario }: ModalProps) => {
  const [formData, setFormData] = useState<Omit<Proveedor, 'id'>>(formInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NUEVO: Estado para manejar los mensajes de error visuales de las validaciones
  const [errores, setErrores] = useState<{ cuit?: string; telefono?: string }>({});

  const esAdmin = rolUsuario === 2;

  useEffect(() => {
    if (proveedorEditando) {
      setFormData({
        nombre: proveedorEditando.nombre,
        cuit: proveedorEditando.cuit,
        email: proveedorEditando.email,
        telefono: proveedorEditando.telefono,
        estado: proveedorEditando.estado,
      });
    } else {
      setFormData(formInicial);
    }
    // Limpiamos los errores al abrir/cerrar el modal
    setErrores({});
  }, [proveedorEditando, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Ejecutamos las validaciones estrictas antes de enviar
    const nuevosErrores: { cuit?: string; telefono?: string } = {};

    if (formData.cuit.length !== 11) {
      nuevosErrores.cuit = 'El CUIT debe tener exactamente 11 dígitos numéricos.';
    }
    
    if (formData.telefono.length !== 13) {
      nuevosErrores.telefono = 'El teléfono debe tener exactamente 13 dígitos numéricos.';
    }

    // Si hay errores, cortamos la ejecución y los mostramos en la UI
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return; 
    }

    // 2. Si pasa las validaciones, procedemos a guardar
    setErrores({});
    setIsSubmitting(true);
    
    const exito = await onGuardar(formData);
    
    setIsSubmitting(false);
    if (exito) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {proveedorEditando ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {proveedorEditando ? 'Modifica los datos del proveedor.' : 'Registra un nuevo proveedor.'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input 
              type="text" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CUIT</label>
            <input 
              type="text" 
              inputMode="numeric" // Mejora el teclado en celulares
              required 
              placeholder="Ej: 30123456789 (Sin guiones)"
              maxLength={11} // Limita físicamente la cantidad de caracteres
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                ${errores.cuit ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}
              `}
              value={formData.cuit}
              onChange={(e) => {
                // Reemplaza todo lo que NO sea un número (\D) por un string vacío
                const soloNumeros = e.target.value.replace(/\D/g, '');
                setFormData({...formData, cuit: soloNumeros});
                // Limpia el error al tipear
                if (errores.cuit) setErrores({...errores, cuit: undefined});
              }}
            />
            {errores.cuit && <p className="text-xs text-red-500 mt-1 font-medium">{errores.cuit}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input 
                type="text" 
                inputMode="numeric"
                required 
                placeholder="Ej: 5491145678900"
                maxLength={13}
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors
                  ${errores.telefono ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}
                `}
                value={formData.telefono}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, telefono: soloNumeros});
                  if (errores.telefono) setErrores({...errores, telefono: undefined});
                }}
              />
              {errores.telefono && <p className="text-xs text-red-500 mt-1 font-medium">{errores.telefono}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado
              {!esAdmin && <span className="text-xs text-red-500 ml-2 font-normal">(Solo Administradores)</span>}
            </label>
            <select 
              disabled={!esAdmin}
              className={`w-full px-4 py-2 rounded-lg outline-none transition-colors border
                ${esAdmin 
                  ? 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value as 'Activo' | 'Inactivo'})}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button 
              type="button" onClick={onClose} disabled={isSubmitting}
              className="px-5 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" disabled={isSubmitting}
              className={`px-5 py-2 text-white font-medium rounded-lg transition-colors
                ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};