import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Usuarios {
   
  private http = inject(HttpClient);

  url = 'http://127.0.0.1:7222';

  // src/app/services/usuarios.ts
getUsuarios(): Observable<any> {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(this.url + '/usuarios', { headers });
}
updateUsuarioEstado(id: number, estado: 'activo' | 'bloqueado') {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  return this.http.put<any>(`${this.url}/usuario/${id}`, { estado }, { headers });
}
}



