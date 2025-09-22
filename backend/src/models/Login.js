const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');

class Login {
    constructor(data) {
        this.Apellido = data.Apellido;
        this.Código_Institución = data.Código_Institución || '';
        this.Nombre_Institución = data.Nombre_Institución || '';
        this.Código_Rol = data.Código_Rol || '';
        this.Contraseña = data.Contraseña;
        this.Correo = data.Correo;
        this.Nombre = data.Nombre;
        this.Rol = data.Rol;
        this.Teléfono = data.Teléfono;
        this.Usuario = data.Usuario;
        this.emailVerificado = data.emailVerificado || false;
        this.tokenVerificacion = data.tokenVerificacion || '';
    }

    static async create(loginData) {
        try {
            const db = await getDB();
            
            // Log de los datos antes de crear el objeto
            console.log('Datos recibidos en Login.create:', JSON.stringify(loginData, null, 2));
            
            // Encriptar contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(loginData.Contraseña, saltRounds);
            
            const login = new Login({
                ...loginData,
                Contraseña: hashedPassword
            });
            
            // Log del objeto Login creado
            console.log('Objeto Login creado:', JSON.stringify(login, null, 2));
            
            const result = await db.collection('Login').insertOne(login);
            return result;
        } catch (error) {
            console.error('Error en Login.create:', error);
            throw error;
        }
    }

    static async findByUsuario(usuario) {
        try {
            const db = await getDB();
            const login = await db.collection('Login').findOne({ Usuario: usuario });
            return login;
        } catch (error) {
            throw error;
        }
    }

    static async findByCorreo(correo) {
        try {
            const db = await getDB();
            const login = await db.collection('Login').findOne({ Correo: correo });
            return login;
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    static async updatePassword(usuario, newPassword) {
        try {
            const db = await getDB();
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            
            const result = await db.collection('Login').updateOne(
                { Usuario: usuario },
                { $set: { Contraseña: hashedPassword } }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            
            // Si se actualiza la contraseña, encriptarla
            if (updateData.Contraseña) {
                const saltRounds = 10;
                updateData.Contraseña = await bcrypt.hash(updateData.Contraseña, saltRounds);
            }
            
            const result = await db.collection('Login').updateOne(
                { _id: id },
                { $set: updateData }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const db = await getDB();
            const result = await db.collection('Login').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const logins = await db.collection('Login').find({}).toArray();
            return logins;
        } catch (error) {
            throw error;
        }
    }

    static async updateVerificationToken(usuario, token) {
        try {
            const db = await getDB();
            const result = await db.collection('Login').updateOne(
                { Usuario: usuario },
                { 
                    $set: { 
                        tokenVerificacion: token,
                        emailVerificado: false
                    } 
                }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByVerificationToken(token) {
        try {
            const db = await getDB();
            const login = await db.collection('Login').findOne({ tokenVerificacion: token });
            return login;
        } catch (error) {
            throw error;
        }
    }

    static async markEmailAsVerified(usuario) {
        try {
            const db = await getDB();
            const result = await db.collection('Login').updateOne(
                { Usuario: usuario },
                { 
                    $set: { 
                        emailVerificado: true,
                        tokenVerificacion: null
                    } 
                }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Login;
