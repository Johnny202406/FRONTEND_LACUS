import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonProductDetail } from './skeleton-product-detail';

describe('SkeletonProductDetail', () => {
  let component: SkeletonProductDetail;
  let fixture: ComponentFixture<SkeletonProductDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonProductDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
