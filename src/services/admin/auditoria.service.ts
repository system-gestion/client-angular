import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  DetalleSesionResponse,
  SesionLogResponse,
  ActividadUsuario
} from '@interface/admin/auditoria.interface';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private http = inject(HttpClient);

  listSesiones(params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: number;
    skip?: number;
    limit?: number;
  }): Observable<SesionLogResponse[]> {
    return this.http.get<SesionLogResponse[]>(API_URL.auditoria.sesiones(params));
  }

  getSesion(num_sesion: number): Observable<SesionLogResponse> {
    return this.http.get<SesionLogResponse>(API_URL.auditoria.sesion(num_sesion));
  }

  listAcciones(params?: {
    cod_usuario?: number;
    tabla?: string;
    accion?: number;
    skip?: number;
    limit?: number;
  }): Observable<DetalleSesionResponse[]> {
    return this.http.get<DetalleSesionResponse[]>(API_URL.auditoria.acciones(params));
  }

  getActividadUsuario(cod_usuario: number): Observable<ActividadUsuario> {
    return this.http.get<ActividadUsuario>(API_URL.auditoria.actividadUsuario(cod_usuario));
  }

  getResumen(): Observable<ActividadUsuario[]> {
    return this.http.get<ActividadUsuario[]>(API_URL.auditoria.resumen);
  }
}
