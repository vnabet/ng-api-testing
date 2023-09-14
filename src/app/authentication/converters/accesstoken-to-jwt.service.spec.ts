import { TestBed } from '@angular/core/testing';

import { AccesstokenToJWTConverter } from './accesstoken-to-jwt.service';

describe('AccesstokenToJWTService', () => {
  let service: AccesstokenToJWTConverter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesstokenToJWTConverter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
