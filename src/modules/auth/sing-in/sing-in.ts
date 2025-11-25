import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';
import { ToastService } from '@service/toast.service';
import { UsuarioLogin } from '@interface/auth/auth.interface';

@Component({
  selector: 'app-sing-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Formulario de login
  correo = signal('');
  password = signal('');
  nivelSeleccionado = signal<number | null>(null);

  // Estados
  loading = signal(false);
  showPassword = signal(false);

  // Perfil seleccionado (no se usa en la API pero se puede mostrar en UI)
  perfilSeleccionado = signal<string>('');

  /**
   * Toggle visibility de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  /**
   * Maneja el submit del formulario de login
   */
  onLogin(): void {
    if (!this.nivelSeleccionado()) {
      this.toastService.error('Debe seleccionar un rol');
      return;
    }

    this.loading.set(true);

    const credenciales: UsuarioLogin = {
      correo: this.correo(),
      password: this.password(),
      nivel: this.nivelSeleccionado()!
    };

    this.authService.login(credenciales).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);

        this.toastService.success('¡Bienvenido!');

        // Obtener returnUrl de los query params o ir al dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
        this.router.navigate([returnUrl]);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.toastService.error(err.error?.detail || 'Correo, contraseña o rol incorrectos');
        this.loading.set(false);
      }
    });
  }

  /**
   * Método para salir/cancelar
   */
  onSalir(): void {
    this.correo.set('');
    this.password.set('');
    this.nivelSeleccionado.set(null);
  }

  /**
   * Seleccionar perfil y nivel
   */
  seleccionarPerfil(perfil: string, nivel: number): void {
    this.perfilSeleccionado.set(perfil);
    this.nivelSeleccionado.set(nivel);
  }
}
