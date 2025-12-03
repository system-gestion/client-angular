export interface ClienteResponse {
  cod_cliente: string;
  direccion?: string;
  cod_usuario: number;
  // Datos de usuario
  apellidos?: string;
  nombres?: string;
  correo?: string;
  celular?: string;
  estado?: number;
}

export interface ClienteCreate {
  cod_cliente: string;
  direccion?: string;
  // Datos de usuario (requeridos)
  apellidos: string;
  nombres: string;
  correo: string;
  celular?: string;
  password: string;
}

export interface ClienteUpdate {
  direccion?: string;
  // Datos de usuario
  apellidos?: string;
  nombres?: string;
  correo?: string;
  celular?: string;
  password?: string;
}
