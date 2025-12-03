import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { buildPath, PATH } from '@route/path.route';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  success = signal(false);
  error = signal('');
  token = signal('');

  ngOnInit() {
    // Obtener el token de la URL
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.token.set(token);
        this.verifyEmail(token);
      } else {
        this.loading.set(false);
        this.error.set('Token de verificación no encontrado');
      }
    });
  }

  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.success.set(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/' + buildPath(PATH.auth.signIn)]);
        }, 3000);
      },
      error: (err) => {
        this.loading.set(false);
        this.success.set(false);
        const errorMsg = err.error?.detail || 'Error al verificar el email';
        this.error.set(errorMsg);
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/' + buildPath(PATH.auth.signIn)]);
  }
}
