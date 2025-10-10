const express = require('express');
const router = express.Router();
const codigoAccesoController = require('../controllers/codigoAccesoController');

// Rutas para códigos de acceso
router.post('/verificar', codigoAccesoController.verificarCodigo);
router.post('/obtener-rol-institucion', codigoAccesoController.obtenerCodigoRolInstitucion);
router.get('/listar', codigoAccesoController.obtenerCodigos);

module.exports = router;
