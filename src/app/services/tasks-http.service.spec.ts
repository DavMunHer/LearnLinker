import { TestBed } from '@angular/core/testing';

import { TasksHttpService } from './tasks-http.service';

describe('TasksHttpService', () => {
  let service: TasksHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
