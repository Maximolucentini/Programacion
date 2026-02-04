export interface LoginResponse {
    access_token: string;
    email?: string;
    id?: string;
    rol?:  'admin' | 'empleado' | 'user' | string; 
  }
  