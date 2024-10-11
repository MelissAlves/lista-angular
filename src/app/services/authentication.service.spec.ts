import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { Login } from '../models/login';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  const apiLogin = 'http://localhost:5000/usuarios';

  const mockUser: Login = {
    id: 1,
    email: 'test@test.com',
    password: 'password123',
    name: 'Test User',
    token: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user (registrar)', () => {
    service.registrar(mockUser).subscribe((response) => {
      expect(response).toEqual(mockUser);
      expect(mockUser.token).toBeTruthy();
    });

    const req = httpMock.expectOne(apiLogin);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should log in a user successfully (login)', () => {
    const mockResponse = [mockUser];
    service.login(mockUser.email, mockUser.password).subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeTrue();
      expect(sessionStorage.getItem('auth-token')).toBeTruthy();
      expect(sessionStorage.getItem('user-name')).toBe(mockUser.name);
    });

    const req = httpMock.expectOne(`${apiLogin}?email=${mockUser.email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return false if login credentials are incorrect', () => {
    const mockResponse = [{ ...mockUser, password: 'wrongpassword' }];
    service.login(mockUser.email, 'incorrectpassword').subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeFalse();
      expect(sessionStorage.getItem('auth-token')).toBeNull();
    });

    const req = httpMock.expectOne(`${apiLogin}?email=${mockUser.email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should log out the user (logout)', () => {
    sessionStorage.setItem('auth-token', '12345');
    sessionStorage.setItem('user-name', 'Test User');

    service.logout();

    expect(sessionStorage.getItem('auth-token')).toBeNull();
    expect(sessionStorage.getItem('user-name')).toBeNull();
  });

  it('should get logged-in user name (obterUsuarioLogado)', () => {
    sessionStorage.setItem('user-name', 'Test User');
    const userName = service.obterUsuarioLogado();
    expect(userName).toBe('Test User');
  });

  it('should get all users (getUsuarios)', () => {
    const mockUsers: Login[] = [mockUser, { ...mockUser, id: 2, name: 'Other User' }];

    service.getUsuarios().subscribe((response) => {
      expect(response.length).toBe(2);
      expect(response).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiLogin);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
