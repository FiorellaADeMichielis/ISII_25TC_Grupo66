// src/modelos/types/reportes.types.ts

// 1. Tipos primitivos y Enums de negocio
export type TipoReporte = 'Proveedor' | 'Producto' 
export type FormatoExportacion = 'pdf' | 'excel' | 'email';
export type RangoFechaFiltro = 'todos' | 'semana' | 'mes';

// 2. Entidades Principales
export interface AutorReporte {
  id: string;
  nombre: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  fechaCreacion: string; 
  autor: AutorReporte;
  destacado: boolean;
  tipo: TipoReporte;
}

export interface FiltrosReporte {
  busqueda: string;
  soloDestacados: boolean;
  autorId: string;
  rangoFecha: RangoFechaFiltro;
}

// 3. Contrato (Interface) para el Patrón Fachada del Servicio
// Cualquier servicio DEBE cumplir con esta estructura.
export interface IReporteService {
  obtenerReportes: () => Promise<Reporte[]>;
  toggleDestacado: (id: string, estadoActual: boolean) => Promise<{ exito: boolean; nuevoEstado?: boolean }>;
  exportarReporte: (id: string, formato: FormatoExportacion) => Promise<{ exito: boolean; mensaje: string }>;
}