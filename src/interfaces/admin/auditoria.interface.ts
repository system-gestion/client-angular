export interface DetalleSesionResponse {
  num_detalle: number;
  num_sesion: number;
  cod_usuario: number;
  tabla: string;
  accion: number;
  nombre_usuario?: string;
  accion_text?: string;
}

export interface SesionLogResponse {
  num_sesion: number;
  cod_usuario?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: number;
  nombre_usuario?: string;
  detalles: DetalleSesionResponse[];
}

export interface ActividadUsuario {
  cod_usuario: number;
  nombre_usuario: string;
  total_sesiones: number;
  sesiones_activas: number;
  total_acciones: number;
  ultima_sesion?: string;
}
