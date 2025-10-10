import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { ProductCard, ProductCardModel } from '../../componentes/product-card/product-card';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, ProductCard,RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  private route = inject(ActivatedRoute);

  // ver=false => user, ver=true => admin
  ver: boolean = false;
  

  ngOnInit(): void {
    // 1) Rol por data de la ruta
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

  }

  products: ProductCardModel[] = [
    {
      title: 'American Burger',
      description: 'Hamburguesa clásica con cheddar, lechuga, tomate y pepinillos.',
      imageUrl: 'assets/americanburger.jpg',
      rating: 4.9, prepMinutes: 20, price: 2500, spiceLevel: 'Suave', available: true
    },
    {
      title: 'Big Burger',
      description: 'Doble carne, doble queso, tocino y salsa secreta.',
      imageUrl: 'assets/bigburger.jpg',
      rating: 4.8, prepMinutes: 25, price: 2500, spiceLevel: 'Suave', available: true
    },
    {
      title: 'Chicken Burger',
      description: 'Pollo empanado con lechuga, tomate y mayo.',
      imageUrl: 'assets/chickenburger.jpg',
      rating: 4.7, prepMinutes: 18, price: 2500, spiceLevel: 'Medio', available: true
    }
  ];

  // usuario
  addToCart(p: ProductCardModel){ console.log('ADD', p); }

  // admin
  onEdit(p: ProductCardModel){ console.log('EDIT', p); }
  onRemove(p: ProductCardModel){ console.log('REMOVE', p); }
  onToggle(p: ProductCardModel){ p.available = p.available === false ? true : false; }
}

