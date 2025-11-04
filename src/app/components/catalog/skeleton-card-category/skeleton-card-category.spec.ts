import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonCardCategory } from './skeleton-card-category';

describe('SkeletonCardCategory', () => {
  let component: SkeletonCardCategory;
  let fixture: ComponentFixture<SkeletonCardCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonCardCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
