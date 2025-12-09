import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { AuthService } from '@service/auth/auth.service';
import {
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
  private authService = inject(AuthService);

  list(params?: { skip?: number; limit?: number, cod_vendedor?: number }): Observable<PedidoResponse[]> {
    const user = this.authService.user();
    const finalParams = { ...params };

    if (user?.nivel === 2) {
      finalParams.cod_vendedor = user.cod_usuario;
    }

    return this.http.get<PedidoResponse[]>(API_URL.pedidos.list(finalParams));
  }

  create(pedido: PedidoCreate): Observable<PedidoResponse> {
    const user = this.authService.user();

    if (user?.nivel === 2) {
      pedido = { ...pedido, cod_vendedor: user.cod_usuario };
    }

    return this.http.post<PedidoResponse>(API_URL.pedidos.create, pedido);
  }

  search(params?: {
    cod_cliente?: string;
    cod_vendedor?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    importe_min?: number;
    importe_max?: number;
  }): Observable<PedidoResponse[]> {
    const user = this.authService.user();
    const finalParams = { ...params };

    if (user?.nivel === 2) {
      finalParams.cod_vendedor = user.cod_usuario;
    }

    return this.http.get<PedidoResponse[]>(API_URL.pedidos.search(finalParams));
  }

  getByDate(fecha: string): Observable<PedidoResponse[]> {
    const user = this.authService.user();
    const cod_vendedor = user?.nivel === 2 ? user.cod_usuario : undefined;

    return this.http.get<PedidoResponse[]>(API_URL.pedidos.byDate(fecha, cod_vendedor));
  }

  getByNumber(num_pedido: number): Observable<PedidoResponse> {
    const user = this.authService.user();
    const cod_vendedor = user?.nivel === 2 ? user.cod_usuario : undefined;
    return this.http.get<PedidoResponse>(API_URL.pedidos.byNumber(num_pedido, cod_vendedor));
  }

  getPending(): Observable<PedidoResponse[]> {
    const user = this.authService.user();
    const cod_vendedor = user?.nivel === 2 ? user.cod_usuario : undefined;
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.pending(cod_vendedor));
  }

  getCompleted(): Observable<PedidoResponse[]> {
    const user = this.authService.user();
    const cod_vendedor = user?.nivel === 2 ? user.cod_usuario : undefined;
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.completed(cod_vendedor));
  }

  getCancelled(): Observable<PedidoResponse[]> {
    const user = this.authService.user();
    const cod_vendedor = user?.nivel === 2 ? user.cod_usuario : undefined;
    return this.http.get<PedidoResponse[]>(API_URL.pedidos.cancelled(cod_vendedor));
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
