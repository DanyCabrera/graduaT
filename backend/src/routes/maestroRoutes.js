const express = require('express');
const { 
    getAllMaestros, 
    getMaestroById, 
    createMaestro, 
    updateMaestro, 
    deleteMaestro,
    getMaestrosByInstitucion,
    getMaestrosByCurso,
    getMaestrosByCursos,
    getMaestroByUsuario,
    getMaestrosForAlumno
} = require('../controllers/maestroController');

const router = express.Router();

// GET /api/maestros
router.get('/', getAllMaestros);

// GET /api/maestros/for-alumno (DEBE ir antes de /:id)
router.get('/for-alumno', getMaestrosForAlumno);

// GET /api/maestros/institucion/:codigoInstitucion
router.get('/institucion/:codigoInstitucion', getMaestrosByInstitucion);

// GET /api/maestros/curso/:curso
router.get('/curso/:curso', getMaestrosByCurso);

// GET /api/maestros/usuario/:usuario
router.get('/usuario/:usuario', getMaestroByUsuario);

// GET /api/maestros/:id (DEBE ir al final)
router.get('/:id', getMaestroById);

// POST /api/maestros
router.post('/', createMaestro);

// PUT /api/maestros/:id
router.put('/:id', updateMaestro);

// DELETE /api/maestros/:id
router.delete('/:id', deleteMaestro);

// POST /api/maestros/cursos
router.post('/cursos', getMaestrosByCursos);

module.exports = router;
