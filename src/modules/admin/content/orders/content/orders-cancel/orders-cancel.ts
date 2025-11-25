import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';

@Component({
  selector: 'app-orders-cancel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-cancel.html',
  styleUrl: './orders-cancel.css',
})
export class OrdersCancel {
  private pedidosService = inject(PedidosService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

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

  cancelar() {
    if (!this.pedido()) {
      this.toastService.error('Primero busca un pedido');
      return;
    }

    const pedido = this.pedido()!;

    // Validar si el pedido ya está cancelado
    if (pedido.estado === 3) {
      this.alertService.error(
        'Pedido ya cancelado',
        `El pedido #${pedido.num_pedido} ya ha sido cancelado anteriormente. No se puede cancelar nuevamente.`,
        [
          {
            text: 'Entendido',
            style: 'primary',
            action: () => this.alertService.close(),
          },
        ]
      );
      return;
    }

    // Validar si el pedido ya está completado
    if (pedido.estado === 2) {
      this.alertService.error(
        'Pedido ya completado',
        `El pedido #${pedido.num_pedido} ya ha sido completado y entregado. No se puede cancelar un pedido completado.`,
        [
          {
            text: 'Entendido',
            style: 'primary',
            action: () => this.alertService.close(),
          },
        ]
      );
      return;
    }

    // Si el pedido está pendiente, mostrar confirmación
    this.alertService.delete(
      'Cancelar Pedido',
      `¿Estás seguro de que quieres cancelar el pedido #${pedido.num_pedido}? Esta acción no se puede deshacer.`,
      () => {
        // Confirmar cancelación
        this.loading.set(true);
        this.pedidosService.cancel(pedido.num_pedido).subscribe({
          next: () => {
            this.toastService.success('Pedido cancelado exitosamente');
            this.pedido.set(null);
            this.num_pedido.set(null);
            this.loading.set(false);
          },
          error: (err) => {
            this.toastService.error('Error al cancelar el pedido');
            this.loading.set(false);
          },
        });
      }
    );
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

  limpiar() {
    this.num_pedido.set(null);
    this.pedido.set(null);
  }
}
