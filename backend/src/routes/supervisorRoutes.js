const express = require('express');
const { 
    getAllSupervisores, 
    getSupervisorById, 
    createSupervisor, 
    updateSupervisor, 
    deleteSupervisor,
    getSupervisoresByDepartamento
} = require('../controllers/supervisorController');

const router = express.Router();

// GET /api/supervisores
router.get('/', getAllSupervisores);

// GET /api/supervisores/:id
router.get('/:id', getSupervisorById);

// POST /api/supervisores
router.post('/', createSupervisor);

// PUT /api/supervisores/:id
router.put('/:id', updateSupervisor);

// DELETE /api/supervisores/:id
router.delete('/:id', deleteSupervisor);

// GET /api/supervisores/departamento/:departamento
router.get('/departamento/:departamento', getSupervisoresByDepartamento);

module.exports = router;
