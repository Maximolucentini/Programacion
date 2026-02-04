import { Component, OnInit, inject } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductosService } from '../../services/productos';
import { PedidosService } from '../../services/pedidos';
import { Product } from '../../interfaces/Product';
import { PagedResponse } from '../../interfaces/Paged';

interface PedidoItem {
  productId: number | null;
  quantity: number;
}

@Component({
  selector: 'app-empleado-cargar',
  imports: [Footer, RouterLink, CommonModule, FormsModule],
  templateUrl: './empleado-cargar.html',
  styleUrl: './empleado-cargar.css'
})
export class EmpleadoCargar implements OnInit {
  private productosSrv = inject(ProductosService);
  private pedidosSrv = inject(PedidosService);

  productos: Product[] = [];
  items: PedidoItem[] = [];

  clienteId: number | null = null;

  loadingProductos = false;
  enviando = false;
  error: string | null = null;

  totalCreado: number | null = null;
  pedidoIdCreado: number | null = null;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loadingProductos = true;
    this.error = null;

    this.productosSrv
      .getProductos({ estado: 'activo', per_page: 1000 })
      .subscribe({
        next: (resp: PagedResponse<Product>) => {
          this.productos = resp.items ?? [];
          this.loadingProductos = false;

          if (this.items.length === 0) {
            this.agregarItem();
          }
        },
        error: (e: any) => {
          console.error('Error cargando productos', e);
          this.loadingProductos = false;
          this.error =
            e?.error?.message ||
            e?.error?.error ||
            'No se pudieron cargar los productos.';
        },
      });
  }

  agregarItem(): void {
    this.items.push({ productId: null, quantity: 1 });
  }

  eliminarItem(idx: number): void {
    this.items.splice(idx, 1);
    if (this.items.length === 0) {
      this.agregarItem();
    }
  }

  incrementar(item: PedidoItem): void {
    item.quantity++;
  }

  decrementar(item: PedidoItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  onSubmit(): void {
    this.totalCreado = null;
    this.pedidoIdCreado = null;

    const userId = Number(this.clienteId);
    if (!Number.isInteger(userId) || userId <= 0) {
      alert('Ingresá un ID de cliente válido.');
      return;
    }

    const productosSeleccionados = this.items.filter(
      (it) => it.productId != null && it.quantity > 0
    );

    if (productosSeleccionados.length === 0) {
      alert('Agregá al menos un producto con cantidad mayor a 0.');
      return;
    }

    const body = {
      user_id: userId,
      status: 'pendiente' as const,
      productos: productosSeleccionados.map((it) => ({
        product_id: Number(it.productId),
        quantity: it.quantity,
      })),
    };

    this.enviando = true;
    this.error = null;

    this.pedidosSrv.create(body).subscribe({
      next: (resp: any) => {
        this.enviando = false;

        const totalRaw = resp?.total_amount ?? resp?.total ?? null;
        let total: number | null = null;
        if (typeof totalRaw === 'number') {
          total = totalRaw;
        } else if (typeof totalRaw === 'string' && totalRaw.trim() !== '') {
          const parsed = Number(totalRaw);
          if (!Number.isNaN(parsed)) total = parsed;
        }

        this.totalCreado = total;
        this.pedidoIdCreado = resp?.id ?? null;

        let msg = 'Pedido creado correctamente.';
        if (this.totalCreado != null) {
          msg += ` Monto total: $${this.totalCreado.toFixed(2)}.`;
        }
        alert(msg);
      },
      error: (e: any) => {
        this.enviando = false;
        console.error('Error creando pedido', e);
        this.error =
          e?.error?.message || e?.error?.msg || e?.error?.error || 'No se pudo crear el pedido.';
        alert(this.error);
      },
    });
  }

  limpiar(): void {
    this.clienteId = null;
    this.items = [];
    this.agregarItem();
    this.totalCreado = null;
    this.pedidoIdCreado = null;
  }
}

