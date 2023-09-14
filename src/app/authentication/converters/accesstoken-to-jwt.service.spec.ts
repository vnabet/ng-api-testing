import { TestBed } from '@angular/core/testing';

import { AccesstokenToJWTService } from './accesstoken-to-jwt.service';

describe('AccesstokenToJWTService', () => {
  let service: AccesstokenToJWTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesstokenToJWTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
