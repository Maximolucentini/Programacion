import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { empleadoGuardGuard } from './empleado.guard-guard';

describe('empleadoGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => empleadoGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
