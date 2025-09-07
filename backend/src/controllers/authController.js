const jwt = require('jsonwebtoken');
const Login = require('../models/Login');

// Generar JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            usuario: user.Usuario, 
            rol: user.Rol,
            codigoInstitucion: user.Código_Institución 
        },
        process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Login
const login = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        if (!usuario || !contraseña) {
            return res.status(400).json({
                error: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario en la colección Login
        const user = await Login.findByUsuario(usuario);
        
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await Login.verifyPassword(contraseña, user.Contraseña);
        
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user);

        // Respuesta exitosa (sin incluir la contraseña)
        const { Contraseña, ...userWithoutPassword } = user;
        
        res.json({
            message: 'Login exitoso',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Registro
const register = async (req, res) => {
    try {
        const userData = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await Login.findByUsuario(userData.Usuario);
        if (existingUser) {
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }

        // Verificar si el correo ya existe
        const existingEmail = await Login.findByCorreo(userData.Correo);
        if (existingEmail) {
            return res.status(400).json({
                error: 'El correo ya está registrado'
            });
        }

        // Crear nuevo usuario
        const result = await Login.create(userData);
        
        if (result.insertedId) {
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                userId: result.insertedId
            });
        } else {
            res.status(500).json({
                error: 'Error al crear el usuario'
            });
        }

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Verificar token
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                error: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
        
        res.json({
            valid: true,
            user: decoded
        });

    } catch (error) {
        res.status(401).json({
            error: 'Token inválido'
        });
    }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
    try {
        const { usuario, contraseñaActual, nuevaContraseña } = req.body;

        if (!usuario || !contraseñaActual || !nuevaContraseña) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        // Buscar usuario
        const user = await Login.findByUsuario(usuario);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const isValidPassword = await Login.verifyPassword(contraseñaActual, user.Contraseña);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Contraseña actual incorrecta'
            });
        }

        // Actualizar contraseña
        const result = await Login.updatePassword(usuario, nuevaContraseña);
        
        if (result.modifiedCount > 0) {
            res.json({
                message: 'Contraseña actualizada exitosamente'
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar la contraseña'
            });
        }

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    login,
    register,
    verifyToken,
    changePassword
};
