import { Component, model, output, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineService } from '@service/admin/offline.service';

@Component({
  selector: 'app-actions-logs',
  imports: [CommonModule],
  templateUrl: './actions-logs.html',
  styleUrl: './actions-logs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsLogs {
  private offlineService = inject(OfflineService);
  isOpen = model<boolean>(false);

  queue = this.offlineService.queue;
  syncState = this.offlineService.syncState;
  serverStatus = this.offlineService.serverStatus;

  expandedItems = signal<Set<number>>(new Set());

  close() {
    this.isOpen.set(false);
  }

  toggleExpand(id: number) {
    this.expandedItems.update((current) => {
      const newSet = new Set(current);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  deleteItem(id: number, event: Event) {
    event.stopPropagation();
    this.offlineService.deleteRequest(id);
  }
}
