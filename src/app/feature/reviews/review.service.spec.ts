import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ReviewService } from './review.service';
import { environment } from '../../../environments/environment';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ReviewService
      ]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET reviews for a videogame', () => {
    service.list(1, 0, 10).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/videogames/1/reviews?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush({ status: 200, message: 'OK', data: { content: [], totalElements: 0 } });
  });

  it('should POST to create a review', () => {
    const reviewData = { score: 4, comment: 'Great game' };
    service.create(1, reviewData).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/videogames/1/reviews`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reviewData);
    req.flush({ status: 200, message: 'OK', data: { id: 1, score: 4 } });
  });

  it('should GET average rating', () => {
    service.average(1).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/videogames/1/reviews/average`);
    expect(req.request.method).toBe('GET');
    req.flush({ status: 200, message: 'OK', data: 4.5 });
  });
});
