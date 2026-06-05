import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ItemLeyenda } from '../ItemLeyenda';

// Registramos los módulos estrictamente necesarios para una dona
ChartJS.register(ArcElement, Tooltip, Legend);

// 1. EL CONTRATO: Definimos qué datos va a recibir el gráfico
export interface GraficoDonaProps {
  datos?: { name: string; value: number }[];
}

// 2. DICCIONARIO DE COLORES SEMÁNTICOS
// Asociamos cada métrica con su color Hexadecimal (para Chart.js) y su clase Tailwind (para tu leyenda)
const MAPA_COLORES: Record<string, { hex: string; tw: string }> = {
  'Velocidad': { hex: '#3B82F6', tw: 'bg-blue-500' },
  'Precio': { hex: '#10B981', tw: 'bg-green-500' },
  'Calidad': { hex: '#F59E0B', tw: 'bg-orange-500' },
};

export const GraficoDona = ({ datos = [] }: GraficoDonaProps) => {
  
  // Programación defensiva: Si no hay datos, no intentamos dibujar nada
  if (datos.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-400 italic mb-8">
        Esperando datos del análisis...
      </div>
    );
  }

  // 3. PREPARAMOS LOS DATOS PARA CHART.JS DINÁMICAMENTE
  const dataDona = {
    labels: datos.map(d => d.name),
    datasets: [
      {
        data: datos.map(d => d.value),
        // Buscamos el color en el diccionario, si no existe usamos un gris por defecto
        backgroundColor: datos.map(d => MAPA_COLORES[d.name]?.hex || '#9CA3AF'),
        borderWidth: 0,
      },
    ],
  };

  const opcionesDona = {
    cutout: '75%', // Define el grosor del anillo
    plugins: {
      legend: { display: false }, // Apagamos la leyenda nativa
      tooltip: {
        callbacks: {
          // Formateamos el tooltip para que muestre el valor correctamente
          label: (context: any) => ` ${context.label}: ${context.raw}`
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-8 mb-8">
      {/* Contenedor del Canvas de Chart.js */}
      <div className="w-32 h-32 relative">
        <Doughnut data={dataDona} options={opcionesDona} />
      </div>
      
      {/* Leyenda maquetada dinámicamente con tus Moléculas */}
      <div className="flex-1">
        <ul className="text-sm space-y-3">
          {datos.map((item, index) => (
            <ItemLeyenda 
              key={index}
              etiqueta={item.name} 
              // Convertimos el valor numérico a string. Podés agregarle un '%' o un '/ 5' según tu lógica de negocio
              porcentaje={item.value.toString()} 
              claseColor={MAPA_COLORES[item.name]?.tw || 'bg-gray-500'} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};