import { TestBed } from '@angular/core/testing';
import { Bk } from './bk';

describe('Bk', () => {
  let service: Bk;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bk);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
