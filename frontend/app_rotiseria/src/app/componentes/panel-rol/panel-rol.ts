import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

export interface AccionRol {
  label: string;
  link: string; // ruta, ej: '/menu'
}

@Component({
  selector: 'app-panel-rol',
  imports: [CommonModule, RouterModule],
  templateUrl: './panel-rol.html',
  styleUrl: './panel-rol.css'
})
export class PanelRol {
  private router = inject(Router);
  @Input() titulo: string = 'Food';
  @Input() subtitulo: string = '';               // ej: "Bienvenido Administrador" / "Bienvenido Empleado"
  @Input() perfilUrl: string = 'https://via.placeholder.com/40';
  @Input() acciones: AccionRol[] = [];           // botones principales
  @Input() volverLink: string = '/login';        // link del botón "Volver al login"
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/login');
  }
}
