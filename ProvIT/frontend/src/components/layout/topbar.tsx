import { Search, Bell, Settings } from 'lucide-react';
import type { TopbarProps } from '../../types/layout.types';

export default function Topbar({ pageTitle }: TopbarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-3">
      
      {/* Título de la Página */}
      <h1 className="text-[15px] font-medium text-slate-900 flex-1 m-0">
        {pageTitle}
      </h1>

      {/* Barra de Búsqueda */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar proveedor..."
          className="bg-transparent border-none outline-none focus:ring-0 text-[13px] text-slate-900 w-40 placeholder:text-slate-400"
        />
      </div>

      {/* Botón de Notificaciones */}
      <button 
        aria-label="Notificaciones"
        className="relative w-[34px] h-[34px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
      >
        <Bell className="w-[18px] h-[18px]" />
        {/* Punto rojo de alerta */}
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
      </button>

      {/* Botón de Configuración */}
      <button 
        aria-label="Configuración de la cuenta"
        className="w-[34px] h-[34px] rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
      >
        <Settings className="w-[18px] h-[18px]" />
      </button>

    </header>
  );
}