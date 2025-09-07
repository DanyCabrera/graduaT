const express = require('express');
const { login, register, verifyToken, changePassword } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// GET /api/auth/verify
router.get('/verify', verifyToken);

// PUT /api/auth/change-password
router.put('/change-password', changePassword);

module.exports = router;
