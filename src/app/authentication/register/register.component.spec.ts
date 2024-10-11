import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Login } from '../../models/login';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthenticationService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        AuthenticationService,
        {
          provide: Router,
          useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') }
        },
        {
          provide: MatSnackBar,
          useValue: { open: jasmine.createSpy('open') }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form as invalid when the fields are empty', () => {
    component.submetido = true;
    fixture.detectChanges();

    expect(component.formulario.invalid).toBeTrue();
    expect(component.formulario.get('name')?.errors?.['required']).toBeTruthy();
    expect(component.formulario.get('email')?.errors?.['required']).toBeTruthy();
    expect(component.formulario.get('password')?.errors?.['required']).toBeTruthy();
    expect(component.formulario.get('passwordConfirm')?.errors?.['required']).toBeTruthy();
  });

  it('should validate the email as invalid when the format is not correct', () => {
    component.formulario.get('email')?.setValue('emailinvalido');
    fixture.detectChanges();

    expect(component.formulario.get('email')?.errors?.['email']).toBeTruthy();
  });

  it('should validate the form as valid when all fields are filled in correctly', () => {
    component.formulario.get('name')?.setValue('Teste 1');
    component.formulario.get('email')?.setValue('teste1@gmail.com');
    component.formulario.get('password')?.setValue('Senha@123');
    component.formulario.get('passwordConfirm')?.setValue('Senha@123');
    fixture.detectChanges();

    expect(component.formulario.valid).toBeTrue();
  });

  it('should call the `register` method and redirect to login if successful', () => {
    const mockUser: Login = {
      id: 1,
      name: 'Teste 1',
      email: 'teste1@gmail.com',
      password: 'Senha@123',
      token: 'mockToken123'
    };

    const spyRegistrar = spyOn(authService, 'registrar').and.returnValue(of(mockUser));

    component.formulario.get('name')?.setValue('Teste 1');
    component.formulario.get('email')?.setValue('teste1@gmail.com');
    component.formulario.get('password')?.setValue('Senha@123');
    component.formulario.get('passwordConfirm')?.setValue('Senha@123');

    component.registrar();

    expect(spyRegistrar).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });


  it('should display an error message if the register service call fails', () => {
    const spyRegistrar = spyOn(authService, 'registrar').and.returnValue(throwError(() => new Error('Erro')));

    component.formulario.get('name')?.setValue('Teste 1');
    component.formulario.get('email')?.setValue('teste1@gmail.com');
    component.formulario.get('password')?.setValue('Senha@123');
    component.formulario.get('passwordConfirm')?.setValue('Senha@123');

    component.registrar();

    expect(spyRegistrar).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Erro ao registrar usuário. Tente novamente!', 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  });
});
