import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VideogameService } from './videogame.service';
import { environment } from '../../../environments/environment';
import { VideogameRequest, VideogameResponse } from '../../domain/videogame.model';

describe('VideogameService', () => {
  let service: VideogameService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/videogames`;

  const mockVideogame: VideogameResponse = {
    id: 1,
    name: 'Test Game',
    slug: 'test-game',
    synopsis: 'A test game',
    genres: ['Action'],
    platforms: ['PC'],
    developers: ['Dev Studio'],
    publishers: ['Pub Studio']
  };

  const mockVideogameRequest: VideogameRequest = {
    name: 'New Game',
    synopsis: 'A new game',
    coverUrl: 'http://example.com/cover.jpg',
    website: 'http://example.com',
    releaseDate: '2024-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VideogameService]
    });

    service = TestBed.inject(VideogameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should GET /videogames with default params', () => {
      service.list().subscribe();

      const req = httpMock.expectOne(r =>
        r.url === apiUrl &&
        r.params.get('page') === '0' &&
        r.params.get('size') === '20' &&
        r.params.get('sortBy') === 'id' &&
        r.params.get('sortDir') === 'asc'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ status: 200, message: 'OK', data: { content: [] } });
    });

    it('should include name param when provided', () => {
      service.list(0, 20, 'Test').subscribe();

      const req = httpMock.expectOne(r =>
        r.url === apiUrl &&
        r.params.get('name') === 'Test'
      );
      expect(req.request.method).toBe('GET');
      req.flush({ status: 200, message: 'OK', data: { content: [] } });
    });
  });

  describe('getById', () => {
    it('should GET /videogames/:id', () => {
      service.getById(1).subscribe(res => {
        expect(res.data).toEqual(mockVideogame);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 200, message: 'OK', data: mockVideogame });
    });
  });

  describe('create', () => {
    it('should POST /videogames with the request body', () => {
      service.create(mockVideogameRequest).subscribe(res => {
        expect(res.data).toEqual(mockVideogame);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockVideogameRequest);
      req.flush({ status: 200, message: 'OK', data: mockVideogame });
    });

    it('should propagate error', () => {
      let error: any;
      service.create(mockVideogameRequest).subscribe({
        error: (err) => { error = err; }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Creation failed', { status: 400, statusText: 'Bad Request' });
      expect(error).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should PUT /videogames/:id with the request body', () => {
      service.update(1, mockVideogameRequest).subscribe(res => {
        expect(res.data).toEqual(mockVideogame);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockVideogameRequest);
      req.flush({ status: 200, message: 'OK', data: mockVideogame });
    });
  });

  describe('delete', () => {
    it('should DELETE /videogames/:id', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ status: 200, message: 'OK', data: null });
    });
  });
});