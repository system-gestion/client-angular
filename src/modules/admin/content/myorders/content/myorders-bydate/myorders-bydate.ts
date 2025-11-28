import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { AuthService } from '@service/auth/auth.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-myorders-bydate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myorders-bydate.html',
  styleUrl: './myorders-bydate.css',
})
export class MyordersBydate {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  fecha = signal('');
  pedidos = signal<PedidoResponse[]>([]);
  loading = signal(false);

  buscar() {
    if (!this.fecha()) {
      this.toastService.error('Selecciona una fecha');
      return;
    }

    const codCliente = this.authService.getCodCliente();
    if (!codCliente) {
      this.toastService.error('No se pudo identificar al cliente');
      return;
    }

    this.loading.set(true);
    this.pedidos.set([]);

    // Usamos search para filtrar por fecha y cliente
    this.pedidosService
      .search({
        fecha_inicio: this.fecha(),
        fecha_fin: this.fecha(),
        cod_cliente: codCliente,
      })
      .subscribe({
        next: (data) => {
          this.pedidos.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.toastService.error('Error al buscar mis pedidos');
          this.loading.set(false);
        },
      });
  }

  limpiar() {
    this.fecha.set('');
    this.pedidos.set([]);
  }
}
