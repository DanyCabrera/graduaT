const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

// Middleware de autenticación (opcional, ya que cada controlador maneja su propia autenticación)
// const authMiddleware = require('../middleware/auth');

// Ruta para obtener toda la agenda del maestro
router.get('/', agendaController.getAgendaMaestro);

// Ruta para generar nueva agenda (siguiente semana)
router.post('/generar', agendaController.generarNuevaAgenda);

// Ruta para obtener agenda de una semana específica
router.get('/semana/:semana', agendaController.getAgendaSemana);

module.exports = router;
