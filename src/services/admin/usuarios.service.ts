import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  UsuarioResponse,
  UsuarioCreate,
  UsuarioUpdate,
  UsuarioOnline,
  MessageResponse
} from '@interface/admin/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);

  list(params?: { skip?: number; limit?: number; estado?: number; nivel?: number }): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(API_URL.usuarios.list(params));
  }

  create(usuario: UsuarioCreate): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(API_URL.usuarios.create, usuario);
  }

  getOnline(): Observable<UsuarioOnline[]> {
    return this.http.get<UsuarioOnline[]>(API_URL.usuarios.online);
  }

  search(q: string): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(API_URL.usuarios.search(q));
  }

  get(cod_usuario: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(API_URL.usuarios.get(cod_usuario));
  }

  update(cod_usuario: number, usuario: UsuarioUpdate): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(API_URL.usuarios.update(cod_usuario), usuario);
  }

  delete(cod_usuario: number): Observable<void> {
    return this.http.delete<void>(API_URL.usuarios.delete(cod_usuario));
  }

  deactivate(cod_usuario: number): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(API_URL.usuarios.deactivate(cod_usuario), {});
  }

  activate(cod_usuario: number): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(API_URL.usuarios.activate(cod_usuario), {});
  }
}
