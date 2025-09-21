const express = require('express');
const { login, register, verifyToken, changePassword, sendVerificationEmail, verifyEmail, updateUserInstitution } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// GET /api/auth/verify
router.get('/verify', verifyToken);

// PUT /api/auth/change-password
router.put('/change-password', changePassword);

// POST /api/auth/send-verification-email
router.post('/send-verification-email', sendVerificationEmail);

// GET /api/auth/verify-email
router.get('/verify-email', verifyEmail);

// PUT /api/auth/update-institution
router.put('/update-institution', updateUserInstitution);

module.exports = router;
