import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedData } from '../../domain/api-response.model';
import { VideogameRequest, VideogameResponse } from '../../domain/videogame.model';

@Injectable({ providedIn: 'root' })
export class VideogameService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/videogames`;

  list(page = 0, size = 20, name?: string, sortBy = 'id', sortDir = 'asc'): Observable<ApiResponse<PaginatedData<VideogameResponse>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    if (name) params = params.set('name', name);
    return this.http.get<ApiResponse<PaginatedData<VideogameResponse>>>(this.url, { params });
  }

  getById(id: number): Observable<ApiResponse<VideogameResponse>> {
    return this.http.get<ApiResponse<VideogameResponse>>(`${this.url}/${id}`);
  }

  create(request: VideogameRequest): Observable<ApiResponse<VideogameResponse>> {
    return this.http.post<ApiResponse<VideogameResponse>>(this.url, request);
  }

  update(id: number, request: VideogameRequest): Observable<ApiResponse<VideogameResponse>> {
    return this.http.put<ApiResponse<VideogameResponse>>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.url}/${id}`);
  }
}
