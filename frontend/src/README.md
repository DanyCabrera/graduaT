# Estructura del Frontend - GraduaT

Esta es la nueva estructura organizada del frontend del proyecto GraduaT, siguiendo las mejores prácticas para proyectos React/TypeScript.

## 📁 Estructura de Carpetas

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes de interfaz básicos
│   │   └── panelCardRol.tsx
│   ├── forms/           # Componentes de formularios
│   │   └── codigoAcceso.tsx
│   ├── layout/          # Componentes de layout
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── common/          # Componentes comunes
│       ├── Alumno/
│       ├── Maestro/
│       └── admin/
├── pages/               # Páginas principales
│   ├── auth/            # Páginas de autenticación
│   │   └── login/
│   ├── admin/           # Páginas de administración
│   ├── institution/     # Páginas de institución
│   │   └── loginIntitucion/
│   └── roles/           # Páginas por roles
│       ├── alumno.tsx
│       ├── director.tsx
│       ├── maestro.tsx
│       └── supervisor.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   └── index.ts
├── services/            # Servicios API
│   ├── api.ts
│   └── index.ts
├── utils/               # Utilidades
│   └── index.ts
├── types/               # Definiciones de tipos TypeScript
│   └── index.ts
├── constants/           # Constantes de la aplicación
│   └── index.ts
├── styles/              # Estilos globales
│   ├── App.css
│   └── index.css
├── assets/              # Recursos estáticos
└── router/              # Configuración de rutas
    ├── router.tsx
    ├── routerAdmin.tsx
    └── routeInsti.tsx
```

## 🎯 Beneficios de esta Estructura

### 1. **Organización Clara**
- Separación lógica de responsabilidades
- Fácil localización de archivos
- Estructura escalable

### 2. **Componentes Organizados**
- `ui/`: Componentes de interfaz reutilizables
- `forms/`: Componentes específicos de formularios
- `layout/`: Componentes de estructura de página
- `common/`: Componentes compartidos por funcionalidad

### 3. **Páginas Estructuradas**
- `auth/`: Todo lo relacionado con autenticación
- `admin/`: Páginas de administración
- `institution/`: Páginas de instituciones
- `roles/`: Páginas específicas por rol de usuario

### 4. **Código Reutilizable**
- `hooks/`: Custom hooks para lógica compartida
- `services/`: Servicios de API centralizados
- `utils/`: Funciones utilitarias
- `types/`: Definiciones de tipos TypeScript
- `constants/`: Constantes de la aplicación

## 🚀 Cómo Usar

### Importaciones
```typescript
// Importar tipos
import { User, UserRole } from '../types';

// Importar constantes
import { ROUTES, USER_ROLES } from '../constants';

// Importar utilidades
import { formatDate, validateEmail } from '../utils';

// Importar hooks
import { useAuth } from '../hooks';

// Importar servicios
import { apiService } from '../services';
```

### Agregar Nuevos Componentes
1. **Componente UI**: Colocar en `components/ui/`
2. **Formulario**: Colocar en `components/forms/`
3. **Layout**: Colocar en `components/layout/`
4. **Común**: Colocar en `components/common/`

### Agregar Nuevas Páginas
1. **Autenticación**: Colocar en `pages/auth/`
2. **Administración**: Colocar en `pages/admin/`
3. **Institución**: Colocar en `pages/institution/`
4. **Roles**: Colocar en `pages/roles/`

## 📝 Convenciones

- Usar nombres descriptivos para archivos y carpetas
- Mantener un archivo `index.ts` en cada carpeta para exportaciones
- Usar TypeScript para todos los archivos
- Seguir las convenciones de nomenclatura de React (PascalCase para componentes)

## 🔄 Migración Completada

- ✅ Componentes reorganizados por funcionalidad
- ✅ Páginas estructuradas por dominio
- ✅ Estilos centralizados en carpeta `styles/`
- ✅ Servicios y utilidades organizados
- ✅ Tipos y constantes definidos
- ✅ Hooks personalizados creados
- ✅ Importaciones actualizadas
