export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    estado: 'activo' | 'suspendido' | string;
    created_at?: string;
    updated_at?: string;
  }
  