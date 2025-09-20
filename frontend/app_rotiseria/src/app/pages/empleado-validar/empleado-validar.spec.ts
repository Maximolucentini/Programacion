import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoValidar } from './empleado-validar';

describe('EmpleadoValidar', () => {
  let component: EmpleadoValidar;
  let fixture: ComponentFixture<EmpleadoValidar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoValidar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoValidar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
