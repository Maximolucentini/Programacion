import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Footer } from '../../componentes/footer/footer';
import { PanelRol, AccionRol } from '../../componentes/panel-rol/panel-rol';

@Component({
  selector: 'app-panel',
  imports: [CommonModule, PanelRol, Footer],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel implements OnInit {
  private route = inject(ActivatedRoute);

  // ⬇️ tu profe: ver = true (admin), ver = false (empleado)
  ver: boolean = true;

  acciones: AccionRol[] = [];

  ngOnInit(): void {
    // 1) Si el router te pasa un flag en data (ver abajo en app.routes.ts)
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

    

    // Acciones según rol
    this.acciones = this.ver
      // ADMIN (ver=true)
      ? [
          { label: 'Gestión de menú',      link: '/menu-admin' },
          { label: 'Historial de pedidos', link: '/historial-admin' },
          { label: 'Gestión de usuarios',  link: '/usuarios-admin' },
          { label: 'Gestión promociones',  link: '/promos-admin' },
        ]
      // EMPLEADO (ver=false)
      : [
          { label: 'Estado de pedidos',          link: '/estado-pedido-empleado' },
          { label: 'Validar cuentas de cliente', link: '/empleado-validar' },
          { label: 'Verificar stock',            link: '/empleado-stock' },
          { label: 'Cargar pedido',              link: '/empleado-cargar' },
        ];
  }
}
