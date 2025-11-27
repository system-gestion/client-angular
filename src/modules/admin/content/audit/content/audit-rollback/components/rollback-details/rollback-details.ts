import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleSesionResponse } from '@interface/admin/auditoria.interface';

@Component({
  selector: 'app-rollback-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rollback-details.html',
  styleUrl: './rollback-details.css',
})
export class RollbackDetails {
  @Input() accion: DetalleSesionResponse | null = null;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  confirmRollback() {
    this.confirm.emit();
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
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getFormattedJson(jsonString: string | undefined): string {
    if (!jsonString) return '{}';
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return jsonString;
    }
  }

  getTargetId(): string {
    if (!this.accion?.datos_json) return '-';
    try {
      const data = JSON.parse(this.accion.datos_json);

      // Identificar ID según la tabla
      if (this.accion.tabla === 'usuario') return '#' + (data.cod_usuario || '?');
      if (this.accion.tabla === 'pedido') return '#' + (data.num_pedido || '?');

      // Fallback genérico
      return '#' + (data.id || data.codigo || data.cod_usuario || data.num_pedido || '?');
    } catch (e) {
      return '-';
    }
  }
}
