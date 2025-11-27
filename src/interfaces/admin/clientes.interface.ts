export interface ClienteResponse {
  cod_cliente: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  cod_usuario?: number;
  // Datos de usuario
  correo?: string;
  celular?: string;
  estado?: number;
}

export interface ClienteCreate {
  cod_cliente: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  // Datos de usuario
  correo: string;
  celular?: string;
  password: string;
}

export interface ClienteUpdate {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  // Datos de usuario
  correo?: string;
  celular?: string;
  password?: string;
}
