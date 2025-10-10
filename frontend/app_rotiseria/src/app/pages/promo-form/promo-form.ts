import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-promo-form',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './promo-form.html',
  styleUrl: './promo-form.css'
})
export class PromoForm implements OnInit {
  private route = inject(ActivatedRoute);

  // ver=false => Agregar, ver=true => Editar
  ver: boolean = false;

  ngOnInit(): void {
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    else if (qp === 'false' || qp === '0') this.ver = false;
  }

  get titulo()      { return this.ver ? 'Editar promoción' : 'Agregar promoción'; }
  get submitLabel() { return this.ver ? 'Guardar cambios' : 'Agregar promoción'; }
}
