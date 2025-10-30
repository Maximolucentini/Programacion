import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Footer } from '../../componentes/footer/footer';
import { Navbar } from '../../componentes/navbar/navbar';

@Component({
  selector: 'app-calificar',
  standalone: true,
  imports: [CommonModule,Footer,Navbar],
  templateUrl: './calificar.html',
  styleUrl: './calificar.css'
})
export class Calificar implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pedidoId = signal<number | null>(null);

  comida = signal<number>(0);
  atencion = signal<number>(0);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.pedidoId.set(id);
    }
  }

  setComida(n: number) {
    this.comida.set(n);
  }

  setAtencion(n: number) {
    this.atencion.set(n);
  }

  finalizar() {
    // más adelante posteamos al backend
    console.log('Enviar calificación:', {
      pedidoId: this.pedidoId(),
      comida: this.comida(),
      atencion: this.atencion(),
    });

    // después de guardar, lo lógico es mandarlo a Mis pedidos
    this.router.navigate(['/estado-pedido'], { queryParams: { ver: false } });
  }

  // 👇 NUEVO
  volver() {
    // opción A: ir directo a Mis pedidos del usuario
    this.router.navigate(['/estado-pedido'], { queryParams: { ver: false } });

    // si querés comportamiento "tal cual pantalla anterior" en vez de ruta fija:
    // window.history.back();
  }
}

