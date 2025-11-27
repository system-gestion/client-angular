import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuditoriaService } from '@service/admin/auditoria.service';
import { DetalleSesionResponse } from '@interface/admin/auditoria.interface';
import { AlertService } from '@service/alert.service';
import { ToastService } from '@service/toast.service';
import { RollbackDetails } from './components/rollback-details/rollback-details';

@Component({
  selector: 'app-audit-rollback',
  standalone: true,
  imports: [CommonModule, FormsModule, RollbackDetails],
  templateUrl: './audit-rollback.html',
  styleUrl: './audit-rollback.css',
})
export class AuditRollback implements OnInit {
  private auditoriaService = inject(AuditoriaService);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);

  acciones = signal<DetalleSesionResponse[]>([]);
  loading = signal(false);

  // Filtros
  filtroTabla = signal('');
  filtroAccion = signal<number | null>(null);

  // Modal
  showModal = signal(false);
  selectedAccion = signal<DetalleSesionResponse | null>(null);
  loadingRollback = signal(false);

  ngOnInit() {
    this.loadAcciones();
  }

  loadAcciones() {
    this.loading.set(true);
    this.auditoriaService
      .listAcciones({
        tabla: this.filtroTabla() || undefined,
        accion: this.filtroAccion() !== null ? this.filtroAccion()! : undefined,
        limit: 50, // Limitamos a 50 recientes por defecto
      })
      .subscribe({
        next: (data) => {
          this.acciones.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando acciones', err);
          this.toastService.error('Error al cargar acciones');
          this.loading.set(false);
        },
      });
  }

  onFilterChange() {
    this.loadAcciones();
  }

  openRollbackModal(accion: DetalleSesionResponse) {
    if (!accion.datos_json) {
      this.alertService.error('Error', 'No hay datos de snapshot para esta acción', [
        {
          text: 'Cerrar',
          style: 'danger',
          action: () => this.alertService.close(),
        },
      ]);
      return;
    }
    this.selectedAccion.set(accion);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedAccion.set(null);
  }

  executeRollback() {
    const accion = this.selectedAccion();
    if (!accion) return;

    this.loadingRollback.set(true);
    this.auditoriaService.rollbackAction(accion.num_detalle).subscribe({
      next: (res) => {
        this.loadingRollback.set(false);
        this.closeModal();
        this.alertService.success('Éxito', res.message, [
          {
            text: 'Aceptar',
            style: 'success',
            action: () => {
              this.alertService.close();
              this.loadAcciones(); // Recargar lista
            },
          },
        ]);
      },
      error: (err) => {
        console.error('Error en rollback', err);
        this.loadingRollback.set(false);
        this.alertService.error('Error', err.error?.detail || 'Error al realizar rollback', [
          {
            text: 'Cerrar',
            style: 'danger',
            action: () => this.alertService.close(),
          },
        ]);
      },
    });
  }

  formatTime(time: string | undefined): string {
    if (!time) return '-';
    return time.split('.')[0];
  }

  getAccionLabel(accion: number): string {
    switch (accion) {
      case 0:
        return 'Consulta';
      case 1:
        return 'Edición';
      case 2:
        return 'Inserción';
      case 3:
        return 'Eliminación';
      default:
        return 'Desconocido';
    }
  }

  getAccionClass(accion: number): string {
    switch (accion) {
      case 1:
        return 'bg-blue-100 text-blue-800'; // Edición
      case 2:
        return 'bg-green-100 text-green-800'; // Inserción
      case 3:
        return 'bg-red-100 text-red-800'; // Eliminación
      default:
        return 'bg-gray-100 text-gray-800'; // Consulta
    }
  }
}
