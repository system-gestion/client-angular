import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  DetallePedidoCreate,
  DetallePedidoResponse,
  PedidoCreate,
  PedidoResponse,
  PedidoUpdate,
  PedidoEstadistica,
  MessageResponse
} from '@interface/admin/pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private http = inject(HttpClient);

  list(params?: { skip?: number; limit?: number }): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.list(params));
  }

  create(pedido: PedidoCreate): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(API_URL.pedidos.create, pedido);
  }

  search(params?: {
    cod_cliente?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    importe_min?: number;
    importe_max?: number;
  }): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.search(params));
  }

  getByDate(fecha: string): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.byDate(fecha));
  }

  getByNumber(num_pedido: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(API_URL.pedidos.byNumber(num_pedido));
  }

  getPending(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.pending);
  }

  getCompleted(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.completed);
  }

  getCancelled(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.cancelled);
  }

  getByCliente(cod_cliente: string): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.byCliente(cod_cliente));
  }

  getEstadisticas(params?: { fecha_inicio?: string; fecha_fin?: string }): Observable<PedidoEstadistica> {
    return this.http.get<PedidoEstadistica>(API_URL.pedidos.estadisticas(params));
  }

  update(num_pedido: number, pedido: PedidoUpdate): Observable<PedidoResponse> {
    return this.http.put<PedidoResponse>(API_URL.pedidos.update(num_pedido), pedido);
  }

  delete(num_pedido: number): Observable<void> {
    return this.http.delete<void>(API_URL.pedidos.delete(num_pedido));
  }

  cancel(num_pedido: number): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(API_URL.pedidos.cancel(num_pedido), {});
  }
}
