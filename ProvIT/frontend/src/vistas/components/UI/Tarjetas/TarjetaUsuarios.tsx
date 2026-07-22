import { Tarjeta } from './Tarjeta'; //componente base de KPI
import { type TarjetaUsuariosProps } from '../../../../modelos/types/metricas.types';
// Exportamos la interfaz para que tu orquestador la conozca

export const TarjetaUsuarios = ({ datos }: TarjetaUsuariosProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col h-full shadow-sm">
      {/* 1. Cabecera */}
      <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
        {datos.nombre}
      </h3>
      {/* 2. Las Métricas inyectadas en las Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Tarjeta 
          titulo="Total Usuarios" 
          valor={datos.total} 
          claseBordeColor="border-blue-500" 
        />
        <Tarjeta 
          titulo="Usuarios Activos" 
          valor={datos.activos} 
          claseBordeColor="border-green-500" 
        />
        <Tarjeta 
          titulo="Usuarios Inactivos" 
          valor={datos.inactivos} 
          claseBordeColor="border-purple-500" 
        />
        <Tarjeta
          titulo="Administradores"
          valor={datos.administradores}
          claseBordeColor="border-indigo-500"
        />
        <Tarjeta
          titulo="Operadores"
          valor={datos.operadores}
          claseBordeColor="border-red-500"
        />s
      </div>
    </div>
  );
};