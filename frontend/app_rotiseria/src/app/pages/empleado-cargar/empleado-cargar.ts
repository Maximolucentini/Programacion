import { Component } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado-cargar',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './empleado-cargar.html',
  styleUrl: './empleado-cargar.css'
})
export class EmpleadoCargar {

}
