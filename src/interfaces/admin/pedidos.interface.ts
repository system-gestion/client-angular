export interface DetallePedidoCreate {
  cod_articulo: number;
  cantidad: number;
  subtotal: number;
  estado?: number;
}

export interface DetallePedidoResponse {
  num_pedido: number;
  cod_articulo: number;
  cantidad: number;
  subtotal: number;
  estado: number; // 0 = quitado, 1 = activo
  nombre_articulo?: string;
  pvp?: number;
}

export interface PedidoCreate {
  num_pedido?: number;
  fecha?: string;
  importe: number;
  cod_cliente: string;
  estado?: number; // 1=pending, 2=completed, 3=cancelled (default: 1)
  detalles?: DetallePedidoCreate[];
}

export interface PedidoResponse {
  num_pedido: number;
  fecha: string;
  importe: number;
  cod_cliente: string;
  estado: number; // 1=pending, 2=completed, 3=cancelled
  nombre_cliente?: string;
  detalles: DetallePedidoResponse[];
}

export interface PedidoUpdate {
  fecha?: string;
  importe?: number;
  cod_cliente?: string;
  estado?: number; // 1=pending, 2=completed, 3=cancelled
}

export interface PedidoEstadistica {
  total_pedidos: number;
  importe_total: number;
  promedio: number;
  pendientes: number;
  completados: number;
  cancelados: number;
}

export interface MessageResponse {
  message: string;
}
