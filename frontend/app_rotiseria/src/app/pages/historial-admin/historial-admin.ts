import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PedidosService } from '../../services/pedidos';
import { Order } from '../../interfaces/order';

@Component({
  selector: 'app-historial-admin',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './historial-admin.html',
  styleUrl: './historial-admin.css'
})
export class HistorialAdmin implements OnInit {
  private pedidosService = inject(PedidosService);

  pedidos: Order[] = [];
  loading = false;
  error: string | null = null;

  // filtro de orden
  sortBy: 'created_at_desc' | 'created_at_asc' | 'total_desc' | 'total_asc' =
    'created_at_desc';
  
  cancelandoId: number | null = null;

    // 🔹 Paginación
  itemsPerPage = 5;      // cantidad de pedidos por página
  currentPage = 1;        // página actual

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pedidos.length / this.itemsPerPage));
  }

  get paginatedPedidos(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.pedidos.slice(start, start + this.itemsPerPage);
  }


  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.loading = true;
    this.error = null;

    this.pedidosService
      .list({
        sort_by: this.sortBy,
        page: 1,        
        per_page: 1000, 
      })
      .subscribe({
        next: (resp: { pedidos: Order[] }) => {
          this.pedidos = resp.pedidos ?? [];
          this.currentPage = 1; 
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando pedidos', err);
          this.error =
            err?.error?.message ||
            err?.error?.error ||
            'No se pudieron cargar los pedidos.';
          this.loading = false;
        },
      });
  }

  
  onSortChange(): void {
    this.currentPage = 1;
    this.cargarPedidos();
  }
  cancelarPedido(p: Order): void {
    if (!p?.id) return;

    if (p.status === 'cancelado') return;

    const ok = confirm(`¿Cancelar el pedido #${p.id}?`);
    if (!ok) return;

    this.cancelandoId = p.id;

    this.pedidosService.updateEstado(p.id, 'cancelado').subscribe({
      next: (resp: any) => {
        
        const nuevo = resp?.pedido?.status ?? 'cancelado';
        p.status = nuevo;

        this.cancelandoId = null;
      },
      error: (err) => {
        console.error('Error cancelando pedido', err);
        this.cancelandoId = null;
        alert(err?.error?.message || 'No se pudo cancelar el pedido.');
      }
    });
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }


  formatFecha(fecha: string): string {
    if (!fecha) return '';

    
    const [datePart, timePart] = fecha.split(' ');
    if (!datePart) return fecha;

    const [year, month, day] = datePart.split('-').map(Number);
    let hora = '';

    if (timePart) {
      const [h, m] = timePart.split(':');
      hora = `${h}:${m}`;
    }

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year} ${hora}`;
    }

    return fecha;
  }
}

