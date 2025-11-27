import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OfertasService } from '@service/admin/ofertas.service';
import { ArticulosService } from '@service/admin/articulos.service';
import { ToastService } from '@service/toast.service';
import { ArticuloResponse } from '@interface/admin/articulos.interface';
import { buildPath, PATH } from '@route/path.route';

@Component({
  selector: 'app-offers-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers-new.html',
  styleUrl: './offers-new.css',
})
export class OffersNew implements OnInit {
  private ofertasService = inject(OfertasService);
  private articulosService = inject(ArticulosService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);
  loadingArticulos = signal(false);

  // Form Data
  cod_articulo = signal<number | null>(null);
  tipo_descuento = signal<number>(1); // 1=Fijo, 2=Porcentual
  valor_descuento = signal<number>(0);

  // Search Data
  searchArticulo = signal('');
  articulos = signal<ArticuloResponse[]>([]);

  // Selected Data
  articuloSeleccionado = signal<ArticuloResponse | null>(null);

  ngOnInit() {}

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
        if (data.length === 0) this.toastService.info('No se encontraron artículos');
      },
      error: () => {
        this.toastService.error('Error al buscar artículos');
        this.loadingArticulos.set(false);
      },
    });
  }

  seleccionarArticulo(articulo: ArticuloResponse) {
    this.cod_articulo.set(articulo.cod_articulo);
    this.articuloSeleccionado.set(articulo);
    this.searchArticulo.set('');
    this.articulos.set([]);

    // Si el artículo ya tiene descuento, pre-llenar los campos
    if (articulo.tipo_descuento && articulo.tipo_descuento > 0) {
      this.tipo_descuento.set(articulo.tipo_descuento);
      this.valor_descuento.set(articulo.valor_descuento || 0);
      this.toastService.info('Este artículo ya tiene una oferta activa. Se actualizará.');
    } else {
      this.tipo_descuento.set(1);
      this.valor_descuento.set(0);
    }
  }

  guardar() {
    if (!this.cod_articulo()) {
      this.toastService.warning('Seleccione un artículo');
      return;
    }
    if (this.valor_descuento() <= 0) {
      this.toastService.warning('El valor del descuento debe ser mayor a 0');
      return;
    }
    if (this.tipo_descuento() === 2 && this.valor_descuento() > 100) {
      this.toastService.warning('El porcentaje no puede ser mayor a 100');
      return;
    }

    this.loading.set(true);

    this.ofertasService
      .agregarOferta(this.cod_articulo()!, this.tipo_descuento(), this.valor_descuento())
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toastService.success('Oferta guardada exitosamente');
          this.router.navigate(['/' + buildPath(PATH.admin.offers.active)]);
        },
        error: (err) => {
          this.loading.set(false);
          this.toastService.error('Error al guardar la oferta');
        },
      });
  }

  limpiar() {
    this.cod_articulo.set(null);
    this.articuloSeleccionado.set(null);
    this.valor_descuento.set(0);
    this.tipo_descuento.set(1);
  }
}
