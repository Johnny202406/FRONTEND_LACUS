import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPublication } from './card-publication';

describe('CardPublication', () => {
  let component: CardPublication;
  let fixture: ComponentFixture<CardPublication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPublication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPublication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
