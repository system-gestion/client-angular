export interface UsuarioResponse {
  cod_usuario: number;
  apellidos: string;
  nombres: string;
  nivel: number;
  correo: string;
  celular?: string;
  fecha_ingreso: string;
  estado: number;
  fecha_baja?: string;
  cod_cliente?: string;
}

export interface UsuarioCreate {
  cod_usuario?: number;
  apellidos: string;
  nombres: string;
  nivel: number;
  correo: string;
  celular?: string;
  password: string;
}

export interface UsuarioUpdate {
  apellidos?: string;
  nombres?: string;
  nivel?: number;
  correo?: string;
  celular?: string;
  password?: string;
  estado?: number;
}

export interface UsuarioOnline {
  cod_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  nivel: number;
  sesion_activa: boolean;
  ultima_actividad?: string;
}

export interface MessageResponse {
  message: string;
}
