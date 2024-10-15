import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userProjectsResolver } from './user-projects.resolver';
import { Project } from '../../interfaces/project';

describe('userProjectsResolver', () => {
  const executeResolver: ResolveFn<Project[]> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => userProjectsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
