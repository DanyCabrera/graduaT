const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');

// Rutas para supervisor
router.get('/all-collections-info', supervisorController.getAllCollectionsInfo);
router.get('/database-info', supervisorController.getDatabaseInfo);
router.get('/retalhuleu-data', supervisorController.getRetalhuleuData);
router.get('/performance-stats/:departamento', supervisorController.getDepartmentPerformanceStats);
router.get('/institution-stats/:departamento', supervisorController.getInstitutionStatsByDepartment);

module.exports = router;