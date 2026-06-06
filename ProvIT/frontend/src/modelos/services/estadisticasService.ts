import { api } from './api';

// ============================================================================
// 1. CONTRATOS DE PETICIÓN (Request DTOs)
// ============================================================================
export interface FiltrosAnalisisProveedor {
  proveedor_id?: number; // Corregido: nombre exacto que espera el backend
  producto_id?: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface FiltrosTopProveedores {
  tipo: 'mejor' | 'peor';
  filtro_por: 'proveedor' | 'producto';
  variables: string;
  limite: number;
  fecha_inicio: string;
  fecha_fin: string;
}

// ============================================================================
// 2. DTOs DEL BACKEND
// ============================================================================
interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  data: T;
}

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
  // Aceptamos mes o anio indistintamente
  graficaLineas: { 
    anio?: number; 
    mes?: number; 
    precio: number | null; 
    calidad: number | null; 
    velocidad: number | null 
  }[];
  recomendacion: string;
}

interface TopBackend {
  tipo: string;
  filtro_por: string;
  variables: string[];
  periodo: { desde: string; hasta: string };
  graficaBarras: { nombre: string; puntaje: number; precio: number; calidad: number; velocidad: number }[];
  graficaLineas: any[];
}

// ============================================================================
// 3. MODELOS DE DOMINIO
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
  datosTorta: { name: string; value: number }[];
  datosLineas: { 
    etiqueta: string; // Normalizada: "Ene", "Feb"... o "2026"
    precio: number; 
    calidad: number; 
    velocidad: number 
  }[];
}

// ============================================================================
// 4. DATA MAPPERS (Capa Anticorrupción)
// ============================================================================

const obtenerNombreMes = (num: number) => 
  ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][num];

const mapearFiltros = (dto: FiltrosBackend): DatosFiltrosUI => {
  if (!dto) return { proveedores: [], productos: [], mapaProductos: {} };

  const mapaLimpio: Record<number, OpcionSelect[]> = {};
  const mapaBackendSeguro = dto.productos_por_proveedor || {};

  Object.keys(mapaBackendSeguro).forEach((provId) => {
    const productosDelProveedor = mapaBackendSeguro[provId] || [];
    mapaLimpio[Number(provId)] = productosDelProveedor.map(p => ({
      value: p.id_producto,
      label: p.nombre_producto
    }));
  });

  return {
    proveedores: (dto.proveedores || []).map(p => ({
      value: p.id_proveedor,
      label: p.nombre_proveedor
    })),
    productos: (dto.productos || []).map(p => ({
      value: p.id_producto,
      label: p.nombre_producto,
      categoria: p.fk_categoria__nombre_categoria
    })),
    mapaProductos: mapaLimpio
  };
};

const mapearAnalisis = (dto: AnalisisBackend): AnalisisUI => {
  return {
    proveedor: dto.proveedor.nombre,
    recomendacion: dto.recomendacion,
    datosTorta: [
      { name: 'Precio',    value: dto.graficaTorta.precio    ?? 0 },
      { name: 'Calidad',   value: dto.graficaTorta.calidad   ?? 0 },
      { name: 'Velocidad', value: dto.graficaTorta.velocidad ?? 0 },
    ].filter(item => item.value > 0),

    datosLineas: dto.graficaLineas.map(item => ({
      // Si viene mes → "Ene", "Feb"... Si viene anio → "2024", "2025"...
      etiqueta:  item.mes  ? obtenerNombreMes(item.mes)
               : item.anio ? String(item.anio)
               : "",
      precio:    item.precio    ?? 0,
      calidad:   item.calidad   ?? 0,
      velocidad: item.velocidad ?? 0,
    })),
  };
};

// ============================================================================
// 5. FACHADA (Facade)
// ============================================================================
export const estadisticasService = {

  obtenerFiltrosDisponibles: async (): Promise<DatosFiltrosUI> => {
    const response = await api.get<ApiResponse<FiltrosBackend>>('/estadisticas/filtros/');
    return mapearFiltros(response.data.data);
  },

  obtenerAnalisisProveedor: async (filtros: FiltrosAnalisisProveedor): Promise<AnalisisUI> => {
    // Axios serializa automáticamente el objeto 'filtros' en parámetros de URL
    const response = await api.get<ApiResponse<AnalisisBackend>>('/estadisticas/analisis-proveedor/', {
      params: filtros 
    });
    return mapearAnalisis(response.data.data);
  },

  obtenerTopProveedores: async (filtros: FiltrosTopProveedores) => {
    const response = await api.get<ApiResponse<TopBackend>>('/estadisticas/top-proveedores/', {
      params: filtros
    });
    return response.data.data;
  }
};