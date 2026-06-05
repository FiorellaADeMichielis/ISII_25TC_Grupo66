export interface Factura {
  id_factura: number;
  nro_factura: number;
  fecha_emision: string;
  monto_total: number;
  estado_validacion: number; // 0: pendiente, 1: validado, 2: rechazado
  archivo_url?: string;
}

export interface Pedido {
  id_pedido: number;
  estado_pedido: string;
  fecha_emision: string;
  fecha_entrega_esperada: string;
  fecha_entrega_real?: string;
  proveedor_nombre: string; // Asumimos que tu serializer de Django lo incluye
  facturas: Factura[];
}