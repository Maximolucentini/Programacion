import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormCard } from './product-form-card';

describe('ProductFormCard', () => {
  let component: ProductFormCard;
  let fixture: ComponentFixture<ProductFormCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
