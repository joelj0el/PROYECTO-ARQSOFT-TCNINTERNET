/**
 * Tipos para respuestas API consistentes
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param?: string;
    location?: string;
  }>;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
