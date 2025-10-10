import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { VerUser } from '../../componentes/usuarios/ver-user/ver-user'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, VerUser,RouterLink], 
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css'
})
export class UsuariosAdmin {}

