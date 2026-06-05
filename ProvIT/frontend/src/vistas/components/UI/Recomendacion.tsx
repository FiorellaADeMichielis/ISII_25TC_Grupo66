// 1. EL CONTRATO: Le decimos que va a recibir un string llamado "texto"
export interface AlertaRecomendacionProps {
  texto?: string; // Lo hacemos opcional (?) por las dudas de que el backend mande null
}

export const AlertaRecomendacion = ({ texto }: AlertaRecomendacionProps) => {
  
  // Programación defensiva: Si no hay recomendación, no dibujamos la alerta
  if (!texto) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-md text-gray-400 text-sm italic text-center">
        No hay recomendaciones suficientes para este análisis.
      </div>
    );
  }

  // Renderizamos una alerta con un diseño destacable (estilo info/sugerencia)
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow-sm h-full flex flex-col justify-center">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {/* Ícono de foquito o información */}
          <span className="text-blue-500 text-lg" role="img" aria-label="Sugerencia">💡</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-1">
            Recomendación del Sistema
          </h3>
          <div className="text-sm text-blue-700 leading-relaxed">
            <p>{texto}</p>
          </div>
        </div>
      </div>
    </div>
  );
};