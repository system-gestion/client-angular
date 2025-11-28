import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { AuthService } from '@service/auth/auth.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-myorders-bynumber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myorders-bynumber.html',
  styleUrl: './myorders-bynumber.css',
})
export class MyordersBynumber {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  num_pedido = signal<number | null>(null);
  pedido = signal<PedidoResponse | null>(null);
  loading = signal(false);

  buscar() {
    if (!this.num_pedido()) {
      this.toastService.error('Ingresa un número de pedido');
      return;
    }

    const codCliente = this.authService.getCodCliente();
    if (!codCliente) {
      this.toastService.error('No se pudo identificar al cliente');
      return;
    }

    this.loading.set(true);
    this.pedido.set(null);

    this.pedidosService.getByNumber(this.num_pedido()!).subscribe({
      next: (data) => {
        // Validar que el pedido pertenezca al cliente
        if (data.cod_cliente !== codCliente) {
          this.toastService.error('Pedido no encontrado'); // Mensaje genérico por seguridad
          this.loading.set(false);
          return;
        }
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
