const express = require('express');
const router = express.Router();
const { generarEstructuraTema, generarEstructuraTemaSimple } = require('../controllers/geminiController');

// Ruta para generar estructura detallada de tema
router.post('/estructura-tema', generarEstructuraTema);

// Ruta para generar estructura simple de tema
router.post('/estructura-tema-simple', generarEstructuraTemaSimple);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Servicio de Gemini funcionando correctamente',
        timestamp: new Date()
    });
});

module.exports = router;
