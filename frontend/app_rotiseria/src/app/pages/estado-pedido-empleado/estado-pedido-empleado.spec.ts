import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoPedidoEmpleado } from './estado-pedido-empleado';

describe('EstadoPedidoEmpleado', () => {
  let component: EstadoPedidoEmpleado;
  let fixture: ComponentFixture<EstadoPedidoEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoPedidoEmpleado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoPedidoEmpleado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
