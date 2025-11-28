import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  UsuarioResponse,
  UsuarioCreate,
  UsuarioUpdate,
  UsuarioOnline,
  MessageResponse,
} from '@interface/admin/usuarios.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);

  list(params?: {
    skip?: number;
    limit?: number;
    estado?: number;
    nivel?: number;
    q?: string;
  }): Observable<UsuarioResponse[]> {
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

  // WebSocket Lock Logic
  private authService = inject(AuthService);
  private socket: WebSocket | null = null;
  private reconnectInterval = 3000;
  private isConnected = signal(false);

  lockStatus = signal<{ status: 'GRANTED' | 'LOCKED' | null; owner?: string }>({ status: null });

  connectWs() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const user = this.authService.user();
    if (!user) return;

    const supervisorName = `${user.nombres} ${user.apellidos}`;
    const wsUrl = API_URL.ws.usersEditing(supervisorName);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WS Connected');
      this.isConnected.set(true);
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      console.log('WS Message', message);
      if (message.startsWith('GRANTED')) {
        this.lockStatus.set({ status: 'GRANTED' });
      } else if (message.startsWith('LOCKED')) {
        const parts = message.split(' BY ');
        const owner = parts.length > 1 ? parts[1] : 'Desconocido';
        this.lockStatus.set({ status: 'LOCKED', owner });
      }
    };

    this.socket.onclose = () => {
      console.log('WS Disconnected');
      this.isConnected.set(false);
      this.lockStatus.set({ status: null });
      setTimeout(() => this.connectWs(), this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error('WS Error', error);
      this.socket?.close();
    };
  }

  requestLock(userId: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(`LOCK ${userId}`);
    } else {
      this.connectWs();
      setTimeout(() => this.requestLock(userId), 1000);
    }
  }

  releaseLock(userId: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(`UNLOCK ${userId}`);
      this.lockStatus.set({ status: null });
    }
  }

  disconnectWs() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
