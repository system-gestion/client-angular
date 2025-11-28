import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '@service/admin/usuarios.service';
import { UsuarioResponse } from '@interface/admin/usuarios.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-users-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-search.html',
  styleUrl: './users-search.css',
})
export class UsersSearch {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);

  usuarios = signal<UsuarioResponse[]>([]);
  loading = signal(false);

  // Filters
  q = signal('');
  nivel = signal<number | null>(null);
  estado = signal<number | null>(null);

  buscar() {
    this.loading.set(true);

    const params: any = {};
    if (this.q()) params.q = this.q();
    if (this.nivel()) params.nivel = this.nivel();
    if (this.estado() !== null) params.estado = this.estado();

    this.usuariosService.list(params).subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
        if (data.length === 0) {
          this.toastService.info('No se encontraron usuarios con los filtros seleccionados');
        }
      },
      error: (err) => {
        this.toastService.error('Error al buscar usuarios');
        this.loading.set(false);
      },
    });
  }

  limpiar() {
    this.q.set('');
    this.nivel.set(null);
    this.estado.set(null);
    this.usuarios.set([]);
  }

  getNivelLabel(nivel: number): string {
    switch (nivel) {
      case 1:
        return 'Supervisor';
      case 2:
        return 'Vendedor';
      case 3:
        return 'Cliente';
      default:
        return 'Desconocido';
    }
  }

  getEstadoLabel(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }
}
