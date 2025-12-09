import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticulosService } from '@service/admin/articulos.service';
import { ArticuloResponse } from '@interface/admin/articulos.interface';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private articulosService = inject(ArticulosService);

  articulos = signal<ArticuloResponse[]>([]);
  articulosFiltrados = signal<ArticuloResponse[]>([]);
  loading = signal<boolean>(true);
  searchTerm = signal<string>('');
  ofertaFilter = signal<string>('all'); // 'all', 'con-oferta', 'sin-oferta'

  ngOnInit(): void {
    this.loadArticulos();
  }

  loadArticulos(): void {
    this.loading.set(true);
    this.articulosService.list().subscribe({
      next: (data) => {
        this.articulos.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar artículos:', err);
        this.loading.set(false);
      },
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.applyFilters();
  }

  onOfertaFilterChange(filter: string): void {
    this.ofertaFilter.set(filter);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.articulos()];

    // Filtro por búsqueda
    const term = this.searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter((art) =>
        art.nombre.toLowerCase().includes(term) ||
        art.cod_articulo.toString().includes(term)
      );
    }

    // Filtro por oferta
    const ofertaFilter = this.ofertaFilter();
    if (ofertaFilter === 'con-oferta') {
      filtered = filtered.filter((art) => this.hasDescuento(art));
    } else if (ofertaFilter === 'sin-oferta') {
      filtered = filtered.filter((art) => !this.hasDescuento(art));
    }

    this.articulosFiltrados.set(filtered);
  }

  calculatePrecioFinal(articulo: ArticuloResponse): number {
    if (articulo.tipo_descuento === 1) {
      // Descuento fijo
      return articulo.pvp - (articulo.valor_descuento || 0);
    } else if (articulo.tipo_descuento === 2) {
      // Descuento porcentual
      return articulo.pvp * (1 - (articulo.valor_descuento || 0) / 100);
    }
    return articulo.pvp;
  }

  hasDescuento(articulo: ArticuloResponse): boolean {
    return (articulo.tipo_descuento || 0) > 0 && (articulo.valor_descuento || 0) > 0;
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'text-red-600';
    if (stock <= 10) return 'text-orange-600';
    return 'text-green-600';
  }

  getStockText(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock <= 10) return 'Stock bajo';
    return 'Disponible';
  }
}
