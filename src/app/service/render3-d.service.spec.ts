import { TestBed } from '@angular/core/testing';

import { Render3DService } from './render3-d.service';

describe('Render3DService', () => {
  let service: Render3DService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Render3DService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
