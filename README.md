# GraduaT
# bajar cambios de github
```
graduaT/
git checkout .
git pull origin main


cd frontend
cd backend

/frontend > npm install
/backend > npm install
```

## Para levanar el proyecto tiene que estar dentro de la carpeta /frontend y correr el siguiente comando
```
/frontend > npm run dev

http://localhost:5173/
```

## Para ver si el /backend esta corriendo bien
```
/backend > npm start

        Esto tiene que salir en la terminal
🔄 Intentando conectar a MongoDB Atlas...
📊 Base de datos: dbgraduat
🌐 Cluster: dbgraduat
✅ Cliente MongoDB conectado
✅ Base de datos "dbgraduat" seleccionada
✅ Ping exitoso - Conexión verificada
🎉 Conectado a MongoDB Atlas exitosamente
✅ Todas las colecciones fueron creadas correctamente.
🚀 Servidor corriendo en puerto 5000
🌐 URL: http://localhost:5000
📊 Entorno: development
```

## Keyri
### Rediseñar la pagina NotFound
```
Ir a:
/frontend/src/components/ui/NotFound.jsx
```

## Fernanda
### Rediseñar los formulario de los roles colocarle una barra de navegacion que tenga solo el logo y nombre de la plataforma y el btn de regresar
- en cada formulario ya tiene el btn de regresar, solo de moverlo a la barra de navegacion y darle otro tipo de diseño.
```
el logo y nombre de la plataforma lo encontraras en la carpeta de: 
/frontend/src/assets/
```
```
Ir a:
/frontend/src/pages/auth/login/registro.tsx
```

# Material UI
- Ir a esta pagina para buscar los estilos que se van a usar
```
https://mui.com/material-ui/all-components/
```

# Subir cambios a github
```
En la raiz del proyecto
/graduaT
ejecutar estos comandos
git add .
git commit -m "commit de la tara que realizo"
git push origin main
```