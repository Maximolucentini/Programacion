import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

type ProductoInit = {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
};

@Component({
  selector: 'app-product-form-card',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './product-form-card.html',
  styleUrl: './product-form-card.css'
})
export class ProductFormCard {
  @Input() editar = false;                      // false=agregar, true=editar
  @Input() volverLink = '/menu-admin';
  @Input() initial: ProductoInit | null = null; // datos iniciales opcionales

  get titulo()      { return this.editar ? 'Editar producto' : 'Agregar producto'; }
  get submitLabel() { return this.editar ? 'Guardar cambios' : 'Agregar producto'; }
}
