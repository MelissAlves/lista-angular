import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from '../authentication/login/login.component';
import { AuthenticationService } from '../services/authentication.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthenticationService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if the form is invalid', () => {
    component.formLogar.controls['email'].setValue('');
    component.formLogar.controls['password'].setValue('');
    component.logar();
    expect(component.submetido).toBeTrue();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should submit and navigate on successful login', () => {
    component.formLogar.controls['email'].setValue('teste@teste.com');
    component.formLogar.controls['password'].setValue('senha123');

    authService.login.and.returnValue(of(true)); // exemplo de login certo
    component.logar();

    expect(authService.login).toHaveBeenCalledWith('teste@teste.com', 'senha123');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/task');
  });

  it('should show error on unsuccessful login', () => {
    component.formLogar.controls['email'].setValue('teste@teste.com');
    component.formLogar.controls['password'].setValue('senha123');

    authService.login.and.returnValue(of(false)); // exemplo de login errado
    component.logar();

    expect(component.mensagemErro).toBe('Usuário ou password inválido');
  });
});
