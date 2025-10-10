import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/LoginRequest';
import { LoginResponse } from '../interfaces/LoginResponse';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  url = 'http://127.0.0.1:7222'; 

  login(dataLogin: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url + '/auth/login', dataLogin);
  }
}

