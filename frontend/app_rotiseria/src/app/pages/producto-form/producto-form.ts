import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoForm implements OnInit {
  private route = inject(ActivatedRoute);

  // ver=false => Agregar, ver=true => Editar
  ver: boolean = false;

  ngOnInit(): void {
    // 1) desde data de la ruta
    const dataFlag = this.route.snapshot.data['ver'];
    if (typeof dataFlag === 'boolean') this.ver = dataFlag;

    // 2) override opcional por query ?ver=true|false|1|0
    const qp = (this.route.snapshot.queryParamMap.get('ver') || '').toLowerCase();
    if (qp === 'true' || qp === '1') this.ver = true;
    else if (qp === 'false' || qp === '0') this.ver = false;
  }

  get titulo()      { return this.ver ? 'Editar producto' : 'Agregar producto'; }
  get submitLabel() { return this.ver ? 'Guardar cambios' : 'Agregar producto'; }
}

