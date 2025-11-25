import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ArticuloResponse,
  ArticuloCreate,
  ArticuloUpdate,
  OfertaResponse,
  MessageResponse
} from '@interface/admin/articulos.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {
  private http = inject(HttpClient);

  list(params?: { skip?: number; limit?: number; stock_min?: number }): Observable<ArticuloResponse[]> {
    return this.http.get<ArticuloResponse[]>(API_URL.articulos.list(params));
  }

  create(articulo: ArticuloCreate): Observable<ArticuloResponse> {
    return this.http.post<ArticuloResponse>(API_URL.articulos.create, articulo);
  }

  getOfertas(): Observable<OfertaResponse[]> {
    return this.http.get<OfertaResponse[]>(API_URL.articulos.ofertas);
  }

  search(q: string): Observable<ArticuloResponse[]> {
    return this.http.get<ArticuloResponse[]>(API_URL.articulos.search(q));
  }

  get(cod_articulo: number): Observable<ArticuloResponse> {
    return this.http.get<ArticuloResponse>(API_URL.articulos.get(cod_articulo));
  }

  update(cod_articulo: number, articulo: ArticuloUpdate): Observable<ArticuloResponse> {
    return this.http.put<ArticuloResponse>(API_URL.articulos.update(cod_articulo), articulo);
  }

  delete(cod_articulo: number): Observable<void> {
    return this.http.delete<void>(API_URL.articulos.delete(cod_articulo));
  }

  updateStock(cod_articulo: number, cantidad: number): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(API_URL.articulos.updateStock(cod_articulo, cantidad), {});
  }
}
