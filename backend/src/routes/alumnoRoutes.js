const express = require('express');
const { 
    getAllAlumnos, 
    getAlumnoById, 
    createAlumno, 
    updateAlumno, 
    deleteAlumno,
    getAlumnosByInstitucion,
    getAlumnosByCurso
} = require('../controllers/alumnoController');

const router = express.Router();

// GET /api/alumnos
router.get('/', getAllAlumnos);

// GET /api/alumnos/:id
router.get('/:id', getAlumnoById);

// POST /api/alumnos
router.post('/', createAlumno);

// PUT /api/alumnos/:id
router.put('/:id', updateAlumno);

// DELETE /api/alumnos/:id
router.delete('/:id', deleteAlumno);

// GET /api/alumnos/institucion/:codigoInstitucion
router.get('/institucion/:codigoInstitucion', getAlumnosByInstitucion);

// GET /api/alumnos/curso/:codigoCurso
router.get('/curso/:codigoCurso', getAlumnosByCurso);

module.exports = router;
