const express = require('express');
const { 
    getAllDirectores, 
    getDirectorById, 
    createDirector, 
    updateDirector, 
    deleteDirector,
    getDirectoresByInstitucion
} = require('../controllers/directorController');

const router = express.Router();

// GET /api/directores
router.get('/', getAllDirectores);

// GET /api/directores/:id
router.get('/:id', getDirectorById);

// POST /api/directores
router.post('/', createDirector);

// PUT /api/directores/:id
router.put('/:id', updateDirector);

// DELETE /api/directores/:id
router.delete('/:id', deleteDirector);

// GET /api/directores/institucion/:codigoInstitucion
router.get('/institucion/:codigoInstitucion', getDirectoresByInstitucion);

module.exports = router;
