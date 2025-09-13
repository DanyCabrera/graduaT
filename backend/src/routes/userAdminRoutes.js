const express = require('express');
const { body } = require('express-validator');
const {
    getAllUserAdmins,
    getUserAdminById,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin,
    loginUserAdmin,
    verifyEmail
} = require('../controllers/userAdminController');

const router = express.Router();

// Validaciones para crear/actualizar administrador
const userAdminValidation = [
    body('Nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    
    body('Apellido')
        .notEmpty()
        .withMessage('El apellido es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
    
    body('Usuario')
        .notEmpty()
        .withMessage('El usuario es requerido')
        .isLength({ min: 3, max: 30 })
        .withMessage('El usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El usuario solo puede contener letras, números y guiones bajos'),
    
    body('Correo')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    
    body('Telefono')
        .notEmpty()
        .withMessage('El teléfono es requerido')
        .isLength({ min: 8, max: 15 })
        .withMessage('El teléfono debe tener entre 8 y 15 caracteres'),
    
    body('Contraseña')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    
    body('Confirmar_Contraseña')
        .custom((value, { req }) => {
            if (value !== req.body.Contraseña) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

// Validaciones para login
const loginValidation = [
    body('Usuario')
        .notEmpty()
        .withMessage('El usuario es requerido'),
    
    body('Contraseña')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// Rutas
router.get('/', getAllUserAdmins);                    // GET /api/useradmin - Obtener todos los administradores
router.get('/:id', getUserAdminById);                 // GET /api/useradmin/:id - Obtener administrador por ID
router.post('/', userAdminValidation, createUserAdmin); // POST /api/useradmin - Crear nuevo administrador
router.put('/:id', userAdminValidation, updateUserAdmin); // PUT /api/useradmin/:id - Actualizar administrador
router.delete('/:id', deleteUserAdmin);               // DELETE /api/useradmin/:id - Eliminar administrador
router.post('/login', loginValidation, loginUserAdmin); // POST /api/useradmin/login - Login de administrador
router.get('/verify-email/:token', verifyEmail);      // GET /api/useradmin/verify-email/:token - Verificar email

module.exports = router;
