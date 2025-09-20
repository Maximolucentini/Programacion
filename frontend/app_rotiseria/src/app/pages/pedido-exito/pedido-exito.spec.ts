import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoExito } from './pedido-exito';

describe('PedidoExito', () => {
  let component: PedidoExito;
  let fixture: ComponentFixture<PedidoExito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoExito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoExito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
