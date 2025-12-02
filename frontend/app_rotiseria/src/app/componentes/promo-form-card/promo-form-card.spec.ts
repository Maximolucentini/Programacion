import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoFormCard } from './promo-form-card';

describe('PromoFormCard', () => {
  let component: PromoFormCard;
  let fixture: ComponentFixture<PromoFormCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoFormCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoFormCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
