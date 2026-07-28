import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedData } from '../../domain/api-response.model';
import { ReviewRequest, ReviewResponse } from '../../domain/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);

  private baseUrl(videogameId: number): string {
    return `${environment.apiUrl}/videogames/${videogameId}/reviews`;
  }

  list(videogameId: number, page = 0, size = 10): Observable<ApiResponse<PaginatedData<ReviewResponse>>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PaginatedData<ReviewResponse>>>(this.baseUrl(videogameId), { params });
  }

  create(videogameId: number, request: ReviewRequest): Observable<ApiResponse<ReviewResponse>> {
    return this.http.post<ApiResponse<ReviewResponse>>(this.baseUrl(videogameId), request);
  }

  average(videogameId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.baseUrl(videogameId)}/average`);
  }
}
