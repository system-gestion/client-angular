import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '@service/alert.service';
import { AlertButton } from '@interface/alert.interface';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  alertService = inject(AlertService);

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-circle-check';
      case 'error':
        return 'fa-solid fa-circle-xmark';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'info':
        return 'fa-solid fa-circle-info';
      case 'delete':
        return 'fa-solid fa-trash-can';
      default:
        return 'fa-solid fa-circle-info';
    }
  }

  getStyles(type: string) {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-green-100',
          icon: 'text-green-600',
        };
      case 'error':
        return {
          iconBg: 'bg-red-100',
          icon: 'text-red-600',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100',
          icon: 'text-amber-600',
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          icon: 'text-blue-600',
        };
      case 'delete':
        return {
          iconBg: 'bg-red-100',
          icon: 'text-red-600',
        };
      default:
        return {
          iconBg: 'bg-gray-100',
          icon: 'text-gray-600',
        };
    }
  }

  getButtonStyles(style: string): string {
    switch (style) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700';
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
  }

  handleButtonClick(button: AlertButton) {
    button.action();
  }

  closeAlert() {
    this.alertService.close();
  }
}
