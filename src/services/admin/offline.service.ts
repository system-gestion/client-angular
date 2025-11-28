import { Injectable, inject, effect, signal, PLATFORM_ID } from '@angular/core';
import Dexie from 'dexie';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { db, RequestQueue } from '@db/offline.db';
import { API_URL } from '@route/api.route';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  serverStatus = signal<'online' | 'offline'>('online');
  queue = signal<RequestQueue[]>([]);

  syncState = signal<{
    id: number | null;
    status: 'idle' | 'syncing' | 'success' | 'error';
    duration?: number;
  }>({
    id: null,
    status: 'idle',
  });

  constructor() {
    // Only run logic in the browser
    if (!this.isBrowser) return;

    effect(() => {
      const status = this.serverStatus();
      if (status === 'online') {
        console.log('Server is back online. Syncing...');
        this.sync();
      }
    });

    // Monitor queue changes
    db.requestQueue.hook('creating', () => {
      this.triggerUpdate();
    });
    db.requestQueue.hook('deleting', () => {
      this.triggerUpdate();
    });
    db.requestQueue.hook('updating', () => {
      this.triggerUpdate();
    });

    // Initial load
    this.updateQueueSignal();
  }

  private triggerUpdate() {
    if (Dexie.currentTransaction) {
      Dexie.currentTransaction.on('complete', () => {
        this.updateQueueSignal();
      });
    } else {
      this.updateQueueSignal();
    }
  }

  private async updateQueueSignal() {
    if (!this.isBrowser) return;
    const items = await db.requestQueue.toArray();
    this.queue.set(items);
  }

  // Cache GET requests
  async cacheRequest(url: string, response: any) {
    if (!this.isBrowser) return;
    await db.requestCache.put({
      url,
      response,
      timestamp: Date.now(),
    });
  }

  // Get cached GET request
  getCachedRequest(url: string): Observable<any> {
    if (!this.isBrowser) {
      return of(null);
    }
    return from(db.requestCache.get(url)).pipe(
      switchMap((entry) => {
        if (entry) {
          return of(entry.response);
        }
        throw new Error('No cached response found');
      })
    );
  }

  // Queue POST/PUT/DELETE requests
  async addToQueue(url: string, method: string, body: any) {
    if (!this.isBrowser) return;
    await db.requestQueue.add({
      url,
      method,
      body,
      timestamp: Date.now(),
      status: 'pending',
    });
    console.log('Request queued for offline sync:', method, url);
  }

  // Sync queued requests
  async sync() {
    if (!this.isBrowser) return;

    // Only get pending requests
    const queue = await db.requestQueue.filter(req => req.status === 'pending' || req.status === undefined).toArray();
    if (queue.length === 0) return;

    for (const req of queue) {
      if (!req.id) continue;

      try {
        console.log('Replaying request:', req.method, req.url);

        // Update state to syncing (visual only)
        this.syncState.set({ id: req.id, status: 'syncing' });
        const startTime = performance.now();

        let obs: Observable<any>;
        switch (req.method) {
          case 'POST':
            obs = this.http.post(req.url, req.body);
            break;
          case 'PUT':
            obs = this.http.put(req.url, req.body);
            break;
          case 'DELETE':
            obs = this.http.delete(req.url);
            break;
          default:
            console.warn('Unsupported method for sync:', req.method);
            continue;
        }

        // Convert observable to promise to await it properly in the loop
        await new Promise<void>((resolve, reject) => {
          obs.subscribe({
            next: async () => {
              const duration = Math.round(performance.now() - startTime);
              console.log(`Synced successfully (${duration}ms):`, req.url);

              // Update DB status to success
              if (req.id) {
                await db.requestQueue.update(req.id, { status: 'success' });
              }

              // Update visual state
              this.syncState.set({ id: req.id!, status: 'success', duration });
              resolve();
            },
            error: async (err) => {
              console.error('Sync failed for:', req.url, err);

              // Update DB status to error
              if (req.id) {
                await db.requestQueue.update(req.id, { status: 'error' });
              }

              this.syncState.set({ id: req.id!, status: 'error' });
              resolve();
            },
          });
        });

      } catch (error) {
        console.error('Error processing queue item:', error);
      }
    }

    // Reset state after loop
    this.syncState.set({ id: null, status: 'idle' });
  }

  async deleteRequest(id: number) {
    if (!this.isBrowser) return;
    await db.requestQueue.delete(id);
  }

  checkHealth(): Observable<any> {
    return this.http.get(API_URL.health);
  }
}
