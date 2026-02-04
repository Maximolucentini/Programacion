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
  private pathPlural = `${this.base}/usuarios`;
  private pathSingular = `${this.base}/usuario`;

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getUsuarios(
    params: { page?: number; per_page?: number; q?: string } = {}
  ): Observable<Paged<User>> {
    let hp = new HttpParams();
    if (params.page) hp = hp.set('page', String(params.page));
    if (params.per_page) hp = hp.set('per_page', String(params.per_page));
    if (params.q) hp = hp.set('q', params.q.trim());

    return this.http
      .get<any>(this.pathPlural, { params: hp, headers: this.authHeaders() })
      .pipe(
        map((resp) => {
          const rawItems: any[] =
            resp.usuarios ?? resp.users ?? resp.data ?? resp ?? [];

          
          const items: User[] = rawItems.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.rol,            
            estado: u.estado,
            created_at: u.created_at,
          }));

          return {
            items,
            total: resp.total ?? resp.count ?? items.length ?? 0,
            pages: resp.pages ?? resp.total_pages ?? 1,
            current_page:
              resp.current_page ?? resp.page ?? (params.page ?? 1),
          };
        })
      );
  }

  
  private mapToBackendPayload(data: Partial<User>): any {
    const payload: any = {};

    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;
    
    if ((data as any).password !== undefined) {
      payload.password = (data as any).password;
    }
    if (data.role !== undefined) payload.rol = data.role;   
    if (data.estado !== undefined) payload.estado = data.estado;
    if (data.created_at !== undefined) payload.created_at = data.created_at;

    return payload;
  }

  
  updateUsuario(id: number, data: Partial<User>): Observable<User> {
    const body = this.mapToBackendPayload(data);

    return this.http
      .put<any>(`${this.pathSingular}/${id}`, body, {
        headers: this.authHeaders(),
      })
      .pipe(
        map((resp) => {
          const u = resp.usuario ?? resp;
          const mapped: User = {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.rol,
            estado: u.estado,
            created_at: u.created_at,
          };
          return mapped;
        })
      );
  }

  
  updateUsuarioEstado(
    id: number,
    estado: 'activo' | 'pre_confirmacion' | 'suspendido' | string
  ) {
    return this.updateUsuario(id, { estado });
  }
}

