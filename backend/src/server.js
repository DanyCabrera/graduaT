const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, createCollections } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const maestroRoutes = require('./routes/maestroRoutes');
const directorRoutes = require('./routes/directorRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const resultadoRoutes = require('./routes/resultadoRoutes');
const colegioRoutes = require('./routes/colegioRoutes');
const userAdminRoutes = require('./routes/userAdminRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const testRoutes = require('./routes/testRoutes');
const testAssignmentRoutes = require('./routes/testAssignmentRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/maestros', maestroRoutes);
app.use('/api/directores', directorRoutes);
app.use('/api/supervisores', supervisorRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/resultados', resultadoRoutes);
app.use('/api/colegios', colegioRoutes);
app.use('/api/useradmin', userAdminRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-assignments', testAssignmentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 Backend graduaT funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            alumnos: '/api/alumnos',
            maestros: '/api/maestros',
            directores: '/api/directores',
            supervisores: '/api/supervisores',
            cursos: '/api/cursos',
            resultados: '/api/resultados',
            colegios: '/api/colegios',
            useradmin: '/api/useradmin',
            agenda: '/api/agenda',
            tests: '/api/tests',
            testAssignments: '/api/test-assignments'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
async function startServer() {
    try {
        await connectDB();
        await createCollections();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();