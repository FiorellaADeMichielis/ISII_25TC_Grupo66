import { Tarjeta } from './Tarjeta'; // Tu componente base de KPI

// Exportamos la interfaz para que tu orquestador la conozca
export interface MetricasEntidad {
  nombre: string;
  precio: number;
  calidad: number;
  velocidad: number;
  recomendacion?: string;
}

interface TarjetaResultadoProps {
  datos: MetricasEntidad;
}

export const TarjetaAnalisis = ({ datos }: TarjetaResultadoProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col h-full shadow-sm">
      {/* 1. Cabecera */}
      <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
        {datos.nombre}
      </h3>

      {/* 2. Recomendación (Se muestra solo si existe, ej: en el análisis individual) */}
      {datos.recomendacion && (
        <p className="italic text-sm text-gray-700 bg-blue-100 p-3 rounded mb-4">
          {datos.recomendacion}
        </p>
      )}

      {/* 3. Las Métricas inyectadas en tus Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Tarjeta 
          titulo="Precio" 
          valor={datos.precio} 
          claseBordeColor="border-blue-500" 
        />
        <Tarjeta 
          titulo="Calidad" 
          valor={datos.calidad} 
          claseBordeColor="border-green-500" 
        />
        <Tarjeta 
          titulo="Velocidad" 
          valor={datos.velocidad} 
          claseBordeColor="border-purple-500" 
        />
      </div>

      {/* 4. Espacio para el gráfico (mt-auto empuja esto siempre abajo para alinear las tarjetas) */}
      <div className="bg-white flex items-center justify-center h-48 border border-dashed border-gray-300 rounded mt-auto">
        <span className="text-gray-400">Gráfico de {datos.nombre}</span>
      </div>
    </div>
  );
};