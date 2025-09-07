const express = require('express');
const { 
    getAllMaestros, 
    getMaestroById, 
    createMaestro, 
    updateMaestro, 
    deleteMaestro,
    getMaestrosByInstitucion,
    getMaestrosByCurso
} = require('../controllers/maestroController');

const router = express.Router();

// GET /api/maestros
router.get('/', getAllMaestros);

// GET /api/maestros/:id
router.get('/:id', getMaestroById);

// POST /api/maestros
router.post('/', createMaestro);

// PUT /api/maestros/:id
router.put('/:id', updateMaestro);

// DELETE /api/maestros/:id
router.delete('/:id', deleteMaestro);

// GET /api/maestros/institucion/:codigoInstitucion
router.get('/institucion/:codigoInstitucion', getMaestrosByInstitucion);

// GET /api/maestros/curso/:curso
router.get('/curso/:curso', getMaestrosByCurso);

module.exports = router;
