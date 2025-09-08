// Guards de rutas para protección de acceso

import type { UserRole } from '../../types';

export interface RouteGuard {
  path: string;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const ROUTE_GUARDS: RouteGuard[] = [
  {
    path: '/admin/*',
    allowedRoles: ['admin'],
    redirectTo: '/login',
  },
  {
    path: '/alumno',
    allowedRoles: ['alumno'],
    redirectTo: '/login',
  },
  {
    path: '/maestro',
    allowedRoles: ['maestro'],
    redirectTo: '/login',
  },
  {
    path: '/director',
    allowedRoles: ['director'],
    redirectTo: '/login',
  },
  {
    path: '/supervisor',
    allowedRoles: ['supervisor'],
    redirectTo: '/login',
  },
];

export const checkRouteAccess = (path: string, userRole: UserRole | null): boolean => {
  const guard = ROUTE_GUARDS.find(g => path.startsWith(g.path.replace('/*', '')));
  
  if (!guard) {
    return true; // No hay restricciones para esta ruta
  }
  
  if (!userRole) {
    return false; // Usuario no autenticado
  }
  
  return guard.allowedRoles.includes(userRole);
};
