import { TestBed } from '@angular/core/testing';

import { MultiBackendService } from './multi-backend.service';

describe('MultiBackendService', () => {
  let service: MultiBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
