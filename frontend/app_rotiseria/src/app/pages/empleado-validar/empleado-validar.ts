import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado-validar',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './empleado-validar.html',
  styleUrl: './empleado-validar.css'
})
export class EmpleadoValidar {

}
