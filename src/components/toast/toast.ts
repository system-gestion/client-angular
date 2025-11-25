import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return '';
    }
  }

  getStyles(type: string) {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          icon: 'text-green-500',
          text: 'text-green-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          icon: 'text-red-500',
          text: 'text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-500',
          icon: 'text-yellow-500',
          text: 'text-yellow-800'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          icon: 'text-blue-500',
          text: 'text-blue-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-500',
          icon: 'text-gray-500',
          text: 'text-gray-800'
        };
    }
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}

