// Configuración de rutas de la aplicación

export const ROUTES = {
  // Rutas principales
  HOME: '/',
  LOGIN: '/login',
  CODIGO_ACCESO: '/codigo-acceso',
  PANEL_ROL: '/panelRol',
  REGISTROL: '/registrol',
  ACCESO: '/acceso',
  
  // Rutas de roles
  ALUMNO: '/alumno',
  MAESTRO: '/maestro',
  DIRECTOR: '/director',
  SUPERVISOR: '/supervisor',
  
  // Rutas de administración
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_PANEL: '/admin/panel',
  
  // Rutas de institución
  REGISTRO: '/registro',
  REGISTRO_LOGIN: '/registro/login',
  REGISTRO_FORM: '/registro/formInst',
  
  // Rutas de error
  NOT_FOUND: '/*',
} as const;

export const ROUTE_GROUPS = {
  AUTH: {
    LOGIN: '/login',
    ACCESO: '/acceso',
  },
  ROLES: {
    ALUMNO: '/alumno',
    MAESTRO: '/maestro',
    DIRECTOR: '/director',
    SUPERVISOR: '/supervisor',
  },
  ADMIN: {
    BASE: '/admin',
    LOGIN: '/admin/login',
    PANEL: '/admin/panel',
  },
  INSTITUTION: {
    BASE: '/registro',
    LOGIN: '/registro/login',
    FORM: '/registro/formInst',
    REGISTRO: '/registro/registro',
  },
} as const;
