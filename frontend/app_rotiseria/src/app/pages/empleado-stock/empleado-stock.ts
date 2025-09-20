import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado-stock',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './empleado-stock.html',
  styleUrl: './empleado-stock.css'
})
export class EmpleadoStock {

}
