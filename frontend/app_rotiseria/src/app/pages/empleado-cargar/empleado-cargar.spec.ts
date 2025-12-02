import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoCargar } from './empleado-cargar';

describe('EmpleadoCargar', () => {
  let component: EmpleadoCargar;
  let fixture: ComponentFixture<EmpleadoCargar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoCargar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoCargar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
