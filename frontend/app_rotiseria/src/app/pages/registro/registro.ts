import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [Navbar, Footer, CommonModule, RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  private auth = inject(Auth);
  private router = inject(Router);

  form = {
    name: '',
    email: '',
    phone: '', 
    password: '',
    confirmPassword: ''
  };

  loading = false;
  error: string | null = null;
  success: string | null = null;

  submit() {
    this.error = null;
    this.success = null;

    // Validaciones simples
    if (!this.form.name.trim()) { this.error = 'Ingresá tu nombre.'; return; }
    if (!this.form.email.trim()) { this.error = 'Ingresá tu email.'; return; }
    if (!this.form.phone.trim()) { this.error = 'Ingresá tu teléfono.'; return; }
    if (this.form.password.length < 6) { this.error = 'La contraseña debe tener al menos 6 caracteres.'; return; }
    if (this.form.password !== this.form.confirmPassword) { this.error = 'Las contraseñas no coinciden.'; return; }

    this.loading = true;
    const body = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone.trim(), 
      password: this.form.password
    };

    this.auth.register(body).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Cuenta creada. Quedó pendiente de validación por el local. Te avisaremos cuando esté habilitada.';
        // Redirigimos al login después de un segundo
        setTimeout(() => this.router.navigateByUrl('/login'), 1000);
      },
      error: (e) => {
        this.loading = false;
        const msg = e?.error?.message || e?.error?.error || 'No se pudo crear la cuenta.';
        this.error = msg.includes('email') ? 'Ese email ya está registrado.' : msg;
      }
    });
  }
}

