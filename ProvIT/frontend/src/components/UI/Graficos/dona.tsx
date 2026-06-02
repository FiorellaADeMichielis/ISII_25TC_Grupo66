import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ItemLeyenda } from '../ItemLeyenda';

// Registramos los módulos estrictamente necesarios para una dona
ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficoDona = () => {
  // Datos del gráfico (Pesos de evaluación)
  const dataDona = {
    labels: ['Velocidad de entrega', 'Precio', 'Calidad'],
    datasets: [
      {
        data: [33.3, 33.3, 33.4],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'], // Azul, Verde, Naranja
        borderWidth: 0,
      },
    ],
  };

  const opcionesDona = {
    cutout: '75%', // Define el grosor del anillo
    plugins: {
      legend: { display: false } // Apagamos la leyenda nativa para usar nuestra UI de Tailwind
    }
  };

  return (
    <div className="flex items-center gap-8 mb-8">
      {/* Contenedor del Canvas de Chart.js */}
      <div className="w-32 h-32 relative">
        <Doughnut data={dataDona} options={opcionesDona} />
      </div>
      
      {/* Leyenda maquetada con nuestras Moléculas */}
      <div className="flex-1">
        <ul className="text-sm space-y-3">
          <ItemLeyenda 
            etiqueta="Velocidad de entrega" 
            porcentaje="33.3%" 
            claseColor="bg-blue-500" 
          />
          <ItemLeyenda 
            etiqueta="Precio" 
            porcentaje="33.3%" 
            claseColor="bg-green-500" 
          />
          <ItemLeyenda 
            etiqueta="Calidad" 
            porcentaje="33.4%" 
            claseColor="bg-orange-500" 
          />
        </ul>
      </div>
    </div>
  );
};