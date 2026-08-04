import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { DetailComponent } from './detail.component';
import { VideogameService } from '../videogame.service';
import { ReviewService } from '../../reviews/review.service';
import { AuthContextService } from '../../../shared/services/auth-context.service';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let videogameServiceSpy: jasmine.SpyObj<VideogameService>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let authContextSpy: jasmine.SpyObj<AuthContextService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockGame = {
    id: 1, name: 'Test Game', slug: 'test-game', synopsis: 'A great game',
    coverUrl: 'http://example.com/cover.jpg', website: '', releaseDate: '2024-01-01',
    genres: ['Action'], platforms: ['PC'], developers: [], publishers: [],
    metacritic: 85, averageRating: 4.2, totalReviews: 10, esrbRating: 'T', playtime: 20
  };

  const mockReviews = {
    content: [
      { id: 1, username: 'user1', videogameId: 1, videogameName: 'Test Game', score: 4, comment: 'Great', createdAt: '2024-01-20' }
    ],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0,
    first: true,
    last: true
  };

  beforeEach(() => {
    videogameServiceSpy = jasmine.createSpyObj('VideogameService', ['getById', 'delete']);
    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['list']);
    authContextSpy = jasmine.createSpyObj('AuthContextService', ['isAuthenticated', 'isAdmin']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    videogameServiceSpy.getById.and.returnValue(of({ status: 200, message: 'OK', data: mockGame }));
    reviewServiceSpy.list.and.returnValue(of({ status: 200, message: 'OK', data: mockReviews }));
    authContextSpy.isAuthenticated.and.returnValue(false);
    authContextSpy.isAdmin.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [DetailComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: VideogameService, useValue: videogameServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthContextService, useValue: authContextSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } }
      ]
    });

    TestBed.overrideComponent(DetailComponent, {
      remove: { imports: [MatDialogModule, MatSnackBarModule] }
    });

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load game on init', () => {
    fixture.detectChanges();
    expect(videogameServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(component.game()?.name).toBe('Test Game');
  });

  it('should load reviews on init', () => {
    fixture.detectChanges();
    expect(reviewServiceSpy.list).toHaveBeenCalledWith(1);
    expect(component.reviews()).toHaveSize(1);
  });

  it('should render game title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-title')?.textContent).toContain('Test Game');
  });

  it('should render game cover image', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('.cover') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain('cover.jpg');
  });

  it('should render genres', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.chip--genre')?.textContent).toContain('Action');
  });

  it('should render platforms', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.chip--platform')?.textContent).toContain('PC');
  });

  it('should render reviews', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.review-card')).toBeTruthy();
  });

  it('should call delete and navigate on success', fakeAsync(() => {
    fixture.detectChanges();
    videogameServiceSpy.delete.and.returnValue(of({ status: 200, message: 'OK', data: undefined }));
    component.deleteGame();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/videogames']);
  }));

  it('should open review dialog', () => {
    fixture.detectChanges();
    const afterClosedSpy = jasmine.createSpy('afterClosed').and.returnValue(of(false));
    dialogSpy.open.and.returnValue({ afterClosed: afterClosedSpy } as any);
    component.openReviewDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
