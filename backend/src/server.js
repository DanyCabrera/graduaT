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
const codigoAccesoRoutes = require('./routes/codigoAccesoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://graduat.vercel.app',
    'https://*.vercel.app'
];

// Agregar FRONTEND_URL si está configurada correctamente
if (process.env.FRONTEND_URL) {
    const frontendUrl = process.env.FRONTEND_URL.trim();
    if (frontendUrl.startsWith('http://') || frontendUrl.startsWith('https://')) {
        allowedOrigins.push(frontendUrl);
    }
}

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (como mobile apps o curl)
        if (!origin) return callback(null, true);
        
        // Verificar si el origin está en la lista permitida
        if (allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                // Manejar wildcards como *.vercel.app
                const pattern = allowedOrigin.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return allowedOrigin === origin;
        })) {
            return callback(null, true);
        }
        
        console.log('🚫 CORS bloqueado para origin:', origin);
        console.log('✅ Orígenes permitidos:', allowedOrigins);
        return callback(new Error('No permitido por CORS'), false);
    },
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
app.use('/api/codigos-acceso', codigoAccesoRoutes);
app.use('/api/supervisor-stats', supervisorRoutes);

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
            testAssignments: '/api/test-assignments',
            codigosAcceso: '/api/codigos-acceso',
            supervisorStats: '/api/supervisor-stats'
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