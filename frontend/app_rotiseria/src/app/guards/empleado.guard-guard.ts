import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { decodeJwtPayload } from '../utils/jwt';  // ← ajustá ruta si tu árbol difiere

export const empleadoGuard: CanActivateFn = () => {
  const router = inject(Router);

  const raw = localStorage.getItem('token');
  if (!raw) return router.parseUrl('/login');

  const token = raw.replace(/^Bearer\s+/i, '');
  const p = decodeJwtPayload(token);
  if (!p) return router.parseUrl('/login');

  // (opcional) validar expiración si tu JWT trae `exp` (segundos Unix)
  if (typeof p.exp === 'number' && Date.now() / 1000 >= p.exp) {
    localStorage.removeItem('token');
    return router.parseUrl('/login');
  }

  const rol = String(p.rol ?? p.role ?? '').toLowerCase();
  return rol === 'empleado' ? true : router.parseUrl('/login'); // no empleado → a /menu
};

