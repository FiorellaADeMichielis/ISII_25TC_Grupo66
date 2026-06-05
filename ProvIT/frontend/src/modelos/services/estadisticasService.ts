import { api } from './api';

// ============================================================================
// 1. CONTRATOS DE PETICIÓN (Request DTOs)
// ============================================================================
export interface FiltrosAnalisisProveedor {
  id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface FiltrosTopProveedores {
  tipo: 'mejor' | 'peor';
  filtro_por: 'proveedor' | 'producto';
  variables: string; // ej: "precio,calidad"
  limite: number;
}

// ============================================================================
// 2. DTOs DEL BACKEND (Lo que escupe Django según tu services.py)
// ============================================================================
interface FiltrosBackend {
  proveedores: { id_proveedor: number; nombre_proveedor: string }[];
  productos: { id_producto: number; nombre_producto: string; fk_categoria__nombre_categoria: string }[];
  productos_por_proveedor: Record<string, { id_producto: number; nombre_producto: string }[]>;
}

interface AnalisisBackend {
  proveedor: { id: number; nombre: string };
  producto_id: number | null;
  periodo: { desde: string; hasta: string };
  graficaTorta: { precio: number; calidad: number; velocidad: number };
  graficaLineas: { anio: number; precio: number; calidad: number; velocidad: number }[];
  recomendacion: string;
}

interface TopBackend {
  tipo: string;
  filtro_por: string;
  variables: string[];
  periodo: { desde: string; hasta: string };
  graficaBarras: { nombre: string; puntaje: number; precio: number; calidad: number; velocidad: number }[];
  graficaLineas: any[]; // Array dinámico: { anio: 2024, "Prov A": 4.5, "Prov B": 3.2 }
}

// ============================================================================
// 3. MODELOS DE DOMINIO (Lo que consume React y Recharts)
// ============================================================================
export interface OpcionSelect {
  value: number | string;
  label: string;
  categoria?: string;
}

export interface DatosFiltrosUI {
  proveedores: OpcionSelect[];
  productos: OpcionSelect[];
  mapaProductos: Record<number, OpcionSelect[]>;
}

export interface AnalisisUI {
  proveedor: string;
  recomendacion: string;
  datosTorta: { name: string; value: number }[]; // Formateado para <PieChart> de Recharts
  datosLineas: any[]; // Directo al <LineChart>
}

// ============================================================================
// 4. DATA MAPPERS (Capa Anticorrupción)
// ============================================================================

const mapearFiltros = (dto: FiltrosBackend): DatosFiltrosUI => {
  // 1. Defensa absoluta: Si el backend no manda nada o falla silenciosamente
  if (!dto) {
    return { proveedores: [], productos: [], mapaProductos: {} };
  }

  const mapaLimpio: Record<number, OpcionSelect[]> = {};
  
  // 2. Extraemos el diccionario de forma segura (si es undefined, usamos {})
  const mapaBackendSeguro = dto.productos_por_proveedor || {};

  // Limpiamos las keys del diccionario que vienen como string desde Python
  Object.keys(mapaBackendSeguro).forEach((provId) => {
    // Por las dudas, aseguramos que el valor de esa key sea un array
    const productosDelProveedor = mapaBackendSeguro[provId] || [];
    
    mapaLimpio[Number(provId)] = productosDelProveedor.map(p => ({
      value: p.id_producto,
      label: p.nombre_producto
    }));
  });

  // 3. Extraemos las listas de forma segura (si son undefined, usamos [])
  const proveedoresSeguros = dto.proveedores || [];
  const productosSeguros = dto.productos || [];

  return {
    proveedores: proveedoresSeguros.map(p => ({
      value: p.id_proveedor,
      label: p.nombre_proveedor
    })),
    productos: productosSeguros.map(p => ({
      value: p.id_producto,
      label: p.nombre_producto,
      categoria: p.fk_categoria__nombre_categoria
    })),
    mapaProductos: mapaLimpio
  };
};

const mapearAnalisis = (dto: AnalisisBackend): AnalisisUI => ({
  proveedor: dto.proveedor.nombre,
  recomendacion: dto.recomendacion,
  // Transformamos el diccionario plano en un array de objetos para Recharts
  datosTorta: [
    { name: 'Precio', value: dto.graficaTorta.precio },
    { name: 'Calidad', value: dto.graficaTorta.calidad },
    { name: 'Velocidad', value: dto.graficaTorta.velocidad },
  ].filter(item => item.value !== null), // Evitamos graficar nulos
  
  datosLineas: dto.graficaLineas
});

// ============================================================================
// 5. FACHADA (Facade)
// ============================================================================
export const estadisticasService = {

  obtenerFiltrosDisponibles: async (): Promise<DatosFiltrosUI> => {
    const response = await api.get<FiltrosBackend>('/estadisticas/filtros/');
    return mapearFiltros(response.data);
  },

  obtenerAnalisisProveedor: async (filtros: FiltrosAnalisisProveedor): Promise<AnalisisUI> => {
    const response = await api.get<AnalisisBackend>('/estadisticas/analisis-proveedor/', {
      params: filtros 
    });
    return mapearAnalisis(response.data);
  },

  obtenerTopProveedores: async (filtros: FiltrosTopProveedores) => {
    // Acá no mapeamos mucho porque tu backend de Python ya envía la estructura
    // 'graficaBarras' y 'graficaLineas' lista para inyectarse en los gráficos.
    const response = await api.get<TopBackend>('/estadisticas/top-proveedores/', {
      params: filtros
    });
    return response.data;
  }

};