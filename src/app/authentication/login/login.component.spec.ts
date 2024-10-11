import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

class MockAuthenticationService {
  login(email: string, password: string) {
    if (email === 'teste@gmail.com' && password === '123Teste@') {
      return of(true);
    }
    return of(false);
  }
}

class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Router, useClass: MockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.formLogar).toBeDefined();
    expect(component.formLogar.controls['email']).toBeTruthy();
    expect(component.formLogar.controls['password']).toBeTruthy();
  });

  it('should display "Required Field" error when fields are empty and form is submitted', () => {
    component.logar();
    fixture.detectChanges();

    const emailErrorMsg = fixture.nativeElement.querySelector('span');
    expect(emailErrorMsg.textContent).toContain('Campo obrigatório');
  });

  it('should show an error message when email or password are incorrect', () => {
    component.formLogar.controls['email'].setValue('teste@gmail.com');
    component.formLogar.controls['password'].setValue('123456');
    component.logar();
    fixture.detectChanges();

    expect(component.mensagemErro).toBe('Usuário ou password inválido');
  });

  it('should redirect to task page after successful login', () => {
    spyOn(router, 'navigateByUrl');
    component.formLogar.controls['email'].setValue('teste@gmail.com');
    component.formLogar.controls['password'].setValue('123Teste@');
    component.logar();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/task');
  });

  it('should redirect to registration page when clicking register', () => {
    spyOn(router, 'navigateByUrl');
    component.btnInscrever();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/register');
  });

  it('you should not submit the form if it is invalid', () => {
    component.formLogar.controls['email'].setValue('');
    component.formLogar.controls['password'].setValue('');
    component.logar();
    expect(component.formLogar.invalid).toBeTrue();
  });
});
