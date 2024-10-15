import { TestBed } from '@angular/core/testing';

import { UsersHttpService } from './users-http.service';

describe('UsersHttpServiceService', () => {
  let service: UsersHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
