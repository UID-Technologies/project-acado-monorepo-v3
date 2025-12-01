export interface Country {
    id: number;
    name: string;
  }
  
  export interface Pagination {
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    current_page: number;
  }
  
  export interface CountryListResponse {
    status: number;
    data: Country[];
    pagination: Pagination;
    error: any[];
  }
  