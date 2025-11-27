import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';
import { MeResponse } from '@interface/auth/auth.interface';

@Component({
  selector: 'app-profile-data',
  imports: [CommonModule],
  templateUrl: './profile-data.html',
  styleUrl: './profile-data.css',
})
export class ProfileData implements OnInit {
  private authService = inject(AuthService);

  user = signal<MeResponse | null>(null);
  loading = signal(true);

  ngOnInit() {
    // Obtener solo el ID del usuario desde localStorage
    const currentUser = this.authService.user();
    if (currentUser?.cod_usuario) {
      // Hacer consulta al servidor para obtener datos actualizados
      this.authService.getCurrentUser(currentUser.cod_usuario).subscribe({
        next: (userData) => {
          this.user.set(userData);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
          // Fallback a datos del localStorage si falla la consulta
          this.user.set(currentUser);
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
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
