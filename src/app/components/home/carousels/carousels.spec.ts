import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carousels } from './carousels';

describe('Carousels', () => {
  let component: Carousels;
  let fixture: ComponentFixture<Carousels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carousels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carousels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
