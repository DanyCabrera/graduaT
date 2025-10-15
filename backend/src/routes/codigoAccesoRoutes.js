const express = require('express');
const router = express.Router();
const codigoAccesoController = require('../controllers/codigoAccesoController');

// Rutas para códigos de acceso
router.post('/verificar', codigoAccesoController.verificarCodigo);
router.post('/obtener-rol-institucion', codigoAccesoController.obtenerCodigoRolInstitucion);
router.get('/institucion/:codigoInstitucion', codigoAccesoController.obtenerCodigoPorInstitucion);
router.get('/listar', codigoAccesoController.obtenerCodigos);
router.post('/crear', codigoAccesoController.crearCodigo);

module.exports = router;
