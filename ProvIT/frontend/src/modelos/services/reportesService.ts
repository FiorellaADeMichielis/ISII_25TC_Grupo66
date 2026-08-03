// src/modelos/services/reporteService.ts

import type { Reporte, IReporteService, FormatoExportacion } from '../types/reportes.types';

// Datos estáticos (Mock) para simular la base de datos
const REPORTES_MOCK: Reporte[] = [
  { 
    id: '1', 
    titulo: 'Análisis del producto más pedido', 
    descripcion: 'Resumen del producto más pedido.', 
    fechaCreacion: '2026-07-20', 
    autor: { id: '2', nombre: 'Carlos Admin' }, 
    destacado: true, 
    tipo: 'Producto' 
  },
  { 
    id: '2', 
    titulo: 'Proveedor con el mejor tiempo de entrega', 
    descripcion: 'Métricas de tiempo de entrega del proveedor con mejor desempeño en el último mes.', 
    fechaCreacion: '2026-07-28', 
    autor: { id: '3', nombre: 'Lucía Admin' }, 
    destacado: false, 
    tipo: 'Proveedor' 
  },
  { 
    id: '3', 
    titulo: 'Top 3 productos más pedidos por categoría', 
    descripcion: 'Resumen de los productos más pedidos por categoría en el último trimestre.', 
    fechaCreacion: '2026-07-25', 
    autor: { id: '2', nombre: 'Carlos Admin' }, 
    destacado: true, 
    tipo: 'Producto' 
  },
];

// Implementación Mock que cumple con el contrato IReporteService
class ReporteServiceMock implements IReporteService {
  
  async obtenerReportes(): Promise<Reporte[]> {
    // Simulamos el delay de una petición HTTP (ej: 500ms)
    return new Promise((resolve) => {
      setTimeout(() => resolve([...REPORTES_MOCK]), 500);
    });
  }

  async toggleDestacado(id: string, estadoActual: boolean): Promise<{ exito: boolean; nuevoEstado?: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Acá a futuro harás el Axios.patch(...)
        console.log(`Backend simulado: Reporte ${id} ahora es destacado=${!estadoActual}`);
        resolve({ exito: true, nuevoEstado: !estadoActual });
      }, 300);
    });
  }

  async exportarReporte(id: string, formato: FormatoExportacion): Promise<{ exito: boolean; mensaje: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Acá a futuro harás el Axios.post(...) o descargarás el Blob
        const mensajes = {
          pdf: 'Reporte descargado como PDF exitosamente.',
          excel: 'Reporte descargado como hoja de cálculo.',
          email: 'El reporte fue enviado por correo al destinatario.'
        };
        resolve({ exito: true, mensaje: mensajes[formato] });
      }, 800); // Tarda un poquito más simulando la generación del archivo
    });
  }
}

// ============================================================================
// EXPORTACIÓN DE LA FACHADA
// ============================================================================
// El resto de la app (Hooks, Componentes) consumirá 'ReporteService'.
// A futuro, solo cambia 'new ReporteServiceMock()' por 'new ReporteServiceApi()'.
export const ReporteService = new ReporteServiceMock();