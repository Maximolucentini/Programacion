import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-pedido-empleado',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './estado-pedido-empleado.html',
  styleUrl: './estado-pedido-empleado.css'
})
export class EstadoPedidoEmpleado {

}
