import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { managerLeaderGuard } from './manager-leader.guard';

describe('managerLeaderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => managerLeaderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
