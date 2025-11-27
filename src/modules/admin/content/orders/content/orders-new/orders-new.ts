import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidosService } from '@service/admin/pedidos.service';
import { ClientesService } from '@service/admin/clientes.service';
import { ArticulosService } from '@service/admin/articulos.service';
import { ToastService } from '@service/toast.service';
import { PedidoCreate, DetallePedidoCreate } from '@interface/admin/pedidos.interface';
import { ClienteResponse } from '@interface/admin/clientes.interface';
import { ArticuloResponse } from '@interface/admin/articulos.interface';
import { buildPath, PATH } from '@route/path.route';

interface DetalleTemp extends DetallePedidoCreate {
  nombre_articulo?: string;
  pvp?: number;
}

@Component({
  selector: 'app-orders-new',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-new.html',
  styleUrl: './orders-new.css',
})
export class OrdersNew {
  private pedidosService = inject(PedidosService);
  private clientesService = inject(ClientesService);
  private articulosService = inject(ArticulosService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);
  loadingClientes = signal(false);
  loadingArticulos = signal(false);

  // Datos del formulario
  fecha = signal('');
  cod_cliente = signal('');
  searchCliente = signal('');

  // Artículo temporal para agregar
  cod_articulo_temp = signal<number | null>(null);
  cantidad_temp = signal<number>(1);
  searchArticulo = signal('');

  // Listas
  clientes = signal<ClienteResponse[]>([]);
  articulos = signal<ArticuloResponse[]>([]);
  detalles = signal<DetalleTemp[]>([]);

  // Cliente seleccionado
  clienteSeleccionado = signal<ClienteResponse | null>(null);

  // Artículo seleccionado para agregar (se puede almacenar explícitamente para no depender
  // exclusivamente de la lista de resultados, que se limpia tras seleccionar)
  articuloSeleccionadoSignal = signal<ArticuloResponse | null>(null);

  articuloSeleccionado = computed(() => {
    const cod = this.cod_articulo_temp();
    const found = this.articulos().find((a) => a.cod_articulo === cod);
    // Si no está en la lista actual (por ejemplo, después de limpiar resultados),
    // devolvemos el artículo guardado en la señal temporal.
    return found ?? this.articuloSeleccionadoSignal();
  });

  // Importe total
  importeTotal = computed(() => {
    return this.detalles().reduce((sum, d) => sum + d.subtotal, 0);
  });

  ngOnInit() {
    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    this.fecha.set(today);
  }

