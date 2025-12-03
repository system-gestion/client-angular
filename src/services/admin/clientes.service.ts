import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { ClienteResponse, ClienteCreate, ClienteUpdate } from '@interface/admin/clientes.interface';
import { AuthService } from '@service/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  list(params?: { skip?: number; limit?: number; q?: string }): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(API_URL.clientes.list(params));
  }

  create(cliente: ClienteCreate): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(API_URL.clientes.create, cliente);
  }

  search(q: string): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(API_URL.clientes.search(q));
  }

  get(cod_cliente: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(API_URL.clientes.get(cod_cliente));
  }

  update(cod_cliente: string, cliente: ClienteUpdate): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(API_URL.clientes.update(cod_cliente), cliente);
  }

  delete(cod_cliente: string): Observable<void> {
    return this.http.delete<void>(API_URL.clientes.delete(cod_cliente));
  }

  // WebSocket Lock Logic
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

    const vendedorName = `${user.nombres} ${user.apellidos}`;
    const wsUrl = API_URL.ws.clientesEditing(vendedorName);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WS Clientes Connected');
      this.isConnected.set(true);
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      console.log('WS Clientes Message', message);
      if (message.startsWith('GRANTED')) {
        this.lockStatus.set({ status: 'GRANTED' });
      } else if (message.startsWith('LOCKED')) {
        const parts = message.split(' BY ');
        const owner = parts.length > 1 ? parts[1] : 'Desconocido';
        this.lockStatus.set({ status: 'LOCKED', owner });
      }
    };

    this.socket.onclose = () => {
      console.log('WS Clientes Disconnected');
      this.isConnected.set(false);
      this.lockStatus.set({ status: null });
      setTimeout(() => this.connectWs(), this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error('WS Clientes Error', error);
      this.socket?.close();
    };
  }

  requestLock(clienteId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(`LOCK ${clienteId}`);
    } else {
      this.connectWs();
      setTimeout(() => this.requestLock(clienteId), 1000);
    }
  }

  releaseLock(clienteId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(`UNLOCK ${clienteId}`);
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
