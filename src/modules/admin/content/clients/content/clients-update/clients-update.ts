import { Component, inject, signal, OnDestroy, OnInit, effect } from '@angular/core';
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
export class ClientsUpdate implements OnInit, OnDestroy {
  private clientesService = inject(ClientesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Search
  searchId = signal('');
  cliente = signal<ClienteResponse | null>(null);
  loading = signal(false);

  // Form
  apellidos = signal('');
  nombres = signal('');
  direccion = signal('');
  celular = signal('');
  correo = signal('');
  showPasswordFields = signal(false);
  password = signal('');
  confirmPassword = signal('');

  // Lock Status
  isLockedByOther = signal(false);
  lockOwner = signal('');

  constructor() {
    // Reaccionar a cambios en el estado del lock
    effect(() => {
      const status = this.clientesService.lockStatus();
      if (status.status === 'LOCKED') {
        this.isLockedByOther.set(true);
        this.lockOwner.set(status.owner || 'Otro usuario');
        this.toastService.warning(`El cliente está siendo editado por: ${status.owner}`);
      } else {
        this.isLockedByOther.set(false);
        this.lockOwner.set('');
      }
    });
  }

  ngOnInit() {
    this.clientesService.connectWs();
  }

  ngOnDestroy() {
    if (this.cliente()) {
      this.clientesService.releaseLock(this.cliente()!.cod_cliente);
    }
    this.clientesService.disconnectWs();
  }

  buscar() {
    if (!this.searchId().trim()) {
      this.toastService.warning('Ingrese un código de cliente');
      return;
    }

    // Si ya había uno cargado, liberar su lock
    if (this.cliente()) {
      this.clientesService.releaseLock(this.cliente()!.cod_cliente);
    }

    this.loading.set(true);
    this.cliente.set(null);
    this.isLockedByOther.set(false); // Reset lock status local

    this.clientesService.get(this.searchId()).subscribe({
      next: (data) => {
        this.cliente.set(data);
        this.populateForm(data);
        this.loading.set(false);

        // Solicitar lock
        this.clientesService.requestLock(data.cod_cliente);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error('Cliente no encontrado');
      },
    });
  }

  populateForm(data: ClienteResponse) {
    this.apellidos.set(data.apellidos || '');
    this.nombres.set(data.nombres || '');
    this.direccion.set(data.direccion || '');
    this.celular.set(data.celular || '');
    this.correo.set(data.correo || '');
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

    if (this.isLockedByOther()) {
      this.toastService.error(`No puede editar. Cliente bloqueado por: ${this.lockOwner()}`);
      return;
    }

    // Validaciones
    if (!this.apellidos().trim()) {
      this.toastService.warning('Los apellidos son obligatorios');
      return;
    }
    if (!this.nombres().trim()) {
      this.toastService.warning('Los nombres son obligatorios');
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
      apellidos: this.apellidos(),
      nombres: this.nombres(),
      direccion: this.direccion() || undefined,
      celular: this.celular() || undefined,
      correo: this.correo(),
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
    this.apellidos.set('');
    this.nombres.set('');
    this.direccion.set('');
    this.celular.set('');
    this.correo.set('');
    this.password.set('');
    this.confirmPassword.set('');
    this.showPasswordFields.set(false);
  }

  cancelar() {
    this.router.navigate(['/' + buildPath(PATH.admin.clients.search)]);
  }
}
