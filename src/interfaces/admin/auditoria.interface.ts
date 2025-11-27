export interface DetalleSesionResponse {
  num_detalle: number;
  num_sesion: number;
  cod_usuario: number;
  tabla: string;
  accion: number;
  hora?: string;
  nombre_usuario?: string;
  accion_text?: string;
  datos_json?: string;
  rollback_realizado?: number; // 0 = no, 1 = sí
}

export interface SesionLogResponse {
  num_sesion: number;
  cod_usuario?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: number;
  nombre_usuario?: string;
  correo_usuario?: string;
  detalles: DetalleSesionResponse[];
}

export interface SesionLogList {
  num_sesion: number;
  cod_usuario?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: number;
  nombre_usuario?: string;
  correo_usuario?: string;
  total_acciones: number;
}

export interface ActividadUsuario {
  cod_usuario: number;
  nombre_usuario: string;
  total_sesiones: number;
  sesiones_activas: number;
  total_acciones: number;
  ultima_sesion?: string;
}

export interface AuditSnapshot {
  old_data?: Record<string, any> | null;
  new_data?: Record<string, any> | null;
  [key: string]: any; // Fallback for legacy structure
}
