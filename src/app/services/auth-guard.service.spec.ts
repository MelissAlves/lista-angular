import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth-guard.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should allow activation when auth token exists', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mockToken');
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should deny activation and navigate to login when auth token does not exist', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    const navigateSpy = spyOn(router, 'navigate');
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
