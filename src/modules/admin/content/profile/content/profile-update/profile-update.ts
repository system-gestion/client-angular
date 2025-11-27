import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { UsuariosService } from '@service/admin/usuarios.service';
import { ToastService } from '@service/toast.service';
import { MeResponse } from '@interface/auth/auth.interface';
import { UsuarioUpdate } from '@interface/admin/usuarios.interface';

@Component({
  selector: 'app-profile-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-update.html',
  styleUrl: './profile-update.css',
})
export class ProfileUpdate implements OnInit {
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);
  showPasswordFields = signal(false);

  // Formulario
  cod_usuario = signal(0);
  apellidos = signal('');
  nombres = signal('');
  correo = signal('');
  celular = signal('');
  nivel = signal(0);
  password = signal('');
  confirmPassword = signal('');

  ngOnInit() {
    // Obtener solo el ID del usuario desde localStorage
    const currentUser = this.authService.user();
    if (currentUser?.cod_usuario) {
      this.loading.set(true);
      // Hacer consulta al servidor para obtener datos actualizados
      this.authService.getCurrentUser(currentUser.cod_usuario).subscribe({
        next: (userData) => {
          this.cod_usuario.set(userData.cod_usuario);
          this.apellidos.set(userData.apellidos);
          this.nombres.set(userData.nombres);
          this.correo.set(userData.correo);
          this.celular.set(userData.celular || '');
          this.nivel.set(userData.nivel);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
          // Fallback a datos del localStorage si falla la consulta
          this.cod_usuario.set(currentUser.cod_usuario);
          this.apellidos.set(currentUser.apellidos);
          this.nombres.set(currentUser.nombres);
          this.correo.set(currentUser.correo);
          this.celular.set(currentUser.celular || '');
          this.nivel.set(currentUser.nivel);
          this.loading.set(false);
        },
      });
    }
  }

  togglePasswordFields() {
    this.showPasswordFields.update((v) => !v);
    if (!this.showPasswordFields()) {
      this.password.set('');
      this.confirmPassword.set('');
    }
  }

  actualizar() {
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
    };

    if (this.showPasswordFields() && this.password()) {
      updateData.password = this.password();
    }

    this.usuariosService.update(this.cod_usuario(), updateData).subscribe({
      next: (response) => {
        // Actualizar usuario en AuthService
        this.authService.getCurrentUser(this.cod_usuario()).subscribe({
          next: () => {
            this.loading.set(false);
            this.showPasswordFields.set(false);
            this.password.set('');
            this.confirmPassword.set('');

            this.toastService.success('Perfil actualizado exitosamente');

            // Redirigir después de 1 segundo
            setTimeout(() => {
              this.router.navigate(['/admin/profile/data']);
            }, 1000);
          },
          error: () => {
            this.loading.set(false);
            this.toastService.success('Perfil actualizado exitosamente');

            setTimeout(() => {
              this.router.navigate(['/admin/profile/data']);
            }, 1000);
          },
        });
      },
      error: (err) => {
        this.toastService.error(err.error?.detail || 'Error al actualizar el perfil');
        this.loading.set(false);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/admin/profile/data']);
  }
}
