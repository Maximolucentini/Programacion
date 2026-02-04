import { Component, OnInit, inject } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductosService } from '../../services/productos';
import { Product } from '../../interfaces/Product';
import { PagedResponse } from '../../interfaces/Paged';

interface StockItem {
  product: Product;
  nuevoStock: number;
}

@Component({
  selector: 'app-empleado-stock',
  imports: [Footer, RouterLink, CommonModule],
  templateUrl: './empleado-stock.html',
  styleUrl: './empleado-stock.css'
})
export class EmpleadoStock implements OnInit {
  private productosSrv = inject(ProductosService);

  items: StockItem[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = null;

    this.productosSrv
      .getProductos({ page: 1, per_page: 1000 })
      .subscribe({
        next: (resp: PagedResponse<Product>) => {
          const productos = resp.items ?? [];
          this.items = productos.map((p) => ({
            product: p,
            nuevoStock: p.stock,
          }));
          this.loading = false;
        },
        error: (e) => {
          console.error('Error cargando productos', e);
          this.error =
            e?.error?.message ||
            e?.error?.error ||
            'No se pudo cargar el stock de los productos.';
          this.loading = false;
        },
      });
  }

  incrementar(item: StockItem): void {
    item.nuevoStock++;
  }

  decrementar(item: StockItem): void {
    if (item.nuevoStock > 0) {
      item.nuevoStock--;
    }
  }

  guardar(item: StockItem): void {
    if (item.nuevoStock === item.product.stock) {
      alert('El stock no cambió.');
      return;
    }

    const nuevoStock = item.nuevoStock;

    this.productosSrv
      .actualizarProducto(item.product.id, { stock: nuevoStock })
      .subscribe({
        next: (resp: any) => {
          
          if (resp && resp.stock !== undefined) {
            item.product.stock = resp.stock;
          } else {
            item.product.stock = nuevoStock;
          }
          if (resp && resp.estado) {
            item.product.estado = resp.estado;
          }
          alert('Stock actualizado correctamente.');
        },
        error: (e) => {
          console.error('Error actualizando stock', e);
          const msg =
            e?.error?.message ||
            e?.error?.error ||
            'No se pudo actualizar el stock del producto.';
          alert(msg);
        },
      });
  }

  formatEstado(p: Product): string {
    if (!p?.estado) return '';
    if (p.estado === 'activo') return 'Activo';
    if (p.estado === 'suspendido') return 'Suspendido';
    return p.estado;
  }
}
