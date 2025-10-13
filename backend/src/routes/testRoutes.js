const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// Middleware de autenticación (puedes agregar tu middleware aquí)
// const authMiddleware = require('../middleware/auth');

// Rutas para obtener tests
router.get('/matematicas', testController.getTestsMatematicas);
router.get('/comunicacion', testController.getTestsComunicacion);
router.get('/by-course', testController.getTestsByCourse);
router.get('/:tipo/:id', testController.getTestById);

// Rutas para asignación de tests
router.post('/assign', testController.assignTestToStudents);
router.post('/assign-existing', testController.assignExistingTestsToStudents);
router.post('/test-auto-assignment', testController.testAutoAssignment);
router.post('/reassign-to-new-student', testController.reassignTestsToNewStudents);
router.get('/assignments', testController.getTestAssignments);
router.get('/assignments/debug', testController.getAssignmentsByInstitution);
router.get('/debug-assignments/:institutionId', testController.debugAssignments);

module.exports = router;
