import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-orders-bydate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-bydate.html',
  styleUrl: './orders-bydate.css',
})
export class OrdersBydate {
  private pedidosService = inject(PedidosService);
  private toastService = inject(ToastService);

  fecha = signal('');
  pedidos = signal<PedidoResponse[]>([]);
  loading = signal(false);

  buscar() {
    if (!this.fecha()) {
      this.toastService.error('Selecciona una fecha');
      return;
    }

    this.loading.set(true);
    this.pedidos.set([]);

    this.pedidosService.getByDate(this.fecha()).subscribe({
      next: (data) => {
        this.pedidos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Error al buscar pedidos');
        this.loading.set(false);
      }
    });
  }

  limpiar() {
    this.fecha.set('');
    this.pedidos.set([]);
  }
}
