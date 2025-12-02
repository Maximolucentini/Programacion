export interface PagedResponse<T> {
    items: T[];        
    total: number;
    pages: number;
    current_page: number;
  }
  