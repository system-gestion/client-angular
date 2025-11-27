import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from '@service/admin/clientes.service';
import { ToastService } from '@service/toast.service';
import { ClienteCreate } from '@interface/admin/clientes.interface';
import { buildPath, PATH } from '@route/path.route';

@Component({
  selector: 'app-clients-new',
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-new.html',
  styleUrl: './clients-new.css',
})
export class ClientsNew {
  private clientesService = inject(ClientesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);

  // Form data
  cod_cliente = signal('');
  nombre = signal('');
  direccion = signal('');
  telefono = signal('');
  correo = signal('');
  celular = signal('');
  password = signal('');
  confirmPassword = signal('');

  guardar() {
    // Validations
    if (!this.cod_cliente().trim()) {
      this.toastService.warning('Ingrese el código del cliente');
      return;
    }
    if (!this.nombre().trim()) {
      this.toastService.warning('Ingrese el nombre del cliente');
      return;
    }
    if (this.nombre().trim().split(' ').length < 2) {
      this.toastService.warning('El nombre debe tener al menos dos palabras (Nombre y Apellido)');
      return;
    }
    if (!this.correo().trim()) {
      this.toastService.warning('Ingrese el correo electrónico');
      return;
    }
    if (!this.password().trim() || this.password().length < 6) {
      this.toastService.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.toastService.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);

    const cliente: ClienteCreate = {
      cod_cliente: this.cod_cliente(),
      nombre: this.nombre(),
      direccion: this.direccion() || undefined,
      telefono: this.telefono() || undefined,
      correo: this.correo(),
      celular: this.telefono() || undefined, // Usar teléfono como celular
      password: this.password(),
    };

    this.clientesService.create(cliente).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Cliente creado exitosamente');
        this.router.navigate(['/' + buildPath(PATH.admin.clients.search)]);
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.error?.detail || 'Error al crear el cliente';
        this.toastService.error(errorMsg);
      },
    });
  }

  limpiar() {
    this.cod_cliente.set('');
    this.nombre.set('');
    this.direccion.set('');
    this.telefono.set('');
    this.correo.set('');
    this.celular.set('');
    this.password.set('');
    this.confirmPassword.set('');
  }
}
