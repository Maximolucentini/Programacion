import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface RatingPayload {
  product_id: number;
  score: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class ValoracionesService {
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

  crearValoracion(payload: RatingPayload): Observable<any> {
    
    
    return this.http.post(
      `${this.url}/valoracion`,
      payload,
      {
        headers: this.authHeaders(),
      }
    );
  }

  
  obtenerValoraciones(
    productId: number,
    opts?: { min_score?: number; sort_by?: 'score_asc' | 'score_desc' | 'date_asc' | 'date_desc' }
  ): Observable<any> {
    const params: any = {};
    if (opts?.min_score !== undefined) params.min_score = opts.min_score;
    if (opts?.sort_by) params.sort_by = opts.sort_by;

    return this.http.get(
      `${this.url}/valoracion/${productId}`,
      {
        headers: this.authHeaders(),
        params,
      }
    );
  }
}
