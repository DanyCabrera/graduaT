// Este archivo es un punto de entrada alternativo
// El archivo principal es server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, createCollections } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 Backend graduaT - App.js',
        status: 'running'
    });
});

// Iniciar servidor
async function startApp() {
    try {
        await connectDB();
        await createCollections();
        
        app.listen(PORT, () => {
            console.log(`🚀 App corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar la app:', error);
    }
}

// Solo iniciar si este archivo se ejecuta directamente
if (require.main === module) {
    startApp();
}

module.exports = app;
