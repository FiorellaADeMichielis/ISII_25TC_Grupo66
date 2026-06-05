import { Tarjeta } from '../UI/Tarjetas/Tarjeta'; // Importás tu componente existente

export interface PanelMetricasProps {
  precio: number;
  calidad: number;
  velocidad: number;
}

export const PanelMetricas = ({ precio, calidad, velocidad }: PanelMetricasProps) => {
  return (
    // Usamos un grid para que las 3 tarjetas se pongan una al lado de la otra
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <Tarjeta 
        titulo="Escala de Precio" 
        valor={precio} 
        claseBordeColor="border-blue-500" 
      />
      <Tarjeta 
        titulo="Nivel de Calidad" 
        valor={calidad} 
        claseBordeColor="border-green-500" 
      />
      <Tarjeta 
        titulo="Puntualidad" 
        valor={velocidad} 
        claseBordeColor="border-purple-500" 
      />
    </div>
  );
};