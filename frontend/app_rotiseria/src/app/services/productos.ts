import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../interfaces/Product';
import { PagedResponse } from '../interfaces/Paged';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  private url = 'http://127.0.0.1:7222';

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getProductos(params: {
    page?: number;
    per_page?: number;
    name?: string;
    price_min?: number;
    price_max?: number;
    stock_min?: number;
    estado?: string;          // 'activo' | 'suspendido'
    sort_by?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc';
  } = {}): Observable<PagedResponse<Product>> {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') hp = hp.set(k, String(v));
    });

    return this.http
      .get<{ productos: Product[]; total: number; pages: number; current_page: number }>(
        `${this.url}/productos`,
        { params: hp, headers: this.authHeaders() }
      )
      .pipe(
        map(resp => ({
          items: resp.productos ?? [],
          total: resp.total,
          pages: resp.pages,
          current_page: resp.current_page
        }))
      );
  }

  getProducto(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/producto/${id}`, { headers: this.authHeaders() });
  }

  // Por si necesitas admin más adelante:
  crearProducto(body: Partial<Product>) {
    return this.http.post(`${this.url}/producto`, body, { headers: this.authHeaders() });
  }
  actualizarProducto(id: number, body: Partial<Product>) {
    return this.http.put(`${this.url}/producto/${id}`, body, { headers: this.authHeaders() });
  }
  eliminarProducto(id: number) {
    return this.http.delete(`${this.url}/producto/${id}`, { headers: this.authHeaders() });
  }
}
