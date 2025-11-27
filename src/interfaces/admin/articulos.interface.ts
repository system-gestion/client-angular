export interface ArticuloResponse {
  cod_articulo: number;
  nombre: string;
  pvp: number;
  stock: number;
  tipo_descuento?: number;
  valor_descuento?: number;
}

export interface ArticuloCreate {
  cod_articulo: number;
  nombre: string;
  pvp: number;
  stock: number;
}

export interface ArticuloUpdate {
  nombre?: string;
  pvp?: number;
  stock?: number;
  tipo_descuento?: number;
  valor_descuento?: number;
}

export interface OfertaResponse extends ArticuloResponse {
  en_oferta: boolean;
  descuento?: number;
  precio_oferta?: number;
}

export interface MessageResponse {
  message: string;
}
