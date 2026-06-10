import { api } from './api';
import type { 
  ApiResponse, 
  PedidoBackend, 
  PedidoUI, 
  PedidoFormData 
} from '../types/pedido.types'; 

const mapearPedido = (dto: PedidoBackend): PedidoUI => {
  const detallesMapeados = (dto.detalles || []).map(detalle => ({
    productoId: detalle.fk_producto,
    nombreProducto: detalle.nombre_producto || 'Producto sin nombre',
    cantidad: detalle.cantidad_producto,
    precioUnitario: Number(detalle.precio_unitario),
    subtotal: detalle.cantidad_producto * Number(detalle.precio_unitario)
  }));

  const totalPedido = detallesMapeados.reduce((acc, det) => acc + det.subtotal, 0);

  const facturasMapeadas = (dto.facturas || []).map(factura => ({
    idFactura: factura.id_factura,
    nroFactura: factura.nro_factura,
    montoTotal: Number(factura.monto_total), 
    estadoValidacion: factura.estado_validacion
  }));

  return {
    id: dto.id_pedido,
    estado: dto.estado_pedido,
    fechaEmision: dto.fecha_emision,
    fechaEntregaEsperada: dto.fecha_entrega_esperada,
    fechaEntregaReal: dto.fecha_entrega_real,
    proveedorId: dto.fk_proveedor,
    proveedorNombre: dto.nombre_proveedor || `Proveedor #${dto.fk_proveedor}`,
    detalles: detallesMapeados,
    totalPedido: totalPedido,
    facturas: facturasMapeadas
  };
};

export const pedidoService = {
  
  obtenerTodos: async (): Promise<PedidoUI[]> => {
    const response = await api.get<ApiResponse<PedidoBackend[]>>('/pedidos/');
    return response.data.data.map(mapearPedido);
  },

  crearPedido: async (datos: PedidoFormData): Promise<PedidoUI> => {
    const payload = {
      fk_proveedor: datos.proveedorId,
      fecha_entrega_esperada: datos.fechaEntregaEsperada,
      fecha_entrega_real: datos.fechaEntregaReal ? datos.fechaEntregaReal : null, // <-- Manejo seguro de la fecha opcional
      detalles: datos.detalles.map(d => ({
        fk_producto: d.productoId,
        cantidad_producto: d.cantidad,
        precio_unitario: d.precioUnitario
      }))
    };

    const response = await api.post<ApiResponse<PedidoBackend>>('/pedidos/', payload);
    return mapearPedido(response.data.data);
  },

  analizarFacturaOCR: async (archivo: File): Promise<Partial<PedidoFormData>> => {
    const formData = new FormData();
    formData.append('factura', archivo);
    
    const response = await api.post<ApiResponse<Partial<PedidoFormData>>>('/pedidos/ocr/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }
};