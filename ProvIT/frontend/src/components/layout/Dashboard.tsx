import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import Topbar from './topbar'; 

export const Dashboard = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. Menú lateral fijo a la izquierda */}
      <Sidebar />

      {/* 2. Contenedor derecho (Columna para Topbar y Contenido) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Barra superior ocupando todo el ancho de la columna */}
        <Topbar pageTitle="Dashboard" />

        {/* Contenido principal con scroll independiente */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet /> 
        </main>
        
      </div>

    </div>
  );
};