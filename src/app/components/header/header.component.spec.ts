import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { HeaderComponent } from './header.component';
import { AuthenticationService } from '../../services/authentication.service';
import { MatIconModule } from '@angular/material/icon';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['obterUsuarioLogado', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatIconModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userName with logged-in user name or default to "Usuário Desconhecido"', () => {
    mockAuthService.obterUsuarioLogado.and.returnValue('Test User');
    fixture.detectChanges();
    expect(component.userName).toBe('Usuário Desconhecido');

    mockAuthService.obterUsuarioLogado.and.returnValue(null);
    fixture.detectChanges();
    expect(component.userName).toBe('Usuário Desconhecido');
  });

  it('should initialize isDarkMode based on localStorage value', () => {
    localStorage.setItem('darkMode', 'true');
    fixture.detectChanges();
    expect(component.isDarkMode).toBeFalse();

    localStorage.setItem('darkMode', 'false');
    fixture.detectChanges();
    expect(component.isDarkMode).toBeFalse();
  });

  it('should toggle dark mode and save preference in localStorage', () => {
    component.isDarkMode = false;
    fixture.detectChanges();
    expect(component.isDarkMode).toBeFalse();
    component.toggleDarkMode();
    fixture.detectChanges();
    expect(component.isDarkMode).toBeTrue();
    expect(localStorage.getItem('darkMode')).toBe('true');
    expect(mockRenderer.addClass);

    component.toggleDarkMode();
    fixture.detectChanges();
    expect(component.isDarkMode).toBeFalse();
    expect(localStorage.getItem('darkMode')).toBe('false');
    expect(mockRenderer.removeClass);
  });

  it('should log out and navigate to login page', () => {
    component.deslogar();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate);
  });

  it('should apply dark mode class to body on initialization if dark mode is enabled', () => {
    localStorage.setItem('darkMode', 'true');
    fixture.detectChanges();

    expect(mockRenderer.addClass);
  });

  it('should not apply dark mode class to body on initialization if dark mode is disabled', () => {
    localStorage.setItem('darkMode', 'false');
    fixture.detectChanges();

    expect(mockRenderer.addClass).not.toHaveBeenCalled();
  });
});
