import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../domain/user-profile.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/users`;

  const mockProfile: UserProfile = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    createdAt: '2024-01-15',
    reviews: [
      {
        videogameId: 10,
        videogameName: 'Test Game',
        slug: 'test-game',
        coverUrl: 'http://example.com/cover.jpg',
        score: 4,
        comment: 'Great game',
        completed: true,
        completedAt: '2024-02-01',
        reviewCreatedAt: '2024-01-20'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProfile', () => {
    it('should GET /users/:username/profile', () => {
      service.getProfile('testuser').subscribe(res => {
        expect(res.data).toEqual(mockProfile);
      });

      const req = httpMock.expectOne(`${apiUrl}/testuser/profile`);
      expect(req.request.method).toBe('GET');
      req.flush({ status: 200, message: 'OK', data: mockProfile });
    });

    it('should propagate error', () => {
      let error: any;
      service.getProfile('testuser').subscribe({
        error: (err) => { error = err; }
      });

      const req = httpMock.expectOne(`${apiUrl}/testuser/profile`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });
  });
});
