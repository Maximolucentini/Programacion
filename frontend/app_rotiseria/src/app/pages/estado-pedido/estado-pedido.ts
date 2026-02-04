import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <- para ngModel
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { PedidosService } from '../../services/pedidos';
import { Order, OrderStatus } from '../../interfaces/order';

@Component({
  selector: 'app-estado-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './estado-pedido.html',
  styleUrl: './estado-pedido.css'
})
export class EstadoPedido implements OnInit {
  private route = inject(ActivatedRoute);
  private pedidosService = inject(PedidosService);
  private router = inject(Router);

  pedidos: Order[] = [];
  
  ver = false;

  
  loading = signal<boolean>(true);
  error = signal<string>('');
  orders = signal<Order[]>([]);

  
  statusFilter = signal<string>('');

  
  sortBy = signal<'created_at_desc' | 'created_at_asc' | 'total_desc' | 'total_asc'>('created_at_desc');

  // paginación
  page = signal<number>(1);
  readonly perPage = 10; 

  ngOnInit(): void {
    
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

    
    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    else if (qp === 'false' || qp === '0') this.ver = false;

    this.cargar();
  }

  // Cargar pedidos desde el backend con los filtros actuales
  cargar() {
    this.loading.set(true);
    this.error.set('');

    this.pedidosService.list({
      sort_by: this.sortBy(),
      page: this.page(),
      per_page: this.perPage,
      status: (this.statusFilter() as OrderStatus) || undefined,
    }).subscribe({
      next: (res) => {
        this.orders.set(res.pedidos || []);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message || 'Error cargando pedidos');
        this.loading.set(false);
      }
    });
  }

  
  irActualizar(idPedido: number) {
    this.router.navigate(
      ['/empleado-actualizar-estado'],
      { queryParams: { id: idPedido } }
    );
  }

  
  irACalificar(pedido: Order): void {
    
    if (pedido.status !== 'entregado') return;

    this.router.navigate(['/calificar'], {
      queryParams: {
        pedido_id: pedido.id
      }
    });
  }  

  volver() {
    
    if (this.ver) this.router.navigate(['/empleado']);
    else this.router.navigate(['/menu']);

    
  }

  // handlers de filtrado / orden / paginación 

  onChangeStatus() {
    
    this.page.set(1);
    this.cargar();
  }

  onChangeSort() {
    this.page.set(1);
    this.cargar();
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.cargar();
    }
  }

  nextPage() {
    
    if (this.orders().length === this.perPage) {
      this.page.set(this.page() + 1);
      this.cargar();
    }
  }

  
  canPrev(): boolean {
    return this.page() > 1;
  }

  
  canNext(): boolean {
    
    return this.orders().length === this.perPage;
  }
}

