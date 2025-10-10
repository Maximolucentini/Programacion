import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

type PromoInit = {
  title?: string;
  description?: string;
  date?: string; // formato yyyy-mm-dd
};

@Component({
  selector: 'app-promo-form-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './promo-form-card.html',
  styleUrl: './promo-form-card.css'
})
export class PromoFormCard {
  @Input() editar = false;                   // false=agregar, true=editar
  @Input() volverLink = '/promos-admin';
  @Input() initial: PromoInit | null = null;

  get titulo()      { return this.editar ? 'Editar promoción' : 'Agregar promoción'; }
  get submitLabel() { return this.editar ? 'Guardar cambios' : 'Agregar promoción'; }
}

