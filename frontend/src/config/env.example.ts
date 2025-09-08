// Configuración de variables de entorno
// En Vite, las variables de entorno deben empezar con VITE_

export const ENV_CONFIG = {
  // URL base de la API del backend
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Nombre de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'GraduaT',
  
  // Versión de la aplicación
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Modo de desarrollo
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Modo de producción
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Tipos para las variables de entorno
export interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
