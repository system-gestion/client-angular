import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-orders-completed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-completed.html',
  styleUrl: './orders-completed.css',
})
export class OrdersCompleted implements OnInit {
  private pedidosService = inject(PedidosService);
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
  pedidosCompletados = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    const lista = this.pedidosRaw();

    if (!texto) return lista;

    return lista.filter(p =>
      p.nombre_cliente?.toLowerCase().includes(texto) ||
      p.num_pedido.toString().includes(texto)
    );
  });

  ngOnInit() {
    this.cargarPedidos();
  }

  // --- Métodos de Carga ---

  cargarPedidos() {
    this.loadingList.set(true);
    this.pedidoSeleccionado.set(null); // Reseteamos la selección al recargar

    this.pedidosService.getCompleted().subscribe({
      next: (data) => {
        this.pedidosRaw.set(data);
        this.loadingList.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingList.set(false);
        this.toastService.error('Error al cargar pedidos completados');
      }
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
