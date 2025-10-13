// Constantes de la aplicación

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL; 

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PANEL_ROL: '/panelRol',
  ACCESO: '/acceso',
  ADMIN: '/admin',
  REGISTRO: '/registro',
  ALUMNO: '/alumno',
  MAESTRO: '/maestro',
  DIRECTOR: '/director',
  SUPERVISOR: '/supervisor',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  DIRECTOR: 'director',
  MAESTRO: 'maestro',
  ALUMNO: 'alumno',
  SUPERVISOR: 'supervisor',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  ROLE: 'user_role',
} as const;
