import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { AuthService } from '@service/auth/auth.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-myorders-pending',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myorders-pending.html',
  styleUrl: './myorders-pending.css',
})
export class MyordersPending implements OnInit {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  // --- Estados (Signals) ---

  // Lista cruda que viene del servidor
  pedidosRaw = signal<PedidoResponse[]>([]);

  // Estado de carga de la lista inicial
  loadingList = signal(true);

  // Pedido actualmente seleccionado en el panel lateral
  pedidoSeleccionado = signal<PedidoResponse | null>(null);

  // Texto del buscador
  filtroTexto = signal('');

  // --- Computed Signals ---

  // Filtra la lista automáticamente cuando cambia 'pedidosRaw' o 'filtroTexto'
  pedidosPendientes = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    const lista = this.pedidosRaw();

    if (!texto) return lista;

    return lista.filter((p) => p.num_pedido.toString().includes(texto));
  });

  ngOnInit() {
    this.cargarPedidos();
  }

  // --- Métodos de Carga ---

  cargarPedidos() {
    const codCliente = this.authService.getCodCliente();
    if (!codCliente) {
      this.toastService.error('No se pudo identificar al cliente');
      return;
    }

    this.loadingList.set(true);
    this.pedidoSeleccionado.set(null); // Reseteamos la selección al recargar

    this.pedidosService.getByCliente(codCliente).subscribe({
      next: (data) => {
        // Filtramos solo los pendientes (estado 1)
        const pendientes = data.filter((p) => p.estado === 1);
        this.pedidosRaw.set(pendientes);
        this.loadingList.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingList.set(false);
        this.toastService.error('Error al cargar mis pedidos pendientes');
      },
    });
  }

  // --- Métodos de Interacción ---

  seleccionarPedido(pedido: PedidoResponse) {
    // Si se clickea el mismo, se deselecciona; si no, se selecciona el nuevo
    if (this.pedidoSeleccionado()?.num_pedido === pedido.num_pedido) {
      this.pedidoSeleccionado.set(null);
    } else {
      this.pedidoSeleccionado.set(pedido);
    }
  }
}
