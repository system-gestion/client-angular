import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '@service/admin/usuarios.service';
import { ToastService } from '@service/toast.service';
import { UsuarioResponse } from '@interface/admin/usuarios.interface';

@Component({
  selector: 'app-users-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-profile.html',
  styleUrl: './users-profile.css',
})
export class UsersProfile {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);

  searchId = signal<number | null>(null);
  user = signal<UsuarioResponse | null>(null);
  loading = signal(false);

  buscar() {
    if (!this.searchId()) {
      this.toastService.warning('Ingrese un código de usuario');
      return;
    }

    this.loading.set(true);
    this.user.set(null);

    this.usuariosService.get(this.searchId()!).subscribe({
      next: (data) => {
        this.user.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error('Usuario no encontrado');
      },
    });
  }

  limpiar() {
    this.searchId.set(null);
    this.user.set(null);
  }

  getNivelText(nivel: number): string {
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

  getEstadoText(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }
}
