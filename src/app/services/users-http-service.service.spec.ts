import { TestBed } from '@angular/core/testing';

import { UsersHttpServiceService } from './users-http-service.service';

describe('UsersHttpServiceService', () => {
  let service: UsersHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
