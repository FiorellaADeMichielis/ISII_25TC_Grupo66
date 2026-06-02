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

export const GraficoLineas = () => {
  const dataLineas = {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Precio',
        data: [2, 3, 3, 4, 5],
        borderColor: '#10B981', // Verde
        backgroundColor: '#10B981',
        tension: 0.3, // Suaviza los picos de las líneas
      },
      {
        label: 'Calidad',
        data: [3, 2, 4, 4, 5],
        borderColor: '#F59E0B', // Naranja
        backgroundColor: '#F59E0B',
        tension: 0.3,
      },
      {
        label: 'Velocidad',
        data: [0, 2, 3, 5, 5],
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
    <div className="bg-white p-6 rounded-lg shadow-sm flex-grow flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Evolución Histórica</h2>
      <div className="w-full h-64 relative flex-grow">
        <Line data={dataLineas} options={opcionesLineas} />
      </div>
    </div>
  );
};