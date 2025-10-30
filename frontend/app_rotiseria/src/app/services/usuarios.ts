import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  estado?: string;
  created_at?: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  pages: number;
  current_page: number;
}

@Injectable({ providedIn: 'root' })
export class Usuarios {
  private http = inject(HttpClient);
  private base = 'http://127.0.0.1:7222';
  private pathPlural  = `${this.base}/usuarios`;
  private pathSingular = `${this.base}/usuario`;

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getUsuarios(params: { page?: number; per_page?: number; q?: string } = {}): Observable<Paged<User>> {
    // ❗ sólo enviamos los parámetros que el backend acepta
    let hp = new HttpParams();
    if (params.page)      hp = hp.set('page', String(params.page));
    if (params.per_page)  hp = hp.set('per_page', String(params.per_page));
    if (params.q)         hp = hp.set('q', params.q.trim());

    return this.http.get<any>(this.pathPlural, { params: hp, headers: this.authHeaders() })
      .pipe(map(resp => {
        // Soporta distintos nombres de campos
        const items = resp.usuarios ?? resp.users ?? resp.data ?? resp ?? [];
        return {
          items,
          total: resp.total ?? resp.count ?? items.length ?? 0,
          pages: resp.pages ?? resp.total_pages ?? 1,
          current_page: resp.current_page ?? resp.page ?? (params.page ?? 1)
        } as Paged<User>;
      }));
  }

  // PATCH/PUT genérico
  updateUsuario(id: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.pathSingular}/${id}`, data, { headers: this.authHeaders() });
  }

  // Helper usado por tu UI
  updateUsuarioEstado(id: number, estado: 'activo' | 'bloqueado' | string) {
    return this.updateUsuario(id, { estado });
  }
}



