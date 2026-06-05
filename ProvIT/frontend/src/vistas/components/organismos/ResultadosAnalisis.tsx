import React from 'react';
import { TarjetaAnalisis, type MetricasEntidad } from '../UI/Tarjetas/TarjetaAnalisis';

interface ResultadosAnalisisProps {
  modo: 'individual' | 'top3';
  tituloBase: string; // ej: "Análisis de Whitestack" o "Top 3: Laptops"
  resultados: MetricasEntidad[];
}

export const ResultadosAnalisis = ({ modo, tituloBase, resultados }: ResultadosAnalisisProps) => {
  
  // 1. Programación Defensiva: ¿Qué pasa si no hay datos en ese período?
  if (!resultados || resultados.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500 italic">
        No hay datos suficientes para generar el análisis con los filtros seleccionados.
      </div>
    );
  }

  // 2. Orquestación del Layout
  return (
    <div className="mt-8 animate-fade-in">
      {/* Cabecera del bloque */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
        {tituloBase}
      </h2>

      {/* Acá ocurre la magia del Layout Responsivo (CSS Grid):
        - Si modo === 'top3' -> En PC usa 3 columnas (lg:grid-cols-3). En celular 1 (grid-cols-1).
        - Si modo === 'individual' -> Siempre usa 1 columna que ocupa todo el ancho.
      */}
      <div className={`grid gap-6 ${modo === 'top3' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        
        {/* Mapeo dinámico: No importa si viene 1 proveedor o vienen 3, se renderizan igual */}
        {resultados.map((item, index) => (
          <div key={item.nombre || index} className="col-span-1 flex">
             {/* Componente Presentacional Aislado */}
             <TarjetaAnalisis datos={item} />
          </div>
        ))}

      </div>
    </div>
  );
};