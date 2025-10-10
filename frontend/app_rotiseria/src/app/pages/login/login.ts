import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { decodeJwtPayload } from '../../utils/jwt';
import { Navbar } from '../../componentes/navbar/navbar';
import { Footer } from '../../componentes/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,Navbar,Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);

  error = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  private navigateByRole(rol: string) {
    switch (rol) {
      case 'admin':
        this.router.navigateByUrl('/admin'); 
        break;
      case 'empleado':
        this.router.navigateByUrl('/empleado');       
        break;
      default:
        this.router.navigateByUrl('/menu');           
        break;
    }
  }

  irLogin() {
    this.error = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const body = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.auth.login(body).subscribe({
      next: (res: any) => {
        // 1) Guardar token
        const raw = res?.access_token || res?.token || '';
        const token = String(raw).replace(/^Bearer\s+/i, '');
        localStorage.setItem('token', token);

        // 2) Decodificar payload
        const payload = decodeJwtPayload(token);
        const rol = (payload?.rol || payload?.role || 'user') as string;
        const email = payload?.email || body.email;

        // 3) Persistir info útil
        localStorage.setItem('rol', rol);
        if (email) localStorage.setItem('email', email);

        // 4) Redirigir según rol
        this.navigateByRole(rol);
      },
      error: (e) => {
        console.error('Login error:', e);
        this.error = 'Credenciales inválidas';
      }
    });
  }
}
