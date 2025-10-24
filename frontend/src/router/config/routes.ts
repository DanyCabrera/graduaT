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

  //Alumno
  PROGRESO: '/alumno/progreso',
  ALUMNO_MATEMATICAS: '/alumno/matematicas',
  ALUMNO_COMUNICACION: '/alumno/comunicacion',
  
  //Maestro
  MAESTRO_AGENDA: '/maestro/agenda',
  MAESTRO_ALUMNOS: '/maestro/alumnos',
  MAESTRO_HISTORIAL: '/maestro/historial',
  MAESTRO_TESTS: '/maestro/tests',
  
  //Director
  DIRECTOR_ALUMNOS: '/director/alumnos',
  DIRECTOR_MAESTROS: '/director/maestros',
  DIRECTOR_CURSOS: '/director/cursos',
  DIRECTOR_RENDIMIENTO: '/director/rendimiento',
  DIRECTOR_INFORMACION: '/director/informacion',
  
  //Supervisor
  
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
  ALUMNO: {
    PROGRESO: '/alumno/progreso',
    MATEMATICAS: '/alumno/matematicas',
    COMUNICACION: '/alumno/comunicacion',
  },
  MAESTRO: {
    AGENDA: '/maestro/agenda',
    ALUMNOS: '/maestro/alumnos',
    HISTORIAL: '/maestro/historial',
    TESTS: '/maestro/tests',
  },
  DIRECTOR: {
    ALUMNOS: '/director/alumnos',
    MAESTROS: '/director/maestros',
    CURSOS: '/director/cursos',
    RENDIMIENTO: '/director/rendimiento',
    INFORMACION: '/director/informacion',
  }
} as const;
