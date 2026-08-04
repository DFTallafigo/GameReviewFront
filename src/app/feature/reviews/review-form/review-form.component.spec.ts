import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ReviewFormComponent } from './review-form.component';
import { ReviewService } from '../review.service';

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ReviewFormComponent>>;

  beforeEach(() => {
    reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['create']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ReviewFormComponent, NoopAnimationsModule],
      providers: [
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { videogameId: 1 } }
      ]
    });

    TestBed.overrideComponent(ReviewFormComponent, {
      remove: { imports: [MatSnackBarModule] }
    });

    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form with score and comment controls', () => {
    expect(component.form.contains('score')).toBeTrue();
    expect(component.form.contains('comment')).toBeTrue();
  });

  it('should set score via setScore', () => {
    component.setScore(4);
    expect(component.selectedScore()).toBe(4);
    expect(component.form.get('score')?.value).toBe(4);
  });

  it('should be invalid when no score selected', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should be valid when score is selected', () => {
    component.setScore(3);
    expect(component.form.valid).toBeTrue();
  });

  it('should call reviewService.create on submit', fakeAsync(() => {
    component.setScore(4);
    reviewServiceSpy.create.and.returnValue(of({ status: 200, message: 'OK', data: {} as any }));
    component.submit();
    tick();
    expect(reviewServiceSpy.create).toHaveBeenCalledWith(1, jasmine.objectContaining({ score: 4 }));
  }));

  it('should close dialog on success', fakeAsync(() => {
    component.setScore(4);
    reviewServiceSpy.create.and.returnValue(of({ status: 200, message: 'OK', data: {} as any }));
    component.submit();
    tick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  }));

  it('should show success snackbar on success', fakeAsync(() => {
    component.setScore(4);
    reviewServiceSpy.create.and.returnValue(of({ status: 200, message: 'OK', data: {} as any }));
    component.submit();
    tick();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Review published', 'Close', { duration: 3000 });
  }));

  it('should reset loading on error', fakeAsync(() => {
    component.setScore(4);
    reviewServiceSpy.create.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));
    component.submit();
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should not submit if form is invalid', () => {
    component.submit();
    expect(reviewServiceSpy.create).not.toHaveBeenCalled();
  });
});
