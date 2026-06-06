// ============================================================================
// 1. CONTRATOS DE PETICIÓN (Request DTOs)
// ============================================================================

export interface FiltrosAnalisisProveedor {
  proveedor_id: number;    // Cambiado de 'id' a 'proveedor_id'
  producto_id?: number;    // Opcional, según tu views.py
  fecha_inicio: string;
  fecha_fin: string;
}

export interface FiltrosTopProveedores {
  tipo: 'mejor' | 'peor';
  filtro_por: 'proveedor' | 'producto';
  variables: string;
  limite: number;
  fecha_inicio: string;    // Django view exige estos parámetros
  fecha_fin: string;       // Django view exige estos parámetros
}

// ============================================================================
// 2. DTOs DEL BACKEND (Django JSON)
// ============================================================================
export interface FiltrosBackend {
  proveedores: { id_proveedor: number; nombre_proveedor: string }[];
  productos: { id_producto: number; nombre_producto: string; fk_categoria__nombre_categoria: string }[];
  productos_por_proveedor: Record<string, { id_producto: number; nombre_producto: string }[]>;
}

export interface AnalisisBackend {
  proveedor: { id: number; nombre: string };
  producto_id: number | null;
  periodo: { desde: string; hasta: string };
  graficaTorta: { precio: number; calidad: number; velocidad: number };
  graficaLineas: {
    anio?: number;   // presente cuando el rango es multi-año
    mes?: number;    // presente cuando el rango es dentro del mismo año
    precio: number | null;
    calidad: number | null;
    velocidad: number | null;
  }[];
  recomendacion: string;
}

export interface TopBackend {
  tipo: string;
  filtro_por: string;
  variables: string[];
  periodo: { desde: string; hasta: string };
  graficaBarras: { nombre: string; puntaje: number; precio: number; calidad: number; velocidad: number }[];
  graficaLineas: any[]; 
}

// ============================================================================
// 3. MODELOS DE DOMINIO (UI React)
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
  datosLineas: any[]; 
}