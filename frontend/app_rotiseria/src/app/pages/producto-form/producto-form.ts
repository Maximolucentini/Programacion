import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { ProductosService } from '../../services/productos';
import { Product } from '../../interfaces/Product';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productosSrv = inject(ProductosService);

  // ver=false => Agregar, ver=true => Editar
  ver: boolean = false;

  // id del producto cuando estamos editando
  productId: number | null = null;

  // modelo del formulario
  form: {
    name: string;
    description: string;
    price: number | null;
    stock: number | null;
    estado: 'activo' | 'suspendido' | '';
  } = {
    name: '',
    description: '',
    price: null,
    stock: null,
    estado: 'activo'
  };

  loading = false;
  error: string | null = null;
  success: string | null = null;

  ngOnInit(): void {
    
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

    
    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    else if (qp === 'false' || qp === '0') this.ver = false;

    
    const idStr =
      this.route.snapshot.queryParamMap.get('id') ||
      this.route.snapshot.paramMap.get('id');

    this.productId = idStr ? Number(idStr) : null;

    
    if (this.ver && !this.productId) {
      this.error = 'No se encontró el producto a editar.';
      return;
    }

    
    if (this.ver && this.productId) {
      this.cargarProducto(this.productId);
    }
  }

  get titulo()      { return this.ver ? 'Editar producto' : 'Agregar producto'; }
  get submitLabel() { return this.ver ? 'Guardar cambios' : 'Agregar producto'; }

  private cargarProducto(id: number): void {
    this.loading = true;
    this.error = null;

    this.productosSrv.getProducto(id).subscribe({
      next: (p: Product) => {
        this.loading = false;
        this.form = {
          name: p.name || '',
          description: p.description || '',
          price: Number(p.price),
          stock: Number(p.stock),
          estado: (p.estado as any) || 'activo'
        };
      },
      error: (e) => {
        this.loading = false;
        console.error('Error cargando producto', e);
        const msg =
          e?.error?.message ||
          e?.error?.error ||
          'No se pudo cargar el producto.';
        this.error = msg;
      }
    });
  }

  submit(): void {
    this.error = null;
    this.success = null;

    
    if (!this.form.name.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }

    if (
      this.form.price == null ||
      isNaN(Number(this.form.price)) ||
      Number(this.form.price) <= 0
    ) {
      this.error = 'El precio debe ser mayor que 0.';
      return;
    }

    if (
      this.form.stock == null ||
      isNaN(Number(this.form.stock)) ||
      Number(this.form.stock) < 0
    ) {
      this.error = 'El stock no puede ser negativo.';
      return;
    }

    const body: Partial<Product> = {
      name: this.form.name.trim(),
      description: this.form.description.trim() || undefined,
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      estado: this.form.estado || 'activo'
    };

    this.loading = true;

    if (this.ver && this.productId) {
      // EDITAR
      this.productosSrv.actualizarProducto(this.productId, body).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Producto actualizado correctamente.';
          setTimeout(() => this.router.navigateByUrl('/menu-admin'), 600);
        },
        error: (e) => {
          this.loading = false;
          console.error('Error actualizando producto', e);
          const msg =
            e?.error?.message ||
            e?.error?.error ||
            'No se pudo actualizar el producto.';
          this.error = msg;
        }
      });
    } else {
      // AGREGAR
      this.productosSrv.crearProducto(body).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Producto creado correctamente.';
          setTimeout(() => this.router.navigateByUrl('/menu-admin'), 600);
        },
        error: (e) => {
          this.loading = false;
          console.error('Error creando producto', e);
          const msg =
            e?.error?.message ||
            e?.error?.error ||
            'No se pudo crear el producto.';
          this.error = msg;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigateByUrl('/menu-admin');
  }
}

