import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registramos los módulos para el gráfico de líneas y ejes cartesianos
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 1. EL CONTRATO: Definimos la estructura exacta que nos manda tu backend
export interface GraficoLineasProps {
  datos?: {
    anio: number | string;
    precio: number;
    calidad: number;
    velocidad: number;
  }[];
}

export const GraficoLineas = ({ datos = [] }: GraficoLineasProps) => {
  
  // Programación defensiva por si el array viene vacío
  if (datos.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-400 italic bg-gray-50 rounded border border-dashed border-gray-300">
        Esperando evolución histórica...
      </div>
    );
  }

  // 2. MAPEO DINÁMICO: Separamos el array de objetos en los arrays simples que pide Chart.js
  const dataLineas = {
    // El eje X (abajo) van a ser los años extraídos de cada objeto
    labels: datos.map(item => item.anio.toString()), 
    datasets: [
      {
        label: 'Precio',
        data: datos.map(item => item.precio),
        borderColor: '#10B981', // Verde
        backgroundColor: '#10B981',
        tension: 0.3, // Suaviza los picos de las líneas
      },
      {
        label: 'Calidad',
        data: datos.map(item => item.calidad),
        borderColor: '#F59E0B', // Naranja
        backgroundColor: '#F59E0B',
        tension: 0.3,
      },
      {
        label: 'Velocidad',
        data: datos.map(item => item.velocidad),
        borderColor: '#3B82F6', // Azul
        backgroundColor: '#3B82F6',
        tension: 0.3,
      }
    ]
  };

  const opcionesLineas = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5, // Forzamos la escala del 0 al 5 según tu diseño
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  return (
    // Saqué el <h2> "Evolución Histórica" y el contenedor blanco porque en Estadisticas.tsx 
    // ya envolviste este gráfico adentro de un div blanco que tiene ese mismo título (h3).
    // Así evitamos que te quede el recuadro duplicado.
    <div className="w-full h-64 relative flex-grow">
      <Line data={dataLineas} options={opcionesLineas} />
    </div>
  );
};