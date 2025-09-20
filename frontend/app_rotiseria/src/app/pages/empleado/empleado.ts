import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado',
  imports: [Footer,RouterLink,CommonModule],
  templateUrl: './empleado.html',
  styleUrl: './empleado.css'
})
export class Empleado {

}
