import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPromo } from './agregar-promo';

describe('AgregarPromo', () => {
  let component: AgregarPromo;
  let fixture: ComponentFixture<AgregarPromo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarPromo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPromo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
