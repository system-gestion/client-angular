import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '@service/admin/clientes.service';
import { ClienteResponse } from '@interface/admin/clientes.interface';

@Component({
  selector: 'app-clients-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-search.html',
  styleUrl: './clients-search.css',
})
export class ClientsSearch {
  private clientesService = inject(ClientesService);

  clientes = signal<ClienteResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filters
  q = signal('');
  estado = signal<number | null>(null);

  buscar() {
    this.loading.set(true);
    this.error.set(null);

    const params: any = {};
    if (this.q()) params.q = this.q();
    if (this.estado() !== null) params.estado = this.estado();

    this.clientesService.list(params).subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al buscar clientes');
        this.loading.set(false);
      },
    });
  }

  limpiar() {
    this.q.set('');
    this.estado.set(null);
    this.clientes.set([]);
  }

  getEstadoLabel(estado: number | undefined): string {
    if (estado === undefined || estado === null) return '-';
    return estado === 1 ? 'Activo' : 'Inactivo';
  }
}
