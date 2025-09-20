import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-pedido',
  imports: [Navbar,Footer,RouterLink,CommonModule],
  templateUrl: './estado-pedido.html',
  styleUrl: './estado-pedido.css'
})
export class EstadoPedido {

}
