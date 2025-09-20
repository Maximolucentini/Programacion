import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agregar-promo',
  imports: [RouterLink,CommonModule],
  templateUrl: './agregar-promo.html',
  styleUrl: './agregar-promo.css'
})
export class AgregarPromo {

}
