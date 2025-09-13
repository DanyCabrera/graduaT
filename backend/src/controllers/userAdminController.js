const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const UserAdmin = require('../models/UserAdmin');
const emailService = require('../services/emailService');

// Obtener todos los administradores
const getAllUserAdmins = async (req, res) => {
    try {
        const db = await getDB();
        const userAdmins = await db.collection('UserAdmin').find({}).toArray();
        
        res.status(200).json({
            success: true,
            data: userAdmins,
            count: userAdmins.length
        });
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un administrador por ID
const getUserAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDB();
        const userAdmin = await db.collection('UserAdmin').findOne({ _id: new ObjectId(id) });
        
        if (!userAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: userAdmin
        });
    } catch (error) {
        console.error('Error al obtener administrador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo administrador
const createUserAdmin = async (req, res) => {
    try {
        // Validar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: errorMessages,
                details: errors.array()
            });
        }

        const { Nombre, Apellido, Usuario, Correo, Telefono, Contraseña, Confirmar_Contraseña } = req.body;
        
        // Verificar que las contraseñas coincidan
        if (Contraseña !== Confirmar_Contraseña) {
            return res.status(400).json({
                success: false,
                message: 'Las contraseñas no coinciden'
            });
        }

        // Verificar si el usuario ya existe usando el modelo
        const userExists = await UserAdmin.userExists(Usuario, Correo);
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'El usuario o correo ya existe'
            });
        }

        // Crear el nuevo administrador usando el modelo
        const result = await UserAdmin.create({
            Nombre,
            Apellido,
            Usuario,
            Correo,
            Telefono,
            Contraseña,
            Confirmar_Contraseña
        });

        if (result.success) {
            // Verificar que la contraseña se guardó hasheada (solo para debug)
            const userAdmin = await UserAdmin.findByUsuario(Usuario);
            if (userAdmin) {
                console.log('✅ Usuario creado exitosamente');
                console.log('🔐 Contraseña hasheada:', userAdmin.Contraseña.substring(0, 20) + '...');
                console.log('📧 Email verificado:', userAdmin.emailVerificado);
                console.log('🔑 Token generado:', userAdmin.tokenVerificacion ? 'Sí' : 'No');
            }

            // Enviar email de verificación
            try {
                if (userAdmin && userAdmin.tokenVerificacion) {
                    await emailService.sendVerificationEmail(
                        Correo, 
                        userAdmin.tokenVerificacion, 
                        Nombre
                    );
                }
            } catch (emailError) {
                console.error('Error al enviar email de verificación:', emailError);
                // No fallar el registro si el email falla
            }

            res.status(201).json({
                success: true,
                message: 'Administrador creado exitosamente. Revisa tu correo para confirmar tu cuenta.',
                data: result.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.error || 'Error al crear el administrador'
            });
        }
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un administrador
const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { Nombre, Apellido, Usuario, Correo, Telefono, Contraseña, Confirmar_Contraseña } = req.body;
        
        const db = await getDB();
        
        // Verificar si el administrador existe
        const existingUserAdmin = await db.collection('UserAdmin').findOne({ _id: new ObjectId(id) });
        if (!existingUserAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }

        // Preparar datos de actualización
        const updateData = {
            Nombre,
            Apellido,
            Usuario,
            Correo,
            Telefono,
            fechaActualizacion: new Date()
        };

        // Si se proporciona una nueva contraseña
        if (Contraseña && Confirmar_Contraseña) {
            if (Contraseña !== Confirmar_Contraseña) {
                return res.status(400).json({
                    success: false,
                    message: 'Las contraseñas no coinciden'
                });
            }
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(Contraseña, saltRounds);
            updateData.Contraseña = hashedPassword;
            updateData.Confirmar_Contraseña = hashedPassword;
        }

        const result = await db.collection('UserAdmin').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se realizaron cambios'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Administrador actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar administrador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un administrador
const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDB();
        
        const result = await db.collection('UserAdmin').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Administrador no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Administrador eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar administrador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Login de administrador
const loginUserAdmin = async (req, res) => {
    try {
        const { Usuario, Contraseña } = req.body;
        
        if (!Usuario || !Contraseña) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        const userAdmin = await UserAdmin.findByUsuario(Usuario);
        
        if (!userAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si el email está verificado
        if (!userAdmin.emailVerificado) {
            return res.status(401).json({
                success: false,
                message: 'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.'
            });
        }

        const isPasswordValid = await bcrypt.compare(Contraseña, userAdmin.Contraseña);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { 
                id: userAdmin._id,
                usuario: userAdmin.Usuario,
                email: userAdmin.Correo,
                rol: 'admin'
            },
            process.env.JWT_SECRET || 'mi_secreto_super_seguro',
            { expiresIn: '24h' }
        );

        // Remover la contraseña de la respuesta
        const { Contraseña: _, Confirmar_Contraseña: __, tokenVerificacion: ___, ...userAdminData } = userAdmin;

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            data: userAdminData
        });
    } catch (error) {
        console.error('Error en login de administrador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Verificar email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token de verificación requerido'
            });
        }

        const isVerified = await UserAdmin.verifyEmail(token);
        
        if (isVerified) {
            res.status(200).json({
                success: true,
                message: 'Email verificado exitosamente. Ya puedes iniciar sesión.'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }
    } catch (error) {
        console.error('Error al verificar email:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    getAllUserAdmins,
    getUserAdminById,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin,
    loginUserAdmin,
    verifyEmail
};
