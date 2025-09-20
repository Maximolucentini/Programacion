import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPromo } from './editar-promo';

describe('EditarPromo', () => {
  let component: EditarPromo;
  let fixture: ComponentFixture<EditarPromo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPromo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPromo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
