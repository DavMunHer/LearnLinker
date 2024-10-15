import { TestBed } from '@angular/core/testing';

import { ProjectUserHttpService } from './project-user-http.service';

describe('ProjectUserHttpService', () => {
  let service: ProjectUserHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectUserHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
