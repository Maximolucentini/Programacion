import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { ProductCard, ProductCardModel } from '../../componentes/product-card/product-card';

import { ProductosService } from '../../services/productos';
import { PedidosService } from '../../services/pedidos';
import { Product } from '../../interfaces/Product';
import { PagedResponse } from '../../interfaces/Paged';
import { decodeJwtPayload } from '../../utils/jwt';
import { ValoracionesService } from '../../services/valoraciones';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer, ProductCard],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class Menu implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productosSrv = inject(ProductosService);
  private pedidosSrv = inject(PedidosService);
  private valoracionesSrv = inject(ValoracionesService);

  private mostSoldProductId: number | null = null;  
  

  // ver = false → cliente   |  ver = true → admin
  ver = false;

  loading = false;
  error: string | null = null;

  // paginación
  page = 1;
  per_page = 9;
  pages = 1;
  total = 0;

  // filtros
  filtros = {
    name: '',
    price_min: null as number | null,
    price_max: null as number | null,
    stock_min: 0,
    estado: 'activo' as 'activo' | 'suspendido' | '',
    sort_by: 'most_sold' as
      | 'most_sold'
      | 'best_rated'
      | 'name_asc'
      | 'name_desc'
      | 'price_asc'
      | 'price_desc'
      | 'stock_asc'
      | 'stock_desc',
  };


  products: ProductCardModel[] = [];

  ngOnInit(): void {
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') {
      this.ver = dataFlag;
    }

    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    if (qp === 'false' || qp === '0') this.ver = false;

    this.cargar();
    this.cargarMasVendido(); 
  }

  // =====================  filtros / carga =====================

  private toNumberOrUndefined(v: any): number | undefined {
    if (v === null || v === undefined || v === '') return undefined;
    const n = typeof v === 'string' ? Number(v) : v;
    return Number.isFinite(n) ? n : undefined;
  }

  private buildParams() {
    const f = this.filtros;
    return {
      page: this.page,
      per_page: this.per_page,
      name: f.name?.trim() || undefined,
      price_min: this.toNumberOrUndefined(f.price_min),
      price_max: this.toNumberOrUndefined(f.price_max),
      stock_min: f.stock_min ? 1 : undefined,
      estado: f.estado || undefined,
      sort_by: f.sort_by,
    };
  }
    // ===================== producto más vendido =====================

    private cargarMasVendido(): void {
      this.productosSrv
        .getProductos({ page: 1, per_page: 1, sort_by: 'most_sold' })
        .subscribe({
          next: (resp: PagedResponse<Product>) => {
            const top = resp.items && resp.items.length ? resp.items[0] : null;
            this.mostSoldProductId = top ? top.id : null;
            this.actualizarFlagMasVendido();
          },
          error: (e) => {
            console.error('Error obteniendo producto más vendido', e);
            this.mostSoldProductId = null;
          },
        });
    }
  
    private actualizarFlagMasVendido(): void {
      if (!this.mostSoldProductId || !this.products?.length) return;
  
      this.products = this.products.map((p) => ({
        ...p,
        isBestSeller: p.id === this.mostSoldProductId,
      }));
    }
  

    cargar(): void {
      this.loading = true;
      this.error = null;
  
      this.productosSrv.getProductos(this.buildParams()).subscribe({
        next: (resp: PagedResponse<Product>) => {
          this.pages = resp.pages || 1;
          this.total = resp.total || 0;
  
          const productos = resp.items || [];
  
          if (!productos.length) {
            this.products = [];
            this.loading = false;
            return;
          }
  
          // Pedimos promedio de valoraciones de cada producto
          const requests = productos.map((p) =>
            this.valoracionesSrv.obtenerValoraciones(p.id)
          );
  
          forkJoin(requests).subscribe({
            next: (respuestas: any[]) => {
              this.products = productos.map((p, index) => {
                const res = respuestas[index] || {};
                const promedio =
                  typeof res?.promedio === 'number' ? res.promedio : undefined;
  
                return this.mapToCard(p, promedio);
              });
  
              this.actualizarFlagMasVendido();
              this.loading = false;
            },
            error: (e) => {
              console.error('Error cargando valoraciones', e);
              
              this.products = productos.map((p) => this.mapToCard(p));
              this.actualizarFlagMasVendido();
              this.loading = false;
            },
          });
        },
        error: (e) => {
          console.error('Error /productos', e);
          this.error = 'No se pudo cargar el menú.';
          this.loading = false;
        },
      });
    }
  

  // ===================== imágenes de productos =====================

  private getImageForProduct(p: Product): string {
    const name = (p.name || '').toLowerCase();

    if (name.includes('soja')) {
      return 'assets/mila-soja.jpg';
    }
    if (name.includes('carne')) {
      return 'assets/mila-carne.jpg';
    }
    if (name.includes('pollo')) {
      return 'assets/mila-pollo.jpg';
    }
    if (name.includes('pescado')) {
      return 'assets/mila-pescado.jpg';
    }

    return 'assets/bigburger.jpg';
  }

  private mapToCard = (p: Product, promedio?: number): ProductCardModel => ({
    id: p.id,
    title: p.name,
    description: p.description || '',
    price: Number(p.price),
    imageUrl: this.getImageForProduct(p),
    rating: promedio,                      
    prepMinutes: 15,
    spiceLevel: null,
    available: p.estado === 'activo' && p.stock > 0,
    stock: p.stock,
    quantity: 0,
    isBestSeller: this.mostSoldProductId === p.id,  
  });


  aplicarFiltros(): void {
    this.page = 1;
    this.cargar();
  }

  limpiarFiltros(): void {
    this.filtros = {
      name: '',
      price_min: null,
      price_max: null,
      stock_min: 0,
      estado: 'activo',
      sort_by: 'most_sold',
    };
    this.page = 1;
    this.cargar();
  }

  cambiarPagina(delta: number): void {
    const next = this.page + delta;
    if (next >= 1 && next <= this.pages) {
      this.page = next;
      this.cargar();
    }
  }

  // ===================== cliente: hacer pedido =====================

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    const rawId = (payload as any)?.id ?? (payload as any)?.sub;
    if (rawId === undefined || rawId === null) return null;

    const n = typeof rawId === 'string' ? Number(rawId) : rawId;
    return Number.isFinite(n) ? n : null;
  }

  hayAlMenosUnProductoSeleccionado(): boolean {
    return this.products.some((p) => (p.quantity || 0) > 0);
  }

  pedirYa(): void {
    
    if (this.ver) return;

    const userId = this.getUserIdFromToken();
    if (!userId) {
      alert('Tenés que iniciar sesión para hacer un pedido.');
      return;
    }

    const seleccionados = this.products.filter((p) => (p.quantity || 0) > 0);

    if (seleccionados.length === 0) {
      alert('No seleccionaste ninguna hamburguesa.');
      return;
    }

    const sinStock = seleccionados.filter(
      (p) => typeof p.stock === 'number' && p.stock >= 0 && (p.quantity || 0) > p.stock,
    );

    if (sinStock.length > 0) {
      alert(
        'No hay stock suficiente para: ' +
          sinStock.map((p) => p.title).join(', '),
      );
      return;
    }

    const body = {
      user_id: userId,
      status: 'pendiente',
      productos: seleccionados.map((p) => ({
        product_id: p.id,
        quantity: p.quantity,
      })),
    };

    this.loading = true;
    this.error = null;

    this.pedidosSrv.create(body).subscribe({
      next: () => {
        this.loading = false;
        alert('Pedido realizado con éxito 🥙🍟');
        this.router.navigate(['/estado-pedido']);
      },
      error: (e) => {
        this.loading = false;
        console.error('Error creando pedido', e);
        const msg =
          e?.error?.message || e?.error?.msg || e?.error?.error || 'No se pudo crear el pedido.';
        alert(msg);
      },
    });
  }

  // ===================== admin: agregar / eliminar / activar / desactivar =====================

  irAgregarProducto(): void {
    if (!this.ver) return;
    
    this.router.navigate(['/agregar-producto']);
  }

  // eliminar producto
  onRemove(p: ProductCardModel): void {
    if (!this.ver) return;

    if (!confirm(`¿Seguro que querés eliminar el producto "${p.title}"?`)) {
      return;
    }

    this.loading = true;

    this.productosSrv.eliminarProducto(p.id).subscribe({
      next: () => {
        this.loading = false;
        this.cargar(); 
      },
      error: (e) => {
        this.loading = false;
        console.error('Error eliminando producto', e);
        const msg =
          e?.error?.message || e?.error?.error || 'No se pudo eliminar el producto.';
        alert(msg);
      },
    });
  }

  // activar / desactivar producto (cambiar campo estado)
  onToggle(p: ProductCardModel): void {
    if (!this.ver) return;

    const estadoActual = p.available ? 'activo' : 'suspendido';
    const nuevoEstado = estadoActual === 'activo' ? 'suspendido' : 'activo';

    const body: Partial<Product> = {
      name: p.title,
      description: p.description,
      price: p.price,
      stock: p.stock ?? 0,
      estado: nuevoEstado,
    };

    this.loading = true;

    this.productosSrv.actualizarProducto(p.id, body).subscribe({
      next: () => {
        this.loading = false;
        this.cargar(); 
      },
      error: (e) => {
        this.loading = false;
        console.error('Error cambiando estado', e);
        const msg =
          e?.error?.message || e?.error?.error || 'No se pudo cambiar el estado del producto.';
        alert(msg);
      },
    });
  }

  
  addToCart(_p: ProductCardModel) {}
  onEdit(_p: ProductCardModel) {}
}
