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
}
