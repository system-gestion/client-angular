import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ComisionDetalle,
  ComisionResponse
} from '@interface/admin/comisiones.interface';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {
  private http = inject(HttpClient);

  getComisionVendedor(
    cod_usuario: number,
    params?: { fecha_inicio?: string; fecha_fin?: string; porcentaje?: number }
  ): Observable<ComisionResponse> {
    return this.http.get<ComisionResponse>(API_URL.comisiones.vendedor(cod_usuario, params));
  }

  getDetallesVendedor(
    cod_usuario: number,
    params?: { fecha_inicio?: string; fecha_fin?: string; porcentaje?: number }
  ): Observable<ComisionDetalle[]> {
    return this.http.get<ComisionDetalle[]>(API_URL.comisiones.detallesVendedor(cod_usuario, params));
  }

  getResumen(params?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    porcentaje?: number;
  }): Observable<ComisionResponse[]> {
    return this.http.get<ComisionResponse[]>(API_URL.comisiones.resumen(params));
  }
}
