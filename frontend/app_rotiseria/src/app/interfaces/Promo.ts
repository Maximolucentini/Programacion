export interface Promo {
    id: number;
    title: string;
    description: string;
    fecha: string; 
    estado: 'activa' | 'suspendida';
    
  
    
    created_at?: string;
    updated_at?: string;
  
    
    enviada?: boolean;
    sent_at?: string;
  }
  