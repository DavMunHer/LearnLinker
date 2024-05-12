import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userRoleResolver } from './user-role.resolver';

describe('userRoleResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userRoleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
