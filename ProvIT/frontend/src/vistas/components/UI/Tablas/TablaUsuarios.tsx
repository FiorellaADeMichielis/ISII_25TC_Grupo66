import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Key, Eye } from 'lucide-react';
import type { Usuario, EstadoUsuario, TablaUsuarioProps } from '../../../../modelos/types/usuarios.types'; // Asumiendo que las interfaces están aquí o en models/

export function TablaUsuarios({ users, onEdit, onDelete, onResetPassword, onView }: TablaUsuarioProps) {
  // Estado local para interacciones de la UI
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Manejo de checkboxes
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  // Renderizado dinámico y tipado de Badges
  const renderStatusBadge = (status: EstadoUsuario) => {
    const badges: Record<EstadoUsuario, string> = {
      activo: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
      inactivo: 'bg-slate-100 text-slate-700 ring-slate-600/20',
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-left text-sm text-slate-600">
        
        {/* Cabecera de la tabla */}
        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4 w-12">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors cursor-pointer" 
                onChange={handleSelectAll}
                checked={selectedUsers.length === users.length && users.length > 0}
                aria-label="Seleccionar todos los usuarios"
              />
            </th>
            <th className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">Usuario</th>
            <th className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">Rol</th>
            <th className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">Estado</th>
            <th className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">Último Acceso</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>

        {/* Cuerpo de la tabla */}
        <tbody className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                No se encontraron usuarios con los filtros actuales.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr 
                key={user.id} 
                className={`transition-colors group ${selectedUsers.includes(user.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}
              >
                {/* Selección */}
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    aria-label={`Seleccionar a ${user.nombre}`}
                  />
                </td>

                {/* Avatar y Datos Personales */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={`Avatar de ${user.nombre}`} 
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover" 
                    />
                    <div>
                      <p className="font-medium text-slate-900">{user.nombre}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Cargo y Rol (Agrupados) */}
                <td className="px-6 py-4">
                  <p className="text-slate-500 text-xs mt-0.5">{user.rol}</p>
                </td>

                {/* Estado con Badge */}
                <td className="px-6 py-4">
                  {renderStatusBadge(user.estado)}
                </td>

                {/* Último Acceso */}
                <td className="px-6 py-4 text-slate-500">
                  {user.ultimoLogin}
                </td>

                {/* Acciones y Menú Contextual */}
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    aria-label="Más opciones"
                    aria-expanded={activeMenu === user.id}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Dropdown */}
                  {activeMenu === user.id && (
                    <div className="absolute right-8 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => { onView(user); setActiveMenu(null); }} 
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-slate-400" /> Ver detalles
                      </button>
                      <button 
                        onClick={() => { onEdit(user); setActiveMenu(null); }} 
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" /> Editar
                      </button>                        
                      <button 
                        onClick={() => { onDelete(user); setActiveMenu(null); }} 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" /> Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}