export type OrderStatus =
  | 'pendiente'
  | 'en preparación'
  | 'listo para el retiro'
  | 'entregado'
  | 'cancelado';

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: string; 
}

