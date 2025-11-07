import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonCardProduct } from './skeleton-card-product';

describe('SkeletonCardProduct', () => {
  let component: SkeletonCardProduct;
  let fixture: ComponentFixture<SkeletonCardProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonCardProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
