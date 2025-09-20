import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoActualizarEstado } from './empleado-actualizar-estado';

describe('EmpleadoActualizarEstado', () => {
  let component: EmpleadoActualizarEstado;
  let fixture: ComponentFixture<EmpleadoActualizarEstado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoActualizarEstado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoActualizarEstado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
