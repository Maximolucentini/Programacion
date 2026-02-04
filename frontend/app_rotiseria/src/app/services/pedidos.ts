import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../interfaces/order';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private http = inject(HttpClient);
  private url = 'http://127.0.0.1:7222';

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders(
      token
        ? { Authorization: `Bearer ${token}` }
        : {}
    );
  }

    // LISTAR pedidos
    list(params: {
      status?: OrderStatus;
      sort_by?: 'created_at_asc' | 'created_at_desc' | 'total_asc' | 'total_desc';
      page?: number;
      per_page?: number;
      user_id?: number;          
    } = {}): Observable<{ pedidos: Order[] }> {
  
      let hp = new HttpParams();
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue;
        hp = hp.set(k, String(v));
      }
  
      return this.http.get<{ pedidos: Order[] }>(
        `${this.url}/pedidos`,
        {
          headers: this.authHeaders(),
          params: hp,
        }
      );
    }
  

  // OBTENER pedido por id
  get(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/pedido/${id}`,
      {
        headers: this.authHeaders(),
      }
    );
  }

  // CREAR pedido (POST /pedidos)
  create(body: {
    user_id: number;
    status: OrderStatus | string;
    productos: { product_id: number; quantity: number }[];
  }): Observable<any> {
    return this.http.post<any>(
      `${this.url}/pedidos`,
      body,
      {
        headers: this.authHeaders(),
      }
    );
  }

  // ACTUALIZAR estado de un pedido (PUT /pedido/:id)
  updateEstado(id: number, status: OrderStatus): Observable<any> {
    return this.http.put(
      `${this.url}/pedido/${id}`,
      { status },
      {
        headers: this.authHeaders(),
      }
    );
  }
}

