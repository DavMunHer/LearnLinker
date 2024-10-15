import { TestBed } from '@angular/core/testing';

import { ProjectsHttpService } from './projects-http.service';

describe('ProjectsHttpService', () => {
  let service: ProjectsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
