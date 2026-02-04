import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ProductCardModel {
  id: number;
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  rating?: number;
  isBestSeller?: boolean;
  prepMinutes?: number;
  spiceLevel?: 'Suave' | 'Medio' | 'Picante' | null;
  available?: boolean;

  stock?: number;     // stock disponible del producto
  quantity: number;   // cantidad seleccionada por el cliente
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCard {

  @Input() data!: ProductCardModel;
  @Input() adminMode = false; // true: modo admin, false: cliente

  @Output() add = new EventEmitter<ProductCardModel>();
  @Output() edit = new EventEmitter<ProductCardModel>();
  @Output() remove = new EventEmitter<ProductCardModel>();
  @Output() toggle = new EventEmitter<ProductCardModel>();

  // ====== Contador para el cliente ======
  increment(): void {
    if (!this.data) return;

    const stock = this.data.stock ?? Number.POSITIVE_INFINITY;

    if (this.data.quantity >= stock) {
      alert(`No hay más stock de ${this.data.title}.`);
      return;
    }

    this.data.quantity++;
  }

  decrement(): void {
    if (!this.data) return;
    if (this.data.quantity <= 0) return;

    this.data.quantity--;
  }

  // ====== Eventos admin / generales  ======
  onAdd()   { this.add.emit(this.data); }
  onEdit()  { this.edit.emit(this.data); }
  onRemove(){ this.remove.emit(this.data); }
  onToggle(){ this.toggle.emit(this.data); }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
