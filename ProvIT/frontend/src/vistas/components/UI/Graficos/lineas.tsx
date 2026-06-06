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

// Registramos los módulos
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 1. EL CONTRATO CORREGIDO: Ahora espera 'etiqueta' en lugar de 'anio'
export interface GraficoLineasProps {
  datos?: {
    etiqueta: string | number; // Interfaz actualizada para coincidir con el Mapper
    precio: number;
    calidad: number;
    velocidad: number;
  }[];
}

export const GraficoLineas = ({ datos = [] }: GraficoLineasProps) => {
  
  // Programación defensiva
  if (!datos || datos.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-400 italic bg-gray-50 rounded border border-dashed border-gray-300">
        Esperando evolución histórica...
      </div>
    );
  }

  // 2. MAPEO DINÁMICO
  const dataLineas = {
    // Usamos String() constructor en lugar de .toString() para evitar errores si viene undefined
    labels: datos.map(item => String(item.etiqueta ?? "")), 
    datasets: [
      {
        label: 'Precio',
        data: datos.map(item => item.precio ?? 0), // Fallback a 0 si es null
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.3,
      },
      {
        label: 'Calidad',
        data: datos.map(item => item.calidad ?? 0),
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        tension: 0.3,
      },
      {
        label: 'Velocidad',
        data: datos.map(item => item.velocidad ?? 0),
        borderColor: '#3B82F6',
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
        max: 5,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  return (
    <div className="w-full h-64 relative flex-grow">
      <Line data={dataLineas} options={opcionesLineas} />
    </div>
  );
};