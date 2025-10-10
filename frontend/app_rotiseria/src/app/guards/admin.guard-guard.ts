import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) return router.parseUrl('/login');

  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    const rol = payload?.rol || payload?.role;
    return rol === 'admin' ? true : router.parseUrl('/login'); 
  } catch {
    return router.parseUrl('/login');
  }
};
