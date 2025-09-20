import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado-actualizar-estado',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './empleado-actualizar-estado.html',
  styleUrl: './empleado-actualizar-estado.css'
})
export class EmpleadoActualizarEstado {

}
