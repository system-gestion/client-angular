export interface ComisionDetalle {
  num_pedido: number;
  fecha: string;
  cod_cliente: string;
  nombre_cliente?: string;
  importe: number;
  comision: number;
}

export interface ComisionResponse {
  cod_usuario: number;
  nombre_vendedor: string;
  total_ventas: number;
  cantidad_pedidos: number;
  porcentaje_comision: number;
  comision_total: number;
  periodo_inicio: string;
  periodo_fin: string;
}
