import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { PATH, buildPath, canAccessRoute } from '@route/path.route';

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
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;
  user = this.authService.user;

  expandedMenu = signal<string | null>(null);

  constructor() {
  }

  menuItems: MenuItem[] = [
    {
      label: 'PERFIL',
      path: buildPath(PATH.admin.profile),
      items: [
        { label: 'MIS DATOS', path: buildPath(PATH.admin.profile.data), action: () => this.navigate(buildPath(PATH.admin.profile.data)) },
        { label: 'ACTUALIZAR', path: buildPath(PATH.admin.profile.update), action: () => this.navigate(buildPath(PATH.admin.profile.update)) },
        { label: 'COMISIONES', path: buildPath(PATH.admin.profile.commissions), action: () => this.navigate(buildPath(PATH.admin.profile.commissions)) }
      ]
    },
    {
      label: 'MIS PEDIDOS',
      path: buildPath(PATH.admin.myorders),
      items: [
        { label: 'PENDIENTES', path: buildPath(PATH.admin.myorders.pending), action: () => this.navigate(buildPath(PATH.admin.myorders.pending)) },
        { label: 'POR FECHA', path: buildPath(PATH.admin.myorders.byDate), action: () => this.navigate(buildPath(PATH.admin.myorders.byDate)) },
        { label: 'POR NUMERO', path: buildPath(PATH.admin.myorders.byNumber), action: () => this.navigate(buildPath(PATH.admin.myorders.byNumber)) },
        { label: 'ATENDIDOS', path: buildPath(PATH.admin.myorders.completed), action: () => this.navigate(buildPath(PATH.admin.myorders.completed)) },
        { label: 'ANULADOS', path: buildPath(PATH.admin.myorders.cancelled), action: () => this.navigate(buildPath(PATH.admin.myorders.cancelled)) }
      ]
    },
    {
      label: 'PEDIDOS',
      path: buildPath(PATH.admin.orders),
      items: [
        { label: 'NUEVO', path: buildPath(PATH.admin.orders.new), action: () => this.navigate(buildPath(PATH.admin.orders.new)) },
        { label: 'CONSULTAS', path: buildPath(PATH.admin.orders.search), action: () => this.navigate(buildPath(PATH.admin.orders.search)) },
        { label: 'PENDIENTES', path: buildPath(PATH.admin.orders.pending), action: () => this.navigate(buildPath(PATH.admin.orders.pending)) },
        { label: 'POR FECHA', path: buildPath(PATH.admin.orders.byDate), action: () => this.navigate(buildPath(PATH.admin.orders.byDate)) },
        { label: 'POR NUMERO', path: buildPath(PATH.admin.orders.byNumber), action: () => this.navigate(buildPath(PATH.admin.orders.byNumber)) },
        { label: 'ATENDIDOS', path: buildPath(PATH.admin.orders.completed), action: () => this.navigate(buildPath(PATH.admin.orders.completed)) },
        { label: 'ANULADOS', path: buildPath(PATH.admin.orders.cancelled), action: () => this.navigate(buildPath(PATH.admin.orders.cancelled)) },
        { label: 'ANULAR PEDIDO', path: buildPath(PATH.admin.orders.cancel), action: () => this.navigate(buildPath(PATH.admin.orders.cancel)) }
      ]
    },
    {
      label: 'REGISTRO',
      path: buildPath(PATH.admin.users),
      items: [
        { label: 'NUEVO USUARIO', path: buildPath(PATH.admin.users.new), action: () => this.navigate(buildPath(PATH.admin.users.new)) },
        { label: 'CONSULTAS', path: buildPath(PATH.admin.users.search), action: () => this.navigate(buildPath(PATH.admin.users.search)) },
        { label: 'USUARIOS EN LINEA', path: buildPath(PATH.admin.users.online), action: () => this.navigate(buildPath(PATH.admin.users.online)) },
        { label: 'PERFIL DE USUARIO', path: buildPath(PATH.admin.users.profile), action: () => this.navigate(buildPath(PATH.admin.users.profile)) },
        { label: 'ACTUALIZAR USUARIO', path: buildPath(PATH.admin.users.update), action: () => this.navigate(buildPath(PATH.admin.users.update)) },
        { label: 'BAJA DE USUARIO', path: buildPath(PATH.admin.users.deactivate), action: () => this.navigate(buildPath(PATH.admin.users.deactivate)) }
      ]
    },
    {
      label: 'AUDITORIA',
      path: buildPath(PATH.admin.audit),
      items: [
        { label: 'INICIOS DE SESION', path: buildPath(PATH.admin.audit.sessions), action: () => this.navigate(buildPath(PATH.admin.audit.sessions)) },
        { label: 'ACTIVIDAD DE USUARIOS', path: buildPath(PATH.admin.audit.actions), action: () => this.navigate(buildPath(PATH.admin.audit.actions)) }
      ]
    },
    {
      label: 'OFERTAS',
      path: buildPath(PATH.admin.offers),
      items: [
        { label: 'ACTIVAS', path: buildPath(PATH.admin.offers), action: () => this.navigate(buildPath(PATH.admin.offers)) },
        { label: 'NUEVAS OFERTAS', path: buildPath(PATH.admin.offers.new), action: () => this.navigate(buildPath(PATH.admin.offers.new)) },
        { label: 'BAJA DE OFERTAS', path: buildPath(PATH.admin.offers.remove), action: () => this.navigate(buildPath(PATH.admin.offers.remove)) }
      ]
    },
    {
      label: 'SALIR',
      action: () => this.logout()
    }
  ];

  visibleMenuItems = computed(() => {
    return this.menuItems.filter(item => this.canAccessMenuItem(item));
  });

  toggleMenu(menuLabel: string) {
    this.expandedMenu.update(current => current === menuLabel ? null : menuLabel);
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
        }
      });
    } else {
      this.authService.logout().subscribe(() => {
        this.router.navigate([buildPath(PATH.auth.signIn)]);
      });
    }
  }
}
