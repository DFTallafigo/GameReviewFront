import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FormComponent } from './form.component';
import { VideogameService } from '../videogame.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let videogameServiceSpy: jasmine.SpyObj<VideogameService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockGameResponse = {
    status: 200,
    message: 'OK',
    data: {
      id: 1,
      name: 'Existing Game',
      slug: 'existing-game',
      synopsis: 'Existing synopsis',
      coverUrl: 'http://example.com/cover.jpg',
      website: 'http://example.com',
      releaseDate: '2024-01-01',
      genres: ['Action'],
      platforms: ['PC'],
      developers: ['Dev'],
      publishers: ['Pub']
    }
  };

  const createRoute = (params: Record<string, string>) => ({
    snapshot: { paramMap: new Map(Object.entries(params)) }
  } as unknown as ActivatedRoute);

  describe('create mode', () => {
    beforeEach(async () => {
      videogameServiceSpy = jasmine.createSpyObj('VideogameService', ['create', 'getById', 'update']);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);
      snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

      await TestBed.configureTestingModule({
        imports: [FormComponent, BrowserAnimationsModule],
        providers: [
          { provide: VideogameService, useValue: videogameServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: createRoute({}) }
        ]
      }).compileComponents();

      TestBed.overrideProvider(MatSnackBar, { useValue: snackBarSpy });

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be in create mode (isEdit = false)', () => {
      expect(component.isEdit).toBeFalse();
    });

    describe('form initialization', () => {
      it('should have name, synopsis, coverUrl, website, releaseDate controls', () => {
        expect(component.form.contains('name')).toBeTrue();
        expect(component.form.contains('synopsis')).toBeTrue();
        expect(component.form.contains('coverUrl')).toBeTrue();
        expect(component.form.contains('website')).toBeTrue();
        expect(component.form.contains('releaseDate')).toBeTrue();
      });

      it('should make name required', () => {
        const control = component.form.get('name');
        control?.setValue('');
        expect(control?.valid).toBeFalse();
      });

      it('should have loading default to false', () => {
        expect(component.loading).toBeFalse();
      });

      it('should be invalid when name is empty', () => {
        expect(component.form.valid).toBeFalse();
      });

      it('should be valid when name is filled', () => {
        component.form.patchValue({ name: 'New Game' });
        expect(component.form.valid).toBeTrue();
      });
    });

    describe('onSubmit in create mode', () => {
      it('should not call service if form is invalid via ngSubmit', fakeAsync(() => {
        const compiled = fixture.nativeElement as HTMLElement;
        const form = compiled.querySelector('form') as HTMLFormElement;
        form.dispatchEvent(new Event('submit'));
        tick();
        expect(videogameServiceSpy.create).not.toHaveBeenCalled();
      }));

      it('should set loading to true', fakeAsync(() => {
        component.form.patchValue({ name: 'New Game' });
        videogameServiceSpy.create.and.returnValue(of({
          status: 200,
          message: 'OK',
          data: mockGameResponse.data
        }));
        component.onSubmit();
        tick();
        expect(component.loading).toBeTrue();
      }));

      it('should call videogameService.create with form value', fakeAsync(() => {
        const gameData = { name: 'New Game', synopsis: '', coverUrl: '', website: '', releaseDate: '' };
        component.form.patchValue(gameData);
        videogameServiceSpy.create.and.returnValue(of({
          status: 200,
          message: 'OK',
          data: mockGameResponse.data
        }));
        component.onSubmit();
        tick();
        expect(videogameServiceSpy.create).toHaveBeenCalledWith(gameData);
      }));

      it('should navigate to /videogames on success', fakeAsync(() => {
        component.form.patchValue({ name: 'New Game' });
        videogameServiceSpy.create.and.returnValue(of({
          status: 200,
          message: 'OK',
          data: mockGameResponse.data
        }));
        component.onSubmit();
        tick();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/videogames']);
      }));

      it('should show success snackbar on success', fakeAsync(() => {
        component.form.patchValue({ name: 'New Game' });
        videogameServiceSpy.create.and.returnValue(of({
          status: 200,
          message: 'OK',
          data: mockGameResponse.data
        }));
        component.onSubmit();
        tick();
        expect(snackBarSpy.open).toHaveBeenCalledWith('Creado', 'Cerrar', { duration: 3000 });
      }));

      it('should reset loading on error', fakeAsync(() => {
        component.form.patchValue({ name: 'New Game' });
        videogameServiceSpy.create.and.returnValue(throwError(() => ({
          error: { message: 'Error' }
        })));
        component.onSubmit();
        tick();
        expect(component.loading).toBeFalse();
      }));

      it('should show error snackbar on error', fakeAsync(() => {
        component.form.patchValue({ name: 'New Game' });
        videogameServiceSpy.create.and.returnValue(throwError(() => ({
          error: { message: 'Creation failed' }
        })));
        component.onSubmit();
        tick();
        expect(snackBarSpy.open).toHaveBeenCalledWith('Creation failed', 'Cerrar', { duration: 4000 });
      }));

      it('should show default error message when no server message', fakeAsync(() => {
        component.form.patchValue({ name: 'New Game' });
        videogameServiceSpy.create.and.returnValue(throwError(() => ({})));
        component.onSubmit();
        tick();
        expect(snackBarSpy.open).toHaveBeenCalledWith('Error al guardar', 'Cerrar', { duration: 4000 });
      }));
    });

    describe('template', () => {
      it('should show "Nuevo Videojuego" as title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Nuevo Videojuego');
      });

      it('should show "Crear" as submit button text', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
        expect(button.textContent?.trim()).toContain('Crear');
      });

      it('should disable submit when form is invalid', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
        expect(button.disabled).toBeTrue();
      });

      it('should show "Guardando..." when loading', () => {
        component.form.patchValue({ name: 'New Game' });
        component.loading = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
        expect(button.textContent?.trim()).toContain('Guardando...');
      });

      it('should have a cancel link to /videogames', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const link = compiled.querySelector('a[routerLink="/videogames"]');
        expect(link).toBeTruthy();
        expect(link?.textContent).toContain('Cancelar');
      });
    });
  });

  describe('edit mode', () => {
    beforeEach(async () => {
      videogameServiceSpy = jasmine.createSpyObj('VideogameService', ['create', 'getById', 'update']);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);
      snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

      videogameServiceSpy.getById.and.returnValue(of(mockGameResponse));

      await TestBed.configureTestingModule({
        imports: [FormComponent, BrowserAnimationsModule],
        providers: [
          { provide: VideogameService, useValue: videogameServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: createRoute({ id: '1' }) }
        ]
      }).compileComponents();

      TestBed.overrideProvider(MatSnackBar, { useValue: snackBarSpy });

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be in edit mode (isEdit = true)', () => {
      expect(component.isEdit).toBeTrue();
    });

    it('should call getById on init', () => {
      expect(videogameServiceSpy.getById).toHaveBeenCalledWith(1);
    });

    it('should populate form with game data', () => {
      expect(component.form.get('name')?.value).toBe('Existing Game');
      expect(component.form.get('synopsis')?.value).toBe('Existing synopsis');
      expect(component.form.get('coverUrl')?.value).toBe('http://example.com/cover.jpg');
      expect(component.form.get('website')?.value).toBe('http://example.com');
      expect(component.form.get('releaseDate')?.value).toBe('2024-01-01');
    });

    it('should show "Editar Videojuego" as title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Editar Videojuego');
    });

    it('should show "Actualizar" as submit button text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.textContent?.trim()).toContain('Actualizar');
    });

    it('should call videogameService.update on submit', fakeAsync(() => {
      videogameServiceSpy.update.and.returnValue(of(mockGameResponse));
      component.onSubmit();
      tick();
      expect(videogameServiceSpy.update).toHaveBeenCalledWith(1, jasmine.any(Object));
    }));

    it('should navigate to /videogames on update success', fakeAsync(() => {
      videogameServiceSpy.update.and.returnValue(of(mockGameResponse));
      component.onSubmit();
      tick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/videogames']);
    }));

    it('should show "Actualizado" snackbar on update success', fakeAsync(() => {
      videogameServiceSpy.update.and.returnValue(of(mockGameResponse));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Actualizado', 'Cerrar', { duration: 3000 });
    }));
  });
});