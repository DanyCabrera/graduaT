const express = require('express');
const { 
    getAllResultados, 
    getResultadoById, 
    createResultado, 
    updateResultado, 
    deleteResultado,
    getResultadosByAlumno,
    getResultadosByColegio,
    getResultadosByMaestro
} = require('../controllers/resultadoController');

const router = express.Router();

// GET /api/resultados
router.get('/', getAllResultados);

// GET /api/resultados/:id
router.get('/:id', getResultadoById);

// POST /api/resultados
router.post('/', createResultado);

// PUT /api/resultados/:id
router.put('/:id', updateResultado);

// DELETE /api/resultados/:id
router.delete('/:id', deleteResultado);

// GET /api/resultados/alumno/:codigoAlumno
router.get('/alumno/:codigoAlumno', getResultadosByAlumno);

// GET /api/resultados/colegio/:codigoColegio
router.get('/colegio/:codigoColegio', getResultadosByColegio);

// GET /api/resultados/maestro/:codigoMaestro
router.get('/maestro/:codigoMaestro', getResultadosByMaestro);

module.exports = router;
