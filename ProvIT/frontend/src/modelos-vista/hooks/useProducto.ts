import { useState, useEffect } from 'react';
import { productoService } from '../../modelos/services/productoService';

export const useProductos = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await productoService.getAll();
        // IMPORTANTE: Aquí está el truco. 
        // Si data es un objeto con propiedades, busca dónde está el array.
        console.log("Datos recibidos en hook:", data);
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  return { productos, loading };
};