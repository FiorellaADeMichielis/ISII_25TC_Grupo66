// ModalVistaUsuarioVista.tsx
//Como todas las vistas, se sigue el patrón de diseño de componentes funcionales y hooks de React.
//Este componente representa un modal que muestra los detalles de un usuario específico.
import { X, User, Mail, CreditCard, Shield, Clock } from 'lucide-react';
import type { Usuario } from '../../../../modelos/types/usuarios.types'; // Ajusta tu ruta

interface ModalDetallesUsuarioVistaProps {
  onClose: () => void;
  usuario: Usuario; 
}

export const ModalDetallesUsuarioVista = ({ onClose, usuario }: ModalDetallesUsuarioVistaProps) => {
  
  // Función auxiliar para sacar iniciales del nombre completo (Ej: "Juan Perez" -> "JP")
  const obtenerIniciales = (nombreCompleto: string) => {
    if (!nombreCompleto) return '??';
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nombreCompleto.substring(0, 2).toUpperCase();
  };

  // Evaluamos el estado basado en tu tipo literal 'activo' | 'inactivo'
  const esActivo = usuario.estado === 'activo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Detalles del Usuario
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="p-6 space-y-6">
          
          {/* Avatar, Nombre y Cargo */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-slate-100">
            {/* Si tiene avatar URL lo mostramos, si no, mostramos iniciales */}
            {usuario.avatar ? (
              <img 
                src={usuario.avatar} 
                alt={usuario.nombre} 
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase ring-4 ring-white shadow-sm">
                {obtenerIniciales(usuario.nombre)}
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">
                {usuario.nombre}
              </h3>
              {usuario.rol && (
                <p className="text-sm text-slate-500 font-medium">{usuario.rol}</p>
              )}
              
              <span className={`inline-flex mt-2 items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                esActivo 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${esActivo ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                {esActivo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
              </span>
            </div>
          </div>

          {/* Lista de Datos Personales */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Documento (DNI)</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{usuario.dni}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Correo Electrónico</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{usuario.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Rol en el Sistema</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{usuario.rol}</p>
              </div>
            </div>

            {/* Agregamos el último login que venía en tus tipos */}
            {usuario.ultimoLogin && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Último Acceso</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{usuario.ultimoLogin}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* PIE DEL MODAL */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};