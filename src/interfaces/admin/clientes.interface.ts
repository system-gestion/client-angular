export interface ClienteResponse {
  cod_cliente: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface ClienteCreate {
  cod_cliente: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface ClienteUpdate {
  nombre?: string;
  direccion?: string;
  telefono?: string;
}
