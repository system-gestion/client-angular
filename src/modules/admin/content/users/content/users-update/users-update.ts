import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '@service/admin/usuarios.service';
import { ToastService } from '@service/toast.service';
import { UsuarioResponse, UsuarioUpdate } from '@interface/admin/usuarios.interface';
import { buildPath, PATH } from '@route/path.route';

@Component({
  selector: 'app-users-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-update.html',
  styleUrl: './users-update.css',
})
export class UsersUpdate {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Search
  searchId = signal<number | null>(null);
  user = signal<UsuarioResponse | null>(null);
  loading = signal(false);

  // Form
  showPasswordFields = signal(false);
  apellidos = signal('');
  nombres = signal('');
  correo = signal('');
  celular = signal('');
  nivel = signal(2);
  estado = signal(1);
  password = signal('');
  confirmPassword = signal('');

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
        this.populateForm(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error('Usuario no encontrado');
      },
    });
  }

  populateForm(data: UsuarioResponse) {
    this.apellidos.set(data.apellidos);
    this.nombres.set(data.nombres);
    this.correo.set(data.correo);
    this.celular.set(data.celular || '');
    this.nivel.set(data.nivel);
    this.estado.set(data.estado);
    this.showPasswordFields.set(false);
    this.password.set('');
    this.confirmPassword.set('');
  }

  togglePasswordFields() {
    this.showPasswordFields.update((v) => !v);
    if (!this.showPasswordFields()) {
      this.password.set('');
      this.confirmPassword.set('');
    }
  }

  actualizar() {
    if (!this.user()) return;

    // Validaciones
    if (!this.apellidos() || !this.nombres() || !this.correo()) {
      this.toastService.warning('Apellidos, nombres y correo son obligatorios');
      return;
    }

    if (this.showPasswordFields()) {
      if (!this.password() || !this.confirmPassword()) {
        this.toastService.warning('Debe completar ambos campos de contraseña');
        return;
      }
      if (this.password() !== this.confirmPassword()) {
        this.toastService.error('Las contraseñas no coinciden');
        return;
      }
      if (this.password().length < 6) {
        this.toastService.warning('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    this.loading.set(true);

    const updateData: UsuarioUpdate = {
      apellidos: this.apellidos(),
      nombres: this.nombres(),
      correo: this.correo(),
      celular: this.celular() || undefined,
      nivel: this.nivel(),
      estado: this.estado(),
    };

    if (this.showPasswordFields() && this.password()) {
      updateData.password = this.password();
    }

    this.usuariosService.update(this.user()!.cod_usuario, updateData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toastService.success('Usuario actualizado exitosamente');
        this.user.set(response); // Update local user data
        this.populateForm(response); // Refresh form
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error(err.error?.detail || 'Error al actualizar el usuario');
      },
    });
  }

  limpiar() {
    this.searchId.set(null);
    this.user.set(null);
    this.apellidos.set('');
    this.nombres.set('');
    this.correo.set('');
    this.celular.set('');
    this.nivel.set(2);
    this.estado.set(1);
    this.password.set('');
    this.confirmPassword.set('');
    this.showPasswordFields.set(false);
  }

  cancelar() {
    this.router.navigate(['/' + buildPath(PATH.admin.users.search)]);
  }
}
