import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Footer } from '../../components/footer/footer'; 
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Footer, Navbar,RouterLink,CommonModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private router: Router) {}

  irAlMenu() {
    this.router.navigate(['/menu']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  irAAdmin() {
    this.router.navigate(['/admin']);
  }
}

