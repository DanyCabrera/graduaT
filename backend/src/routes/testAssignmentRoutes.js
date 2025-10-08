const express = require('express');
const router = express.Router();
const testAssignmentController = require('../controllers/testAssignmentController');

// Rutas para estudiantes
router.get('/student', testAssignmentController.getAssignedTestsForStudent);
router.get('/student/:testType/:testId', testAssignmentController.getTestForStudent);
router.post('/student/:testType/:testId/submit', testAssignmentController.submitTestAnswers);
router.get('/student/history', testAssignmentController.getTestHistory);
router.get('/student/results', testAssignmentController.getStudentTestResults);

// Rutas para maestros
router.get('/teacher/results', testAssignmentController.getTeacherStudentTestResults);
router.get('/teacher/notifications', testAssignmentController.getNotifications);
router.get('/teacher/assigned', testAssignmentController.getAssignedTestsForTeacher);
router.put('/teacher/notifications/:notificationId/read', testAssignmentController.markNotificationAsRead);
router.delete('/teacher/clear-all', testAssignmentController.clearAllTestAssignments);

module.exports = router;
