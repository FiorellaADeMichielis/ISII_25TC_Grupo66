import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Settings, LogOut, UserCog } from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import type { MenuItem } from "../../types/layout.types";

const SIZE = 20;

function NavIcon({ iconName }: { iconName: MenuItem["iconName"] }) {
  switch (iconName) {
    case "tableros":      return <LayoutDashboard size={SIZE} />;
    case "proveedores":   return <Users size={SIZE} />;
    case "facturas":      return <FileText size={SIZE} />;
    case "usuarios":      return <UserCog size={SIZE} />;
    case "configuracion": return <Settings size={SIZE} />;
    default:              return <Settings size={SIZE} />;
  }
}

export function Sidebar() {
  const { menuPermitido, cerrarSesion } = useSidebar();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl">

      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-black tracking-wider text-blue-400">ProvIT</h2>
        <p className="text-xs text-slate-400 mt-1">Gestión inteligente de proveedores</p>
      </div>

      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {menuPermitido.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <NavIcon iconName={item.iconName} />
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
          <LogOut size={SIZE} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
}