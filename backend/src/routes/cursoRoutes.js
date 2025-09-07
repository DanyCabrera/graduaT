const express = require('express');
const { 
    getAllCursos, 
    getCursoById, 
    createCurso, 
    updateCurso, 
    deleteCurso
} = require('../controllers/cursoController');

const router = express.Router();

// GET /api/cursos
router.get('/', getAllCursos);

// GET /api/cursos/:id
router.get('/:id', getCursoById);

// POST /api/cursos
router.post('/', createCurso);

// PUT /api/cursos/:id
router.put('/:id', updateCurso);

// DELETE /api/cursos/:id
router.delete('/:id', deleteCurso);

module.exports = router;
