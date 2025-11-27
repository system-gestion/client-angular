import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { ArticuloResponse, ArticuloUpdate } from '@interface/admin/articulos.interface';

@Injectable({
  providedIn: 'root',
})
export class OfertasService {
  private http = inject(HttpClient);

  getOfertasActivas(): Observable<ArticuloResponse[]> {
    return this.http.get<ArticuloResponse[]>(API_URL.ofertas.list);
  }

  agregarOferta(
    cod_articulo: number,
    tipo_descuento: number,
    valor_descuento: number
  ): Observable<ArticuloResponse> {
    const payload = {
      cod_articulo,
      tipo_descuento,
      valor_descuento,
    };
    return this.http.post<ArticuloResponse>(API_URL.ofertas.create, payload);
  }

  desactivarOferta(cod_articulo: number): Observable<any> {
    return this.http.delete(API_URL.ofertas.delete(cod_articulo));
  }
}
