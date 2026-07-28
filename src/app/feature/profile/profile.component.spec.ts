import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../shared/services/user.service';
import { AuthContextService } from '../../shared/services/auth-context.service';
import { UserProfile } from '../../domain/user-profile.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authContextSpy: jasmine.SpyObj<AuthContextService>;

  const mockProfile: UserProfile = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    createdAt: '2024-01-15T00:00:00',
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
        reviewCreatedAt: '2024-01-20T00:00:00'
      },
      {
        videogameId: 20,
        videogameName: 'Another Game',
        slug: 'another-game',
        coverUrl: '',
        score: 2,
        comment: '',
        completed: false,
        completedAt: '',
        reviewCreatedAt: '2024-03-10T00:00:00'
      }
    ]
  };

  const emptyProfile: UserProfile = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    createdAt: '2024-01-15T00:00:00',
    reviews: []
  };

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getProfile']);
    authContextSpy = jasmine.createSpyObj('AuthContextService', ['getUsername']);
    authContextSpy.getUsername.and.returnValue('testuser');

    TestBed.configureTestingModule({
      imports: [ProfileComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthContextService, useValue: authContextSpy }
      ]
    });

    userServiceSpy.getProfile.and.returnValue(of({ status: 200, message: 'OK', data: mockProfile }));

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load profile on init', () => {
      fixture.detectChanges();
      expect(userServiceSpy.getProfile).toHaveBeenCalledWith('testuser');
      expect(component.profile()).toEqual(mockProfile);
    });

    it('should not call getProfile if username is null', () => {
      authContextSpy.getUsername.and.returnValue(null);
      fixture = TestBed.createComponent(ProfileComponent);
      fixture.detectChanges();
      expect(userServiceSpy.getProfile).not.toHaveBeenCalled();
      expect(component.profile()).toBeNull();
    });
  });

  describe('template', () => {
    it('should display username', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.profile-info h1')?.textContent).toContain('testuser');
    });

    it('should display email', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.email')?.textContent).toContain('test@example.com');
    });

    it('should display avatar with first letter of username', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.avatar')?.textContent).toContain('T');
    });

    it('should display role chip', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.role-chip')?.textContent).toContain('USER');
    });

    it('should display review count', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h2')?.textContent).toContain('2');
    });

    it('should display reviews', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const cards = compiled.querySelectorAll('.review-card');
      expect(cards).toHaveSize(2);
    });

    it('should display cover image when coverUrl exists', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const img = compiled.querySelector('.review-card img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('http://example.com/cover.jpg');
    });

    it('should display no-cover placeholder when coverUrl is empty', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const noCovers = compiled.querySelectorAll('.no-cover');
      expect(noCovers).toHaveSize(1);
    });

    it('should display score stars', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const scores = compiled.querySelectorAll('.score');
      expect(scores[0]?.textContent).toContain('★★★★☆');
      expect(scores[1]?.textContent).toContain('★★☆☆☆');
    });

    it('should display completed chip when review is completed', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const completed = compiled.querySelectorAll('.completed-chip');
      expect(completed).toHaveSize(1);
      expect(completed[0]?.textContent).toContain('Completado');
    });

    it('should display comment when comment exists', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.comment')?.textContent).toContain('Great game');
    });

    it('should display no-reviews message when reviews array is empty', () => {
      userServiceSpy.getProfile.and.returnValue(of({ status: 200, message: 'OK', data: emptyProfile }));
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.no-reviews')?.textContent).toContain('Aun no has escrito ninguna review');
    });

    it('should not render profile-container when profile is null', () => {
      authContextSpy.getUsername.and.returnValue(null);
      fixture = TestBed.createComponent(ProfileComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.profile-container')).toBeNull();
    });
  });
});
