import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { UploadResponse } from '@interface/admin/storage.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(API_URL.storage.upload, formData);
  }
}
