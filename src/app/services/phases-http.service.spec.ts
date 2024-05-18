import { TestBed } from '@angular/core/testing';

import { PhasesHttpService } from './phases-http.service';

describe('PhasesHttpService', () => {
  let service: PhasesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhasesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
