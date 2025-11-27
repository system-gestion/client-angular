export interface OfertaCliente {
  id: number;
  cod_cliente: string;
  cod_articulo: number;
  tipo_descuento: number; // 1=Fijo, 2=Porcentual
  valor_descuento: number;
  fecha_creacion: string; // Date string
  fecha_caducidad: string; // Date string
  cantidad_limite: number;
  estado: number; // 0=Inactiva, 1=Activa
}

export interface OfertaClienteCreate {
  cod_cliente: string;
  cod_articulo: number;
  tipo_descuento: number;
  valor_descuento: number;
  fecha_caducidad: string;
  cantidad_limite: number;
  estado: number;
}