  buscarClientes() {
    const q = this.searchCliente().trim();
    if (q.length < 2) {
      this.toastService.warning('Ingrese al menos 2 caracteres');
      return;
    }

    this.loadingClientes.set(true);
    this.clientesService.search(q).subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loadingClientes.set(false);
        if (data.length === 0) {
          this.toastService.info('No se encontraron clientes');
        }
      },
      error: () => {
        this.toastService.error('Error al buscar clientes');
        this.loadingClientes.set(false);
      },
    });
  }

  seleccionarCliente(cliente: ClienteResponse) {
    this.cod_cliente.set(cliente.cod_cliente);
    this.clienteSeleccionado.set(cliente);
    this.searchCliente.set('');
    this.clientes.set([]);
  }

  buscarArticulos() {
    const q = this.searchArticulo().trim();
    if (q.length < 2) {
      this.toastService.warning('Ingrese al menos 2 caracteres');
      return;
    }

    this.loadingArticulos.set(true);
    this.articulosService.search(q).subscribe({
      next: (data) => {
        this.articulos.set(data);
        this.loadingArticulos.set(false);
        if (data.length === 0) {
          this.toastService.info('No se encontraron artículos');
        }
      },
      error: () => {
        this.toastService.error('Error al buscar artículos');
        this.loadingArticulos.set(false);
      },
    });
  }

  seleccionarArticulo(articulo: ArticuloResponse) {
    this.cod_articulo_temp.set(articulo.cod_articulo);
    // Guardar el artículo seleccionado explícitamente para que la vista previa
    // siga mostrándolo aunque limpiemos la lista de resultados (articulos.set([])).
    this.articuloSeleccionadoSignal.set(articulo);
    this.searchArticulo.set('');
    // Establecer cantidad por defecto en 1 al seleccionar
    this.cantidad_temp.set(1);
    // Don't clear `articulos` list so users can select multiple items from search results
    // and add them to the order without needing to re-search.
  }

  agregarDetalle() {
    const articulo = this.articuloSeleccionado();
    const cantidad = this.cantidad_temp();

    if (!articulo) {
      this.toastService.warning('Seleccione un artículo');
      return;
    }

    if (cantidad <= 0) {
      this.toastService.warning('La cantidad debe ser mayor a 0');
      return;
    }

    if (cantidad > articulo.stock) {
      this.toastService.warning(`Stock insuficiente. Disponible: ${articulo.stock}`);
      return;
    }

    // Verificar si ya existe
    const existe = this.detalles().find((d) => d.cod_articulo === articulo.cod_articulo);
    if (existe) {
      this.toastService.warning('El artículo ya está en el pedido');
      return;
    }

    let precioFinal = articulo.pvp;

    // Aplicar descuento si existe
    if (articulo.tipo_descuento && articulo.tipo_descuento > 0) {
      if (articulo.tipo_descuento === 1) {
        // Descuento fijo
        precioFinal = articulo.pvp - (articulo.valor_descuento || 0);
      } else if (articulo.tipo_descuento === 2) {
        // Descuento porcentual
        precioFinal = articulo.pvp * (1 - (articulo.valor_descuento || 0) / 100);
      }
      // Asegurar que no sea negativo
      precioFinal = Math.max(0, precioFinal);
    }

    const subtotal = precioFinal * cantidad;
    const nuevoDetalle: DetalleTemp = {
      cod_articulo: articulo.cod_articulo,
      cantidad,
      subtotal,
      estado: 1,
      nombre_articulo: articulo.nombre,
      pvp: articulo.pvp, // Guardamos el PVP original
    };

    this.detalles.update((d) => [...d, nuevoDetalle]);

    // Limpiar selección
    this.clearArticuloSelection();
    this.cantidad_temp.set(1);
    this.toastService.success('Artículo agregado');
  }

  isArticuloAdded(cod_articulo: number) {
    return !!this.detalles().find((d) => d.cod_articulo === cod_articulo);
  }

  clearArticuloSelection() {
    this.cod_articulo_temp.set(null);
    this.articuloSeleccionadoSignal.set(null);
    this.cantidad_temp.set(1);
    this.searchArticulo.set('');
  }

  eliminarDetalle(cod_articulo: number) {
    this.detalles.update((d) => d.filter((item) => item.cod_articulo !== cod_articulo));
    this.toastService.info('Artículo eliminado');
  }

  guardar() {
    // Validaciones
    if (!this.cod_cliente()) {
      this.toastService.warning('Seleccione un cliente');
      return;
    }

    if (this.detalles().length === 0) {
      this.toastService.warning('Agregue al menos un artículo');
      return;
    }

    this.loading.set(true);

    const pedido: PedidoCreate = {
      fecha: this.fecha(),
      importe: this.importeTotal(),
      cod_cliente: this.cod_cliente(),
      detalles: this.detalles().map((d) => ({
        cod_articulo: d.cod_articulo,
        cantidad: d.cantidad,
        subtotal: d.subtotal,
        estado: d.estado,
      })),
    };

    this.pedidosService.create(pedido).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Pedido creado exitosamente');
        this.router.navigate(['/' + buildPath(PATH.admin.orders.search)]);
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.error?.detail || 'Error al crear el pedido';
        this.toastService.error(errorMsg);
      },
    });
  }

  limpiar() {
    this.cod_cliente.set('');
    this.clienteSeleccionado.set(null);
    this.detalles.set([]);
    this.clearArticuloSelection();
    this.cantidad_temp.set(1);
    const today = new Date().toISOString().split('T')[0];
    this.fecha.set(today);
  }
}
