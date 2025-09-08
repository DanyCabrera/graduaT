// Tipos globales de la aplicación

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'director' | 'maestro' | 'alumno' | 'supervisor';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
