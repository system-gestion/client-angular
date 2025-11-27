import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from '@service/admin/clientes.service';
import { ToastService } from '@service/toast.service';
import { ClienteResponse, ClienteUpdate } from '@interface/admin/clientes.interface';
import { buildPath, PATH } from '@route/path.route';

@Component({
  selector: 'app-clients-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-update.html',
  styleUrl: './clients-update.css',
})
export class ClientsUpdate {
  private clientesService = inject(ClientesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Search
  searchId = signal('');
  cliente = signal<ClienteResponse | null>(null);
  loading = signal(false);

  // Form
  nombre = signal('');
  direccion = signal('');
  telefono = signal('');
  correo = signal('');
  celular = signal('');
  showPasswordFields = signal(false);
  password = signal('');
  confirmPassword = signal('');

  buscar() {
    if (!this.searchId().trim()) {
      this.toastService.warning('Ingrese un código de cliente');
      return;
    }

    this.loading.set(true);
    this.cliente.set(null);

    this.clientesService.get(this.searchId()).subscribe({
      next: (data) => {
        this.cliente.set(data);
        this.populateForm(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error('Cliente no encontrado');
      },
    });
  }

  populateForm(data: ClienteResponse) {
    this.nombre.set(data.nombre);
    this.direccion.set(data.direccion || '');
    // Preferir teléfono, si no hay, usar celular
    this.telefono.set(data.telefono || data.celular || '');
    this.correo.set(data.correo || '');
    this.celular.set(data.celular || '');
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
    if (!this.cliente()) return;

    // Validaciones
    if (!this.nombre().trim()) {
      this.toastService.warning('El nombre es obligatorio');
      return;
    }
    if (this.nombre().trim().split(' ').length < 2) {
      this.toastService.warning('El nombre debe tener al menos dos palabras (Nombre y Apellido)');
      return;
    }
    if (!this.correo().trim()) {
      this.toastService.warning('El correo es obligatorio');
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

    const updateData: ClienteUpdate = {
      nombre: this.nombre(),
      direccion: this.direccion() || undefined,
      telefono: this.telefono() || undefined,
      correo: this.correo(),
      celular: this.telefono() || undefined, // Usar teléfono como celular
    };

    if (this.showPasswordFields() && this.password()) {
      updateData.password = this.password();
    }

    this.clientesService.update(this.cliente()!.cod_cliente, updateData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toastService.success('Cliente actualizado exitosamente');
        this.cliente.set(response);
        this.populateForm(response);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error(err.error?.detail || 'Error al actualizar el cliente');
      },
    });
  }

  limpiar() {
    this.searchId.set('');
    this.cliente.set(null);
    this.nombre.set('');
    this.direccion.set('');
    this.telefono.set('');
    this.correo.set('');
    this.celular.set('');
    this.password.set('');
    this.confirmPassword.set('');
    this.showPasswordFields.set(false);
  }

  cancelar() {
    this.router.navigate(['/' + buildPath(PATH.admin.clients.search)]);
  }
}
