import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-orders-bynumber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-bynumber.html',
  styleUrl: './orders-bynumber.css',
})
export class OrdersBynumber {
  private pedidosService = inject(PedidosService);
  private toastService = inject(ToastService);

  num_pedido = signal<number | null>(null);
  pedido = signal<PedidoResponse | null>(null);
  loading = signal(false);

  buscar() {
    if (!this.num_pedido()) {
      this.toastService.error('Ingresa un número de pedido');
      return;
    }

    this.loading.set(true);
    this.pedido.set(null);

    this.pedidosService.getByNumber(this.num_pedido()!).subscribe({
      next: (data) => {
        this.pedido.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Pedido no encontrado');
        this.loading.set(false);
      },
    });
  }

  limpiar() {
    this.num_pedido.set(null);
    this.pedido.set(null);
  }

  getEstadoLabel(estado: number): string {
    switch (estado) {
      case 1:
        return 'PENDIENTE';
      case 2:
        return 'COMPLETADO';
      case 3:
        return 'CANCELADO';
      default:
        return 'DESCONOCIDO';
    }
  }

  getEstadoStyles(estado: number) {
    switch (estado) {
      case 1:
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          border: 'border-amber-200',
        };
      case 2:
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200',
        };
      case 3:
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
        };
    }
  }
}
