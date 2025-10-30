export type OrderStatus =
  | 'pendiente'
  | 'en preparación'
  | 'en camino'
  | 'entregado'
  | 'cancelado';

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: string; // viene tipo "2025-10-29 23:14:46"
}

