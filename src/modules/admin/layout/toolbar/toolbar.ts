import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { OfflineService } from '@service/admin/offline.service';
import { PATH, buildPath, canAccessRoute } from '@route/path.route';
import { catchError, of, finalize } from 'rxjs';
import { ActionsLogs } from '@module/admin/components/actions-logs/actions-logs';

interface MenuItem {
  label: string;
  path?: string; // Ruta completa para verificar acceso
  items?: SubMenuItem[];
  action?: () => void;
}

interface SubMenuItem {
  label: string;
  path: string; // Ruta completa para verificar acceso
  action: () => void;
}

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, ActionsLogs],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private offlineService = inject(OfflineService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;
  user = this.authService.user;
  expandedMenu = signal<string | null>(null);
  mobileMenuOpen = signal(false);
  serverStatus = this.offlineService.serverStatus;
  showFlash = signal(false);
  isAnimating = signal(false);
  progress = signal(0); // Del 0 al 100
  showLogs = signal(false);

  private animationFrameId: number | null = null;
  private isDestroyed = false;

  constructor() {}

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.startProgressLoop();
    }
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  toggleLogs() {
    this.showLogs.update((v) => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  startProgressLoop() {
    if (this.isDestroyed) return;

    // Reiniciamos
    this.progress.set(0);
    const duration = 5000; // 5 segundos
    const startTime = performance.now();

    // Función de animación ultra-suave (60fps)
    const animate = (currentTime: number) => {
      if (this.isDestroyed) return;

      const elapsed = currentTime - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);

      this.progress.set(pct);

      if (pct < 100) {
        // Sigue animando
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        // Terminó los 5 seg, hacemos el chequeo
        this.performHealthCheck();
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  performHealthCheck() {
    this.offlineService
      .checkHealth()
      .pipe(
        catchError(() => of(false)),
        finalize(() => {
          // Efecto visual de resultado
          this.triggerFlash();

          // Esperamos 1 segundo viendo el resultado antes de reiniciar
          if (!this.isDestroyed) {
            setTimeout(() => {
              this.startProgressLoop();
            }, 1000);
          }
        })
      )
      .subscribe((isHealthy) => {
        this.offlineService.serverStatus.set(isHealthy ? 'online' : 'offline');
      });
  }

  triggerFlash() {
    this.showFlash.set(true);
    setTimeout(() => this.showFlash.set(false), 500);
  }

  menuItems: MenuItem[] = [
    {
      label: 'PERFIL',
      path: buildPath(PATH.admin.profile),
      items: [
        {
          label: 'MIS DATOS',
          path: buildPath(PATH.admin.profile.data),
          action: () => this.navigate(buildPath(PATH.admin.profile.data)),
        },
        {
          label: 'ACTUALIZAR',
          path: buildPath(PATH.admin.profile.update),
          action: () => this.navigate(buildPath(PATH.admin.profile.update)),
        },
        {
          label: 'COMISIONES',
          path: buildPath(PATH.admin.profile.commissions),
          action: () => this.navigate(buildPath(PATH.admin.profile.commissions)),
        },
      ],
    },
    {
      label: 'CATÁLOGO',
      path: buildPath(PATH.admin.catalog),
      action: () => this.navigate(buildPath(PATH.admin.catalog)),
    },
    {
      label: 'MIS PEDIDOS',
      path: buildPath(PATH.admin.myorders),
      items: [
        {
          label: 'PENDIENTES',
          path: buildPath(PATH.admin.myorders.pending),
          action: () => this.navigate(buildPath(PATH.admin.myorders.pending)),
        },
        {
          label: 'POR FECHA',
          path: buildPath(PATH.admin.myorders.byDate),
          action: () => this.navigate(buildPath(PATH.admin.myorders.byDate)),
        },
        {
          label: 'POR NUMERO',
          path: buildPath(PATH.admin.myorders.byNumber),
          action: () => this.navigate(buildPath(PATH.admin.myorders.byNumber)),
        },
        {
          label: 'ATENDIDOS',
          path: buildPath(PATH.admin.myorders.completed),
          action: () => this.navigate(buildPath(PATH.admin.myorders.completed)),
        },
        {
          label: 'ANULADOS',
          path: buildPath(PATH.admin.myorders.cancelled),
          action: () => this.navigate(buildPath(PATH.admin.myorders.cancelled)),
        },
      ],
    },
    {
      label: 'PEDIDOS',
      path: buildPath(PATH.admin.orders),
      items: [
        {
          label: 'NUEVO',
          path: buildPath(PATH.admin.orders.new),
          action: () => this.navigate(buildPath(PATH.admin.orders.new)),
        },
        {
          label: 'CONSULTAS',
          path: buildPath(PATH.admin.orders.search),
          action: () => this.navigate(buildPath(PATH.admin.orders.search)),
        },
        {
          label: 'PENDIENTES',
          path: buildPath(PATH.admin.orders.pending),
          action: () => this.navigate(buildPath(PATH.admin.orders.pending)),
        },
        {
          label: 'POR FECHA',
          path: buildPath(PATH.admin.orders.byDate),
          action: () => this.navigate(buildPath(PATH.admin.orders.byDate)),
        },
        {
          label: 'POR NUMERO',
          path: buildPath(PATH.admin.orders.byNumber),
          action: () => this.navigate(buildPath(PATH.admin.orders.byNumber)),
        },
        {
          label: 'ATENDIDOS',
          path: buildPath(PATH.admin.orders.completed),
          action: () => this.navigate(buildPath(PATH.admin.orders.completed)),
        },
        {
          label: 'ANULADOS',
          path: buildPath(PATH.admin.orders.cancelled),
          action: () => this.navigate(buildPath(PATH.admin.orders.cancelled)),
        },
        {
          label: 'ANULAR PEDIDO',
          path: buildPath(PATH.admin.orders.cancel),
          action: () => this.navigate(buildPath(PATH.admin.orders.cancel)),
        },
      ],
    },
    {
      label: 'CLIENTES',
      path: buildPath(PATH.admin.clients),
      items: [
        {
          label: 'NUEVO',
          path: buildPath(PATH.admin.clients.new),
          action: () => this.navigate(buildPath(PATH.admin.clients.new)),
        },
        {
          label: 'CONSULTAS',
          path: buildPath(PATH.admin.clients.search),
          action: () => this.navigate(buildPath(PATH.admin.clients.search)),
        },
        {
          label: 'ACTUALIZAR',
          path: buildPath(PATH.admin.clients.update),
          action: () => this.navigate(buildPath(PATH.admin.clients.update)),
        },
      ],
    },
    {
      label: 'REGISTRO',
      path: buildPath(PATH.admin.users),
      items: [
        {
          label: 'NUEVO USUARIO',
          path: buildPath(PATH.admin.users.new),
          action: () => this.navigate(buildPath(PATH.admin.users.new)),
        },
        {
          label: 'CONSULTAS',
          path: buildPath(PATH.admin.users.search),
          action: () => this.navigate(buildPath(PATH.admin.users.search)),
        },
        {
          label: 'USUARIOS EN LINEA',
          path: buildPath(PATH.admin.users.online),
          action: () => this.navigate(buildPath(PATH.admin.users.online)),
        },
        {
          label: 'PERFIL DE USUARIO',
          path: buildPath(PATH.admin.users.profile),
          action: () => this.navigate(buildPath(PATH.admin.users.profile)),
        },
        {
          label: 'ACTUALIZAR USUARIO',
          path: buildPath(PATH.admin.users.update),
          action: () => this.navigate(buildPath(PATH.admin.users.update)),
        },
        {
          label: 'BAJA DE USUARIO',
          path: buildPath(PATH.admin.users.deactivate),
          action: () => this.navigate(buildPath(PATH.admin.users.deactivate)),
        },
      ],
    },
    {
      label: 'AUDITORIA',
      path: buildPath(PATH.admin.audit),
      items: [
        {
          label: 'INICIOS DE SESION',
          path: buildPath(PATH.admin.audit.sessions),
          action: () => this.navigate(buildPath(PATH.admin.audit.sessions)),
        },
        {
          label: 'ROLLBACK DE USUARIOS',
          path: buildPath(PATH.admin.audit.rollback),
          action: () => this.navigate(buildPath(PATH.admin.audit.rollback)),
        },
      ],
    },
    {
      label: 'OFERTAS',
      path: buildPath(PATH.admin.offers),
      items: [
        {
          label: 'ACTIVAS',
          path: buildPath(PATH.admin.offers),
          action: () => this.navigate(buildPath(PATH.admin.offers)),
        },
        {
          label: 'NUEVAS OFERTAS',
          path: buildPath(PATH.admin.offers.new),
          action: () => this.navigate(buildPath(PATH.admin.offers.new)),
        },
        {
          label: 'BAJA DE OFERTAS',
          path: buildPath(PATH.admin.offers.remove),
          action: () => this.navigate(buildPath(PATH.admin.offers.remove)),
        },
      ],
    },
    {
      label: 'SALIR',
      action: () => this.logout(),
    },
  ];

  visibleMenuItems = computed(() => {
    return this.menuItems.filter((item) => this.canAccessMenuItem(item));
  });

  toggleMenu(menuLabel: string) {
    this.expandedMenu.update((current) => (current === menuLabel ? null : menuLabel));
  }

  canAccessMenuItem(item: MenuItem): boolean {
    // Si no tiene path (como SALIR), siempre se muestra
    if (!item.path) {
      return true;
    }

    const userNivel = this.user()?.nivel;
    if (!userNivel) {
      return false;
    }

    // Verificar si el usuario tiene acceso al path
    return canAccessRoute(item.path, userNivel);
  }

  canAccessSubMenuItem(subItem: SubMenuItem): boolean {
    const userNivel = this.user()?.nivel;
    if (!userNivel) {
      return false;
    }

    // Verificar si el usuario tiene acceso al path
    return canAccessRoute(subItem.path, userNivel);
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.expandedMenu.set(null);
    this.mobileMenuOpen.set(false);
  }

  logout() {
    const numSesion = this.authService.numSesion();
    if (numSesion) {
      this.authService.logout(numSesion).subscribe({
        next: () => {
          this.router.navigate([buildPath(PATH.auth.signIn)]);
        },
        error: () => {
          // Si falla el logout en el servidor, igual cerramos sesión localmente
          this.router.navigate([buildPath(PATH.auth.signIn)]);
        },
      });
    } else {
      this.authService.logout().subscribe(() => {
        this.router.navigate([buildPath(PATH.auth.signIn)]);
      });
    }
  }
}
