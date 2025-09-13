const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class UserAdmin {
    constructor(data) {
        this.Nombre = data.Nombre;
        this.Apellido = data.Apellido;
        this.Usuario = data.Usuario;
        this.Correo = data.Correo;
        this.Telefono = data.Telefono;
        this.Contraseña = data.Contraseña;
        this.Confirmar_Contraseña = data.Confirmar_Contraseña;
        this.emailVerificado = data.emailVerificado || false;
        this.tokenVerificacion = data.tokenVerificacion || null;
        this.fechaCreacion = data.fechaCreacion || new Date();
        this.fechaActualizacion = data.fechaActualizacion || new Date();
    }

    // Validar datos del modelo
    validate() {
        const errors = [];

        if (!this.Nombre || this.Nombre.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!this.Apellido || this.Apellido.trim().length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        }

        if (!this.Usuario || this.Usuario.trim().length < 3) {
            errors.push('El usuario debe tener al menos 3 caracteres');
        }

        if (!this.Correo || !this.isValidEmail(this.Correo)) {
            errors.push('El correo electrónico no es válido');
        }

        if (!this.Telefono || this.Telefono.trim().length < 8) {
            errors.push('El teléfono debe tener al menos 8 caracteres');
        }

        if (!this.Contraseña || this.Contraseña.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        if (this.Contraseña !== this.Confirmar_Contraseña) {
            errors.push('Las contraseñas no coinciden');
        }

        return errors;
    }

    // Validar formato de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Encriptar contraseña
    async encryptPassword() {
        if (this.Contraseña) {
            const saltRounds = 10;
            this.Contraseña = await bcrypt.hash(this.Contraseña, saltRounds);
            this.Confirmar_Contraseña = this.Contraseña; // Ambas contraseñas encriptadas igual
        }
    }

    // Generar token de verificación
    generateVerificationToken() {
        const crypto = require('crypto');
        this.tokenVerificacion = crypto.randomBytes(32).toString('hex');
        return this.tokenVerificacion;
    }

    // Verificar contraseña
    async verifyPassword(password) {
        return await bcrypt.compare(password, this.Contraseña);
    }

    // Convertir a objeto sin contraseña
    toJSON() {
        const { Contraseña, Confirmar_Contraseña, ...userAdminData } = this;
        return userAdminData;
    }

    // Métodos estáticos para operaciones de base de datos

    // Crear nuevo administrador
    static async create(data) {
        try {
            const userAdmin = new UserAdmin(data);
            const validationErrors = userAdmin.validate();
            
            if (validationErrors.length > 0) {
                throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
            }

            await userAdmin.encryptPassword();
            userAdmin.generateVerificationToken();
            
            const db = await getDB();
            const result = await db.collection('UserAdmin').insertOne(userAdmin);
            
            return {
                success: true,
                data: {
                    id: result.insertedId,
                    ...userAdmin.toJSON()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Buscar por usuario
    static async findByUsuario(usuario) {
        try {
            const db = await getDB();
            const userAdmin = await db.collection('UserAdmin').findOne({ Usuario: usuario });
            return userAdmin;
        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    // Buscar por correo
    static async findByCorreo(correo) {
        try {
            const db = await getDB();
            const userAdmin = await db.collection('UserAdmin').findOne({ Correo: correo });
            return userAdmin;
        } catch (error) {
            throw new Error(`Error al buscar por correo: ${error.message}`);
        }
    }

    // Buscar por ID
    static async findById(id) {
        try {
            const db = await getDB();
            const userAdmin = await db.collection('UserAdmin').findOne({ _id: new ObjectId(id) });
            return userAdmin;
        } catch (error) {
            throw new Error(`Error al buscar por ID: ${error.message}`);
        }
    }

    // Obtener todos los administradores
    static async findAll() {
        try {
            const db = await getDB();
            const userAdmins = await db.collection('UserAdmin').find({}).toArray();
            return userAdmins.map(admin => {
                const { Contraseña, Confirmar_Contraseña, ...adminData } = admin;
                return adminData;
            });
        } catch (error) {
            throw new Error(`Error al obtener administradores: ${error.message}`);
        }
    }

    // Actualizar administrador
    static async updateById(id, updateData) {
        try {
            const db = await getDB();
            const userAdmin = new UserAdmin(updateData);
            const validationErrors = userAdmin.validate();
            
            if (validationErrors.length > 0) {
                throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
            }

            await userAdmin.encryptPassword();
            
            const result = await db.collection('UserAdmin').updateOne(
                { _id: new ObjectId(id) },
                { $set: userAdmin }
            );

            return {
                success: result.modifiedCount > 0,
                modifiedCount: result.modifiedCount
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Eliminar administrador
    static async deleteById(id) {
        try {
            const db = await getDB();
            const result = await db.collection('UserAdmin').deleteOne({ _id: new ObjectId(id) });
            
            return {
                success: result.deletedCount > 0,
                deletedCount: result.deletedCount
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verificar si usuario existe
    static async userExists(usuario, correo) {
        try {
            const db = await getDB();
            const existingUser = await db.collection('UserAdmin').findOne({
                $or: [
                    { Usuario: usuario },
                    { Correo: correo }
                ]
            });
            return !!existingUser;
        } catch (error) {
            throw new Error(`Error al verificar usuario: ${error.message}`);
        }
    }

    // Buscar por token de verificación
    static async findByVerificationToken(token) {
        try {
            const db = await getDB();
            const userAdmin = await db.collection('UserAdmin').findOne({ tokenVerificacion: token });
            return userAdmin;
        } catch (error) {
            throw new Error(`Error al buscar por token: ${error.message}`);
        }
    }

    // Verificar email
    static async verifyEmail(token) {
        try {
            const db = await getDB();
            const result = await db.collection('UserAdmin').updateOne(
                { tokenVerificacion: token },
                { 
                    $set: { 
                        emailVerificado: true,
                        tokenVerificacion: null,
                        fechaActualizacion: new Date()
                    } 
                }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }
}

module.exports = UserAdmin;
