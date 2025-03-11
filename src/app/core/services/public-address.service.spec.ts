import { TestBed } from '@angular/core/testing';

import { PublicAddressService } from './public-address.service';

describe('PublicAddressService', () => {
  let service: PublicAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
