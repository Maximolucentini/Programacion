import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pedido-exito',
  imports: [Navbar,RouterLink, CommonModule],
  templateUrl: './pedido-exito.html',
  styleUrl: './pedido-exito.css'
})
export class PedidoExito {
}
