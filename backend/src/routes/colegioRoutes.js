const express = require('express');
const { 
    getAllColegios, 
    getColegioById, 
    createColegio, 
    updateColegio, 
    deleteColegio,
    getColegiosByDepartamento,
    getColegioByCode,
    toggleHabilitado
} = require('../controllers/colegioController');

const router = express.Router();

// GET /api/colegios
router.get('/', getAllColegios);

// GET /api/colegios/:id
router.get('/:id', getColegioById);

// POST /api/colegios
router.post('/', createColegio);

// PUT /api/colegios/:id
router.put('/:id', updateColegio);

// DELETE /api/colegios/:id
router.delete('/:id', deleteColegio);

// GET /api/colegios/departamento/:departamento
router.get('/departamento/:departamento', getColegiosByDepartamento);

// GET /api/colegios/codigo/:codigo
router.get('/codigo/:codigo', getColegioByCode);

// PATCH /api/colegios/:id/habilitado
router.patch('/:id/habilitado', toggleHabilitado);

module.exports = router;
