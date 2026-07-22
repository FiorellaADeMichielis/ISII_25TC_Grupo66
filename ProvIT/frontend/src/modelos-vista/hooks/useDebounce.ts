import { useState, useEffect } from 'react';

/**
 * Te dejo esta explicación de cómo funciona el hook useDebounce, para que entiendas que es el hool useDebounce y cómo funciona:
 * useDebounce es un hook personalizado de React que retrasa la actualización de un valor hasta 
 * que haya pasado un tiempo específico (delay). Es muy útil para inputs de búsqueda y evitar saturar la API.
 * * @param value El valor que queremos retrasar (ej. un string de búsqueda)
 * @param delay Tiempo en milisegundos a esperar (ej. 500)
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado y setter para almacenar el valor retrasado
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura un temporizador que actualizará el debouncedValue después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Función de limpieza (Cleanup):
    // Si el 'value' o el 'delay' cambian antes de que termine el temporizador,
    // React ejecuta esta limpieza, cancelando el timeout anterior.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue;
}