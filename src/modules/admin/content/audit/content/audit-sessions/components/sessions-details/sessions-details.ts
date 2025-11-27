import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SesionLogResponse } from '@interface/admin/auditoria.interface';

@Component({
  selector: 'app-sessions-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sessions-details.html',
  styleUrl: './sessions-details.css',
})
export class SessionsDetails {
  @Input() session: SesionLogResponse | null = null;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  getEstadoLabel(estado: number): string {
    return estado === 1 ? 'Activa' : 'Cerrada';
  }

  getEstadoClass(estado: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
      case 4:
        return 'Rollback';
      default:
        return 'Desconocido';
    }
  }

  getAccionClass(accion: number): string {
    switch (accion) {
      case 0:
        return 'bg-gray-100 text-gray-800';
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-red-100 text-red-800';
      case 4:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
