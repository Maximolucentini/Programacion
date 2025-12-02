import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { ProductCard, ProductCardModel } from '../../componentes/product-card/product-card';

import { ProductosService } from '../../services/productos';
import { Product } from '../../interfaces/Product';
import { PagedResponse } from '../../interfaces/Paged';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer, ProductCard],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnInit {
  private route = inject(ActivatedRoute);
  private productosSrv = inject(ProductosService);

  // si venís desde admin mostramos modo edición
  ver = false;

  // estado UI
  loading = false;
  error: string | null = null;

  // paginación
  page = 1;
  per_page = 9;
  pages = 1;
  total = 0;

  // filtros (2+ reales del backend)
  filtros: {
    name: string;
    price_min: number | null;
    price_max: number | null;
    stock_min: number; // 0 o 1 (checkbox)
    estado?: string;
    sort_by: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc';
  } = {
    name: '',
    price_min: null,
    price_max: null,
    stock_min: 0,
    estado: 'activo',
    sort_by: 'name_asc'
  };

  products: ProductCardModel[] = [];

  ngOnInit(): void {
    // flag por data o query param ?ver=true
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;
    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    if (qp === 'false' || qp === '0') this.ver = false;

    this.cargar();
  }

  // ========= helpers de sanitización =========
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
      stock_min: f.stock_min ? 1 : undefined,     // sólo enviamos si está tildado
      estado: f.estado || undefined,
      sort_by: f.sort_by
    };
  }

  // ========= carga principal =========
  cargar(): void {
    this.loading = true;
    this.error = null;

    this.productosSrv.getProductos(this.buildParams()).subscribe({
      next: (resp: PagedResponse<Product>) => {
        this.pages = resp.pages || 1;
        this.total = resp.total || 0;
        this.products = (resp.items || []).map(this.mapToCard);
        this.loading = false;
      },
      error: (e) => {
        console.error('Error /productos', e);
        this.error = 'No se pudo cargar el menú.';
        this.loading = false;
      }
    });
  }

  // ========= mapeo a la card existente =========
  private mapToCard = (p: Product): ProductCardModel => ({
    title: p.name,
    description: p.description || '',
    price: Number(p.price),
    imageUrl: 'assets/bigburger.jpg', // si guardás URL en BD, reemplazá aquí
    rating: 4.5,
    prepMinutes: 15,
    spiceLevel: null,
    available: (p as any).available ?? p.stock > 0
  });

  // ========= acciones UI =========
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
      sort_by: 'name_asc'
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

  // usuario
  addToCart(p: ProductCardModel) {
    console.log('ADD', p);
  }

  // admin (placeholders)
  onEdit(p: ProductCardModel) { console.log('EDIT', p); }
  onRemove(p: ProductCardModel) { console.log('REMOVE', p); }
  onToggle(p: ProductCardModel) { p.available = p.available === false ? true : false; }
}
