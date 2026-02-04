import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Footer } from '../../componentes/footer/footer';
import { Navbar } from '../../componentes/navbar/navbar';
import { PedidosService } from '../../services/pedidos';
import { ValoracionesService } from '../../services/valoraciones';

interface ItemCalificacion {
  product_id: number;
  name: string;
  quantity: number;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-calificar',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar],
  templateUrl: './calificar.html',
  styleUrl: './calificar.css'
})
export class Calificar implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pedidosSrv = inject(PedidosService);
  private valoracionesSrv = inject(ValoracionesService);

  pedidoId: number | null = null;
  items: ItemCalificacion[] = [];

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    const snapshot = this.route.snapshot;

    const fromParams =
      snapshot.paramMap.get('pedidoId') ||
      snapshot.paramMap.get('id');

    const fromQuery =
      snapshot.queryParamMap.get('pedido_id') ||
      snapshot.queryParamMap.get('pedidoId') ||
      snapshot.queryParamMap.get('id');

    const idStr = fromParams ?? fromQuery;
    this.pedidoId = idStr ? Number(idStr) : null;

    if (!this.pedidoId) {
      this.error = 'No se encontró el pedido a calificar.';
      return;
    }

    this.cargarPedido();
  }

  private cargarPedido(): void {
    if (!this.pedidoId) return;
  
    this.loading = true;
    this.error = null;
  
    this.pedidosSrv.get(this.pedidoId).subscribe({
      next: (res: any) => {
        this.loading = false;
  
        
        const productos = res.products ?? [];
  
        this.items = productos.map((p: any) => {
          const productId = Number(p.product_id ?? p.id);
  
          return {
            product_id: productId,
            name: `Producto #${productId}`, 
            quantity: p.quantity ?? 1,
            rating: 0,
            comment: ''
          };
        });
      },
      error: (e) => {
        this.loading = false;
        console.error('Error cargando pedido', e);
        const msg =
          e?.error?.message ||
          e?.error?.msg ||
          e?.error?.error ||
          'No se pudieron cargar los productos del pedido.';
        this.error = msg;
      }
    });
  }
  

  setRating(item: ItemCalificacion, value: number): void {
    if (value < 1 || value > 5) return;
    item.rating = value;
  }

  finalizar(): void {
    if (!this.pedidoId) {
      alert('No se encontró el pedido a calificar.');
      return;
    }
    if (!this.items.length) {
      alert('Este pedido no tiene productos para calificar.');
      return;
    }

    const aCalificar = this.items.filter(
      i => i.rating > 0 || i.comment.trim() !== ''
    );

    if (!aCalificar.length) {
      alert('Calificá al menos un producto.');
      return;
    }

    this.loading = true;
    this.error = null;

    const peticiones = aCalificar.map(i =>
      this.valoracionesSrv.crearValoracion({
        product_id: i.product_id,
        score: i.rating || 5, // si no eligió estrellas pero dejó comentario: 5 por defecto
        comment: i.comment.trim() || undefined
      })
    );

    forkJoin(peticiones).subscribe({
      next: () => {
        this.loading = false;
        alert('¡Gracias por calificar tu pedido! ⭐');
        this.router.navigate(['/estado-pedido']);
      },
      error: (e) => {
        console.error('Error creando valoraciones', e);
        this.loading = false;
        const msg =
          e?.error?.message ||
          e?.error?.msg ||
          e?.error?.error ||
          'No se pudieron guardar las calificaciones.';
        this.error = msg;
        alert(msg);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/estado-pedido']);
  }
}


