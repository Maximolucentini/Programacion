import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promo } from '../interfaces/Promo';

@Injectable({
  providedIn: 'root',
})
export class PromosService {
  private http = inject(HttpClient);

  private baseUrl = 'http://127.0.0.1:7222';

  
  private getToken(): string | null {
    return (
      localStorage.getItem('token') ??
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('token') ??
      sessionStorage.getItem('access_token')
    );
  }

  private authHeaders(): { headers: HttpHeaders } | {} {
    const token = this.getToken();
    if (!token) return {};
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // =================== GET  ===================

  getPromos(opts?: { estado?: 'activa' | 'suspendida'; order?: 'asc' | 'desc' }): Observable<Promo[]> {
    let params = new HttpParams();

    if (opts?.estado) params = params.set('estado', opts.estado);
    if (opts?.order) params = params.set('order', opts.order);

    return this.http.get<Promo[]>(`${this.baseUrl}/promociones`, { params });
  }

  getPromo(id: number): Observable<Promo> {
    return this.http.get<Promo>(`${this.baseUrl}/promocion/${id}`);
  }

  // =================== ADMIN  ===================

  createPromo(data: Partial<Omit<Promo, 'id'>>): Observable<Promo> {
    return this.http.post<Promo>(`${this.baseUrl}/promociones`, data, this.authHeaders());
  }

  updatePromo(id: number, data: Partial<Omit<Promo, 'id'>>): Observable<Promo> {
    return this.http.put<Promo>(`${this.baseUrl}/promocion/${id}`, data, this.authHeaders());
  }

  deletePromo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/promocion/${id}`, this.authHeaders());
  }

  sendPromo(id: number) {
    return this.http.post<Promo>(
      `${this.baseUrl}/promocion/${id}/enviar`,
      {},
      this.authHeaders()
    );
  }

  
}

