import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '@service/admin/usuarios.service';
import { ToastService } from '@service/toast.service';
import { UsuarioCreate } from '@interface/admin/usuarios.interface';
import { buildPath, PATH } from '@route/path.route';

@Component({
  selector: 'app-users-new',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-new.html',
  styleUrl: './users-new.css',
})
export class UsersNew {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);

  // Form data
  nombres = signal('');
  apellidos = signal('');
  correo = signal('');
  celular = signal('');
  nivel = signal<number>(2); // Default to Vendedor (2)
  password = signal('');

  guardar() {
    // Validations
    if (!this.nombres().trim()) {
      this.toastService.warning('Ingrese los nombres');
      return;
    }
    if (!this.apellidos().trim()) {
      this.toastService.warning('Ingrese los apellidos');
      return;
    }
    if (!this.correo().trim()) {
      this.toastService.warning('Ingrese el correo');
      return;
    }
    if (!this.password().trim() || this.password().length < 6) {
      this.toastService.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar que solo se puedan crear Supervisores (1) o Vendedores (2)
    if (this.nivel() !== 1 && this.nivel() !== 2) {
      alert(this.nivel());
      this.toastService.error('Solo se pueden crear usuarios de tipo Supervisor o Vendedor');
      return;
    }

    this.loading.set(true);

    const usuario: UsuarioCreate = {
      nombres: this.nombres(),
      apellidos: this.apellidos(),
      correo: this.correo(),
      celular: this.celular(),
      nivel: this.nivel(),
      password: this.password(),
    };

    this.usuariosService.create(usuario).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Usuario creado exitosamente');
        this.router.navigate(['/' + buildPath(PATH.admin.users.search)]);
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.error?.detail || 'Error al crear el usuario';
        this.toastService.error(errorMsg);
      },
    });
  }

  limpiar() {
    this.nombres.set('');
    this.apellidos.set('');
    this.correo.set('');
    this.celular.set('');
    this.nivel.set(2);
    this.password.set('');
  }
}
