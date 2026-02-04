import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get userRole(): string | null {
    return localStorage.getItem('rol');
  }

  // usuario “normal” (no admin / empleado)
  get isUser(): boolean {
    return this.userRole === 'user';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/login');
  }
}


