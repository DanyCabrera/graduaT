# Backend graduaT - Sistema Escolar

Backend completo para el sistema escolar graduaT desarrollado con Node.js, Express y MongoDB.

## 🚀 Características

- **API RESTful** completa para gestión escolar
- **Autenticación JWT** con encriptación de contraseñas
- **Validación de esquemas** en MongoDB
- **CORS** configurado para frontend
- **Manejo de errores** centralizado
- **Estructura modular** con modelos, controladores y rutas

## 📋 Entidades del Sistema

- **Alumnos**: Gestión de estudiantes
- **Maestros**: Gestión de profesores
- **Directores**: Gestión de directores
- **Supervisores**: Gestión de supervisores
- **Cursos**: Gestión de cursos
- **Resultados**: Gestión de calificaciones
- **Colegios**: Gestión de instituciones
- **Login**: Sistema de autenticación

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del backend con:
```env
MONGODB_URL=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=dbgraduat
PORT=5000
NODE_ENV=development
JWT_SECRET=mi_secreto_super_seguro
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=app_password
FRONTEND_URL=http://localhost:5173
```

**Nota sobre configuración de email:**
- `EMAIL_USER`: Tu dirección de Gmail
- `EMAIL_PASS`: Contraseña de aplicación de Gmail (no tu contraseña normal)
- Para generar una contraseña de aplicación:
  1. Ve a tu cuenta de Google
  2. Seguridad → Verificación en 2 pasos
  3. Contraseñas de aplicaciones
  4. Genera una nueva contraseña para "Correo"

3. **Ejecutar el servidor:**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token
- `PUT /api/auth/change-password` - Cambiar contraseña

### Administradores
- `GET /api/useradmin` - Obtener todos los administradores
- `GET /api/useradmin/:id` - Obtener administrador por ID
- `POST /api/useradmin` - Crear nuevo administrador
- `PUT /api/useradmin/:id` - Actualizar administrador
- `DELETE /api/useradmin/:id` - Eliminar administrador
- `POST /api/useradmin/login` - Login de administrador
- `GET /api/useradmin/verify-email/:token` - Verificar email

### Alumnos
- `GET /api/alumnos` - Obtener todos los alumnos
- `GET /api/alumnos/:id` - Obtener alumno por ID
- `POST /api/alumnos` - Crear alumno
- `PUT /api/alumnos/:id` - Actualizar alumno
- `DELETE /api/alumnos/:id` - Eliminar alumno
- `GET /api/alumnos/institucion/:codigo` - Alumnos por institución
- `GET /api/alumnos/curso/:codigo` - Alumnos por curso

### Maestros
- `GET /api/maestros` - Obtener todos los maestros
- `GET /api/maestros/:id` - Obtener maestro por ID
- `POST /api/maestros` - Crear maestro
- `PUT /api/maestros/:id` - Actualizar maestro
- `DELETE /api/maestros/:id` - Eliminar maestro
- `GET /api/maestros/institucion/:codigo` - Maestros por institución
- `GET /api/maestros/curso/:curso` - Maestros por curso

### Directores
- `GET /api/directores` - Obtener todos los directores
- `GET /api/directores/:id` - Obtener director por ID
- `POST /api/directores` - Crear director
- `PUT /api/directores/:id` - Actualizar director
- `DELETE /api/directores/:id` - Eliminar director
- `GET /api/directores/institucion/:codigo` - Directores por institución

### Supervisores
- `GET /api/supervisores` - Obtener todos los supervisores
- `GET /api/supervisores/:id` - Obtener supervisor por ID
- `POST /api/supervisores` - Crear supervisor
- `PUT /api/supervisores/:id` - Actualizar supervisor
- `DELETE /api/supervisores/:id` - Eliminar supervisor
- `GET /api/supervisores/departamento/:departamento` - Supervisores por departamento

### Cursos
- `GET /api/cursos` - Obtener todos los cursos
- `GET /api/cursos/:id` - Obtener curso por ID
- `POST /api/cursos` - Crear curso
- `PUT /api/cursos/:id` - Actualizar curso
- `DELETE /api/cursos/:id` - Eliminar curso

### Resultados
- `GET /api/resultados` - Obtener todos los resultados
- `GET /api/resultados/:id` - Obtener resultado por ID
- `POST /api/resultados` - Crear resultado
- `PUT /api/resultados/:id` - Actualizar resultado
- `DELETE /api/resultados/:id` - Eliminar resultado
- `GET /api/resultados/alumno/:codigo` - Resultados por alumno
- `GET /api/resultados/colegio/:codigo` - Resultados por colegio
- `GET /api/resultados/maestro/:codigo` - Resultados por maestro

### Colegios
- `GET /api/colegios` - Obtener todos los colegios
- `GET /api/colegios/:id` - Obtener colegio por ID
- `POST /api/colegios` - Crear colegio
- `PUT /api/colegios/:id` - Actualizar colegio
- `DELETE /api/colegios/:id` - Eliminar colegio
- `GET /api/colegios/departamento/:departamento` - Colegios por departamento

## 🗄️ Base de Datos

El sistema utiliza MongoDB Atlas con las siguientes colecciones:

- **Alumnos**: Información de estudiantes
- **Maestros**: Información de profesores
- **Directores**: Información de directores
- **Supervisores**: Información de supervisores
- **Cursos**: Información de cursos
- **Resultados**: Calificaciones y puntuaciones
- **Colegio**: Información de instituciones
- **Login**: Credenciales de acceso

Cada colección tiene validación de esquema para garantizar la integridad de los datos.

## 🔧 Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm test` - Ejecutar pruebas (pendiente de implementar)

## 📝 Notas Importantes

1. **Configuración de MongoDB**: Asegúrate de tener la URI correcta de MongoDB Atlas
2. **Variables de entorno**: Nunca subas el archivo `.env` al repositorio
3. **JWT Secret**: Usa un secret fuerte y único para producción
4. **CORS**: Configurado para el frontend en `http://localhost:5173`

## 🚀 Próximos Pasos

- [ ] Implementar middleware de autenticación
- [ ] Agregar validación de entrada con express-validator
- [ ] Implementar logging con Winston
- [ ] Agregar pruebas unitarias
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] Compresión de respuestas
