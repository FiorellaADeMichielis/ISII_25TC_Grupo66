import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useLogin';

export const Sidebar = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Tableros', path: '/tableros', icon: <LayoutDashboard size={20} /> },
    { name: 'Proveedores', path: '/proveedores', icon: <Users size={20} /> },
    { name: 'Órdenes', path: '/ordenes', icon: <FileText size={20} /> },
    { name: 'Configuración', path: '/configuracion', icon: <Settings size={20} /> },
  ];

  // Función manejadora del botón
  const cerrarSesion = () => {
    if (window.confirm('¿Estás segura de que deseas cerrar sesión?')) {
      handleLogout(); // 1. Destruye la sesión en el controlador
      navigate('/login', { replace: true }); // 2. Redirige al login borrando el historial
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-black tracking-wider text-blue-400">ProvIT</h2>
        <p className="text-xs text-slate-400 mt-1">Gestión Inteligente</p>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={cerrarSesion}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};