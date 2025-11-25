import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';

@Component({
  selector: 'app-orders-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-search.html',
  styleUrl: './orders-search.css',
})
export class OrdersSearch {
  private pedidosService = inject(PedidosService);

  pedidos = signal<PedidoResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Totales
  importeTotal = computed(() => this.pedidos().reduce((sum, p) => sum + (p.importe || 0), 0));

  // Filtros
  cod_cliente = signal('');
  fecha_inicio = signal('');
  fecha_fin = signal('');
  importe_min = signal<number | null>(null);
  importe_max = signal<number | null>(null);

  buscar() {
    this.loading.set(true);
    this.error.set(null);

    const params: any = {};
    if (this.cod_cliente()) params.cod_cliente = this.cod_cliente();
    if (this.fecha_inicio()) params.fecha_inicio = this.fecha_inicio();
    if (this.fecha_fin()) params.fecha_fin = this.fecha_fin();
    if (this.importe_min()) params.importe_min = this.importe_min();
    if (this.importe_max()) params.importe_max = this.importe_max();

    this.pedidosService.search(params).subscribe({
      next: (data) => {
        this.pedidos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al buscar pedidos');
        this.loading.set(false);
      }
    });
  }

  limpiar() {
    this.cod_cliente.set('');
    this.fecha_inicio.set('');
    this.fecha_fin.set('');
    this.importe_min.set(null);
    this.importe_max.set(null);
    this.pedidos.set([]);
  }
}
