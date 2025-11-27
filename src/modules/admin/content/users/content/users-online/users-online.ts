import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '@service/admin/usuarios.service';
import { UsuarioOnline } from '@interface/admin/usuarios.interface';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-users-online',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-online.html',
  styleUrl: './users-online.css',
})
export class UsersOnline implements OnInit {
  private usuariosService = inject(UsuariosService);
  private toastService = inject(ToastService);

  users = signal<UsuarioOnline[]>([]);
  loading = signal(true);
  search = signal('');

  filteredUsers = computed(() => {
    const term = this.search().toLowerCase();
    return this.users().filter(
      (user) =>
        user.nombres.toLowerCase().includes(term) ||
        user.apellidos.toLowerCase().includes(term) ||
        user.correo.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.usuariosService.getOnline().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Error al cargar usuarios');
        this.loading.set(false);
      },
    });
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
}
