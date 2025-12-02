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

  get(id: number): Observable<any> {
    return this.http.get<any>(
      `http://127.0.0.1:7222/pedido/${id}`,
      {
        headers: this.authHeaders(),
      }
    );
  }
  
  updateEstado(id: number, status: OrderStatus): Observable<any> {
    return this.http.put(
      `http://127.0.0.1:7222/pedido/${id}`,
      { status },
      {
        headers: this.authHeaders(),
      }
    );
  }
  
}
