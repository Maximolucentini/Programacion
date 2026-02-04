import { TestBed } from '@angular/core/testing';

import { Promos } from './promos';

describe('Promos', () => {
  let service: Promos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Promos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
