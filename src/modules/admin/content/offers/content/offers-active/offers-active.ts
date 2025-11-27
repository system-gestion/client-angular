import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertasService } from '@service/admin/ofertas.service';
import { ArticuloResponse } from '@interface/admin/articulos.interface';
import { ToastService } from '@service/toast.service';
import { AuthService } from '@service/auth/auth.service';

@Component({
  selector: 'app-offers-active',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers-active.html',
  styleUrl: './offers-active.css',
})
export class OffersActive implements OnInit {
  private ofertasService = inject(OfertasService);
  private toastService = inject(ToastService);

  private authService = inject(AuthService);

  // --- Estados (Signals) ---
  ofertasRaw = signal<ArticuloResponse[]>([]);
  loadingList = signal(true);
  ofertaSeleccionada = signal<ArticuloResponse | null>(null);
  filtroTexto = signal('');

  // --- Computed Signals ---
  ofertasActivas = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    const lista = this.ofertasRaw();

    if (!texto) return lista;

    return lista.filter(
      (o) => o.nombre.toLowerCase().includes(texto) || o.cod_articulo.toString().includes(texto)
    );
  });

  ngOnInit() {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.loadingList.set(true);
    this.ofertaSeleccionada.set(null);

    // Obtener ofertas activas (artículos con descuento)
    this.ofertasService.getOfertasActivas().subscribe({
      next: (data) => {
        this.ofertasRaw.set(data);
        this.loadingList.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingList.set(false);
        this.toastService.error('Error al cargar ofertas activas');
      },
    });
  }

  seleccionarOferta(oferta: ArticuloResponse) {
    if (this.ofertaSeleccionada()?.cod_articulo === oferta.cod_articulo) {
      this.ofertaSeleccionada.set(null);
    } else {
      this.ofertaSeleccionada.set(oferta);
    }
  }

  getTipoDescuentoLabel(tipo: number): string {
    return tipo === 1 ? 'Fijo' : 'Porcentual';
  }
}
