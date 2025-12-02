import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ProductCardModel {
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  rating?: number;
  prepMinutes?: number;
  spiceLevel?: 'Suave' | 'Medio' | 'Picante' | null;
  available?: boolean;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() data!: ProductCardModel;
  @Input() adminMode = false;  // ← control de modo admin (viene del menu)
  @Output() add = new EventEmitter<ProductCardModel>();
  @Output() edit = new EventEmitter<ProductCardModel>();
  @Output() remove = new EventEmitter<ProductCardModel>();
  @Output() toggle = new EventEmitter<ProductCardModel>();

  onAdd(){ this.add.emit(this.data); }
  onEdit(){ this.edit.emit(this.data); }
  onRemove(){ this.remove.emit(this.data); }
  onToggle(){ this.toggle.emit(this.data); }
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
}
