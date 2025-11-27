import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService } from '@service/admin/auditoria.service';
import { SesionLogList, SesionLogResponse } from '@interface/admin/auditoria.interface';
import { ToastService } from '@service/toast.service';
import { SessionsDetails } from './components/sessions-details/sessions-details';

@Component({
  selector: 'app-audit-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, SessionsDetails],
  templateUrl: './audit-sessions.html',
  styleUrl: './audit-sessions.css',
})
export class AuditSessions implements OnInit {
  private auditoriaService = inject(AuditoriaService);
  private toastService = inject(ToastService);

  sesiones = signal<SesionLogList[]>([]);
  loading = signal(false);

  // Modal details
  selectedSesion = signal<SesionLogResponse | null>(null);
  loadingDetails = signal(false);
  showModal = signal(false);

  // Filters
  fecha_inicio = signal('');
  fecha_fin = signal('');
  estado = signal<number | null>(null);

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.loading.set(true);

    const params: any = {};
    if (this.fecha_inicio()) params.fecha_inicio = this.fecha_inicio();
    if (this.fecha_fin()) params.fecha_fin = this.fecha_fin();
    if (this.estado() !== null) params.estado = this.estado();

    this.auditoriaService.listSesiones(params).subscribe({
      next: (data) => {
        this.sesiones.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Error al cargar sesiones');
        this.loading.set(false);
      },
    });
  }

  limpiar() {
    this.fecha_inicio.set('');
    this.fecha_fin.set('');
    this.estado.set(null);
    this.buscar();
  }

  verDetalles(num_sesion: number) {
    this.loadingDetails.set(true);
    this.showModal.set(true);
    this.selectedSesion.set(null);

    this.auditoriaService.getSesion(num_sesion).subscribe({
      next: (data) => {
        this.selectedSesion.set(data);
        this.loadingDetails.set(false);
      },
      error: (err) => {
        this.toastService.error('Error al cargar detalles de la sesión');
        this.loadingDetails.set(false);
        this.showModal.set(false);
      },
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedSesion.set(null);
  }

  getEstadoLabel(estado: number): string {
    return estado === 1 ? 'Activa' : 'Cerrada';
  }

  getEstadoClass(estado: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  }
}
