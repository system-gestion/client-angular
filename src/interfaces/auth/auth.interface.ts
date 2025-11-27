export interface UsuarioLogin {
  correo: string;
  password: string;
  nivel: number;
}

export interface MeResponse {
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

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  usuario: MeResponse;
  num_sesion: number;
}

export interface LogoutResponse {
  message: string;
}
