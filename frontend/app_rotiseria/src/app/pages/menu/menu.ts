import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-menu',
  imports: [Navbar, Footer],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {constructor(private router: Router) {}

realizarPedido() {
  this.router.navigate(['/pedido-exito']);
}}
