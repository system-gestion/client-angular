import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { OfflineService } from '@service/admin/offline.service';
import { catchError, of, tap, throwError, switchMap } from 'rxjs';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const offlineService = inject(OfflineService);

  // Bypass health check to ensure status updates work
  if (req.url.includes('/health')) {
    return next(req);
  }

  // Check server status
  if (offlineService.serverStatus() === 'online') {
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status === 200 && req.method === 'GET') {
          offlineService.cacheRequest(req.urlWithParams, event.body);
        }
      }),
      catchError((error) => {
        // If connection fails (status 0) or server error (5xx), switch to offline mode
        if (error.status === 0 || error.status >= 500) {
          offlineService.serverStatus.set('offline');
          // Retry the request using offline logic
          return handleOfflineRequest(req, offlineService);
        }
        return throwError(() => error);
      })
    );
  } else {
    return handleOfflineRequest(req, offlineService);
  }
};

const handleOfflineRequest = (req: any, offlineService: OfflineService) => {
  // Offline handling
  if (req.method === 'GET') {
    return offlineService.getCachedRequest(req.urlWithParams).pipe(
      switchMap((body) => {
        return of(new HttpResponse({ status: 200, body }));
      }),
      catchError(() => {
        return throwError(() => new Error('Offline and no cache found'));
      })
    );
  } else {
    // POST, PUT, DELETE
    // Queue the request
    offlineService.addToQueue(req.urlWithParams, req.method, req.body);

    // Simulate success
    return of(new HttpResponse({ status: 200, body: { message: 'Action saved offline' } }));
  }
};
