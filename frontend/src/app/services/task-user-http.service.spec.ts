import { TestBed } from '@angular/core/testing';

import { TaskUserHttpService } from './task-user-http.service';

describe('TaskUserHttpService', () => {
  let service: TaskUserHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskUserHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
