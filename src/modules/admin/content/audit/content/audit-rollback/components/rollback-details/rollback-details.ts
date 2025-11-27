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
      case 4:
        return 'Rollback';
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
      case 4:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  get parsedSnapshot(): any {
    if (!this.accion?.datos_json) return null;
    try {
      return JSON.parse(this.accion.datos_json);
    } catch (e) {
      return null;
    }
  }

  get oldData(): any {
    const snapshot = this.parsedSnapshot;
    return snapshot?.old_data || null;
  }

  get newData(): any {
    const snapshot = this.parsedSnapshot;
    return snapshot?.new_data || null;
  }

  // Legacy support or direct data access
  get flatData(): any {
    const snapshot = this.parsedSnapshot;
    if (snapshot && !snapshot.old_data && !snapshot.new_data) {
      return snapshot;
    }
    return null;
  }

  getFormattedJson(data: any): string {
    if (!data) return '{}';
    return JSON.stringify(data, null, 2);
  }

  getTargetId(): string {
    const snapshot = this.parsedSnapshot;
    if (!snapshot) return '-';

    // Try to find ID in any available data source
    const data = snapshot.new_data || snapshot.old_data || snapshot;

    if (!data) return '-';

    // Identificar ID según la tabla
    if (this.accion?.tabla === 'usuario') return '#' + (data.cod_usuario || '?');
    if (this.accion?.tabla === 'pedido') return '#' + (data.num_pedido || '?');
    if (this.accion?.tabla === 'articulo') return '#' + (data.cod_articulo || '?');
    if (this.accion?.tabla === 'cliente') return '#' + (data.cod_cliente || '?');

    // Fallback genérico
    return (
      '#' +
      (data.id ||
        data.codigo ||
        data.cod_usuario ||
        data.num_pedido ||
        data.cod_articulo ||
        data.cod_cliente ||
        '?')
    );
  }
}
