import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '@service/admin/pedidos.service';
import { PedidoResponse } from '@interface/admin/pedidos.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-orders-pending',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-pending.html',
  styleUrl: './orders-pending.css',
})
export class OrdersPending implements OnInit {
  private pedidosService = inject(PedidosService);
  private toastService = inject(ToastService);

  // --- Estados (Signals) ---

  // Lista cruda que viene del servidor
  pedidosRaw = signal<PedidoResponse[]>([]);

  // Estado de carga de la lista inicial
  loadingList = signal(true);

  // Estado de carga al atender un pedido
  loadingAtender = signal(false);

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

    this.pedidosService.getPending().subscribe({
      next: (data) => {
        this.pedidosRaw.set(data);
        this.loadingList.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingList.set(false);
        this.toastService.error('Error al cargar pedidos pendientes');
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

  atenderPedido() {
    const pedido = this.pedidoSeleccionado();
    if (!pedido) return;

    this.loadingAtender.set(true);

    this.pedidosService.update(pedido.num_pedido, { estado: 2 }).subscribe({
      next: () => {
        this.loadingAtender.set(false);
        this.toastService.success(`Pedido #${pedido.num_pedido} atendido correctamente`);
        this.pedidoSeleccionado.set(null);
        this.cargarPedidos();
      },
      error: (err) => {
        console.error(err);
        this.loadingAtender.set(false);
        this.toastService.error('Error al atender el pedido');
      }
    });
  }
}
