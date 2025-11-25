import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ClienteResponse,
  ClienteCreate,
  ClienteUpdate
} from '@interface/admin/clientes.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private http = inject(HttpClient);

  list(params?: { skip?: number; limit?: number }): Observable<ClienteResponse[]> {
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
}
