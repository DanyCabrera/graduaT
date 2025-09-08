# Router - Estructura Reorganizada

Esta carpeta contiene toda la configuración de rutas de la aplicación, organizada de manera escalable y mantenible.

## 📁 Estructura

```
router/
├── config/                 # Configuraciones de rutas
│   ├── routes.ts          # Constantes de rutas
│   └── guards.ts          # Guards de protección de rutas
├── routes/                # Archivos de rutas organizados
│   ├── AppRoutes.tsx      # Rutas principales de la aplicación
│   ├── AdminRoutes.tsx    # Rutas de administración
│   └── InstitutionRoutes.tsx # Rutas de institución
├── index.ts               # Punto de exportación central
└── README.md              # Esta documentación
```

## 🎯 Beneficios de la Nueva Estructura

### 1. **Organización Clara**
- Separación de configuraciones y implementaciones
- Rutas agrupadas por funcionalidad
- Nomenclatura consistente (PascalCase)

### 2. **Escalabilidad**
- Fácil agregar nuevas rutas
- Estructura modular
- Configuración centralizada

### 3. **Mantenibilidad**
- Constantes de rutas reutilizables
- Guards de protección
- Documentación clara

## 📋 Archivos Principales

### `config/routes.ts`
Contiene todas las constantes de rutas:
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  // ... más rutas
} as const;
```

### `config/guards.ts`
Define la protección de rutas por roles:
```typescript
export const ROUTE_GUARDS: RouteGuard[] = [
  {
    path: '/admin/*',
    allowedRoles: ['admin'],
    redirectTo: '/login',
  },
  // ... más guards
];
```

### `routes/AppRoutes.tsx`
Rutas principales de la aplicación con:
- Rutas de autenticación
- Rutas de roles
- Sub-rutas de administración e institución
- Componente de error 404 mejorado

### `routes/AdminRoutes.tsx`
Rutas específicas para administración:
- Login de administrador
- Panel de administración
- Error 404 específico para admin

### `routes/InstitutionRoutes.tsx`
Rutas específicas para instituciones:
- Login de institución
- Formulario de institución
- Error 404 específico para institución

## 🚀 Cómo Usar

### Importar Rutas
```typescript
import { AppRoutes, ROUTES } from './router';
```

### Usar Constantes de Rutas
```typescript
import { ROUTES } from './router';

// En lugar de strings hardcodeados
<Link to={ROUTES.LOGIN}>Iniciar Sesión</Link>
```

### Verificar Acceso a Rutas
```typescript
import { checkRouteAccess } from './router/config/guards';

const canAccess = checkRouteAccess('/admin/panel', userRole);
```

## 🔄 Migración Completada

- ✅ Archivos renombrados con nomenclatura consistente
- ✅ Estructura de carpetas organizada
- ✅ Constantes de rutas centralizadas
- ✅ Guards de protección implementados
- ✅ Componentes de error 404 mejorados
- ✅ Exportaciones centralizadas
- ✅ Documentación completa

## 📝 Convenciones

- **Nomenclatura**: PascalCase para archivos de rutas
- **Estructura**: Separar configuraciones de implementaciones
- **Constantes**: Usar `as const` para type safety
- **Comentarios**: Documentar cada sección de rutas
- **Error Handling**: Componentes específicos para cada contexto
