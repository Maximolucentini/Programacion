import { Component, OnInit, inject, signal } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos';
import { Order, OrderStatus } from '../../interfaces/order';

@Component({
  selector: 'app-empleado-actualizar-estado',
  standalone: true,
  imports: [Footer, RouterLink, CommonModule],
  templateUrl: './empleado-actualizar-estado.html',
  styleUrl: './empleado-actualizar-estado.css'
})
export class EmpleadoActualizarEstado implements OnInit {
  private pedidos = inject(PedidosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // ahora order es un signal para que podamos usar order() en el template
  order = signal<Order | null>(null);

  elegido = signal<OrderStatus>('pendiente');
  cargando = signal<boolean>(true);
  error = signal<string>('');
  guardando = signal<boolean>(false);
  ok = signal<string>('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!id) {
        this.error.set('Falta el id del pedido');
        this.cargando.set(false);
        return;
    }

    this.pedidos.get(id).subscribe({
      next: (resp: any) => {
        
        let pedido: any = null;

        if (resp && resp.id !== undefined && resp.status !== undefined) {
          
          pedido = resp;
        } else if (resp && resp.pedido) {
          pedido = resp.pedido;
        } else if (resp && resp.order) {
          pedido = resp.order;
        }

        if (!pedido) {
          // respuesta rara / inesperada
          this.error.set('Respuesta inesperada del backend');
          this.cargando.set(false);
          return;
        }

        // guardo el pedido en el signal
        this.order.set(pedido);

        // seteo el estado actual como seleccionado
        this.elegido.set(pedido.status as OrderStatus);

        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'No se pudo cargar el pedido');
        this.cargando.set(false);
      }
    });
  }

  seleccionar(s: OrderStatus) {
    this.elegido.set(s);
  }

  guardar() {
    const pedidoActual = this.order();
    if (!pedidoActual) return;

    this.guardando.set(true);
    this.ok.set('');
    this.error.set('');

    this.pedidos.updateEstado(pedidoActual.id, this.elegido()).subscribe({
      next: () => {
        this.ok.set('Estado actualizado');
        this.guardando.set(false);

        // volvemos al listado del empleado
        this.router.navigate(['/estado-pedido-empleado']);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'No se pudo actualizar');
        this.guardando.set(false);
      }
    });
  }
}
