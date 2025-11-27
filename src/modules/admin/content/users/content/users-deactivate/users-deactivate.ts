import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '@service/admin/usuarios.service';
import { UsuarioResponse } from '@interface/admin/usuarios.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';

@Component({
  selector: 'app-users-deactivate',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-deactivate.html',
  styleUrl: './users-deactivate.css',
})
export class UsersDeactivate {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

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

  desactivar() {
    if (!this.user()) return;

    const user = this.user()!;

    if (user.estado === 0) {
      this.toastService.info('El usuario ya se encuentra inactivo');
      return;
    }

    this.alertService.delete(
      'Dar de Baja',
      `¿Estás seguro de que quieres dar de baja al usuario ${user.nombres} ${user.apellidos}?`,
      () => {
        this.loading.set(true);
        this.usuariosService.deactivate(user.cod_usuario).subscribe({
          next: () => {
            this.toastService.success('Usuario dado de baja exitosamente');
            // Refresh user data
            this.usuariosService.get(user.cod_usuario).subscribe((updatedUser) => {
              this.user.set(updatedUser);
              this.loading.set(false);
            });
          },
          error: (err) => {
            this.loading.set(false);
            this.toastService.error('Error al dar de baja al usuario');
          },
        });
      }
    );
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
