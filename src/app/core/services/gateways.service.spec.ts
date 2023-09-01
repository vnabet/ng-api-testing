import { TestBed } from '@angular/core/testing';

import { GatewaysService } from './gateways.service';
import { ENVIRONMENT } from '../tokens';

describe('GatewaysService', () => {
  let service: GatewaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ENVIRONMENT, useValue:['1','2','3'] }
      ]
    });
    service = TestBed.inject(GatewaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
