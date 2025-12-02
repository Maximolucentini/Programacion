export interface JwtPayload {
    sub?: string | number;
    email?: string;
    rol?: 'admin' | 'empleado' | 'user' | string;
    role?: string;
    exp?: number;
    [k: string]: any;
  }
  
  function base64UrlDecode(input: string): string {
    const pad = input.length % 4 === 2 ? '==' : input.length % 4 === 3 ? '=' : '';
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
    return atob(base64);
  }
  
  export function decodeJwtPayload<T extends JwtPayload = JwtPayload>(token: string): T | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const json = base64UrlDecode(parts[1]);
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }
  