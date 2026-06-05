// ============================================================================
// 1. ENVOLTORIO GENÉRICO PARA DJANGO
// ============================================================================
export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  data: T;
}

// ============================================================================
// 2. DTOs DEL BACKEND (Lo que envía y recibe Django en snake_case)
// ============================================================================
export interface DetallePedidoBackend {
  fk_producto: number;
  nombre_producto?: string; 
  cantidad_producto: number;
  precio_unitario: number | string; 
}

export interface FacturaBackend {
  id_factura: number;
  nro_factura: number;
  monto_total: string | number; 
  estado_validacion: number;
}

export interface PedidoBackend {
  id_pedido: number;
  estado_pedido: string;
  fecha_emision: string;
  fecha_entrega_esperada: string;
  fecha_entrega_real: string | null;
  fk_proveedor: number;
  nombre_proveedor?: string; 
  detalles: DetallePedidoBackend[];
  facturas?: FacturaBackend[]; 
}

// ============================================================================
// 3. MODELOS DE DOMINIO UI (Lo que usa React en camelCase)
// ============================================================================
export interface DetallePedidoUI {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number; 
}

export interface FacturaUI {
  idFactura: number;
  nroFactura: number;
  montoTotal: number;
  estadoValidacion: number;
}

export interface PedidoUI {
  id: number;
  estado: string;
  fechaEmision: string;
  fechaEntregaEsperada: string;
  fechaEntregaReal: string | null;
  proveedorId: number;
  proveedorNombre: string;
  detalles: DetallePedidoUI[];
  totalPedido: number; 
  facturas: FacturaUI[]; 
}

// ============================================================================
// 4. MODELO DE FORMULARIO (Para crear un pedido nuevo en el Modal)
// ============================================================================
export interface PedidoFormData {
  proveedorId: number | '';
  fechaEntregaEsperada: string;
  fechaEntregaReal?: string; 
  detalles: {
    productoId: number | '';
    cantidad: number | '';
    precioUnitario: number | '';
  }[];
}

export interface ErroresFormPedido {
  proveedor?: string;
  fechas?: string;
  detalles?: string;
  general?: string;
}