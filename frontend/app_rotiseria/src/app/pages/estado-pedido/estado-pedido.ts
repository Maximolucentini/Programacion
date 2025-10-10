import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-estado-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar, Footer],
  templateUrl: './estado-pedido.html',
  styleUrl: './estado-pedido.css'
})
export class EstadoPedido implements OnInit {
  private route = inject(ActivatedRoute);

  // ver=false => Usuario (un estado); ver=true => Empleado (lista)
  ver: boolean = false;

  ngOnInit(): void {
    // 1) desde data de la ruta
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

    // 2) override opcional por query ?ver=true|false|1|0
    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    else if (qp === 'false' || qp === '0') this.ver = false;
  }

  // Mock de pedidos (solo para vista empleado)
  orders = [
    { id: 1947034, fecha: '07-12-2019', qty: 1, total: 20 },
    { id: 1947035, fecha: '07-12-2019', qty: 2, total: 40 },
  ];
}
