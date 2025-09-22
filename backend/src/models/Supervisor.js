const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');

class Supervisor {
    constructor(data) {
        this.Apellido = data.Apellido;
        this.Código = data.Código;
        this.Correo = data.Correo;
        this.DEPARTAMENTO = data.DEPARTAMENTO;
        this.Nombre = data.Nombre;
        this.Rol = data.Rol;
        this.Teléfono = data.Teléfono;
        this.Usuario = data.Usuario;
        this.Contraseña = data.Contraseña;
        this.Código_Institución = data.Código_Institución;
        this.Nombre_Institución = data.Nombre_Institución;
        this.emailVerificado = data.emailVerificado;
        this.tokenVerificacion = data.tokenVerificacion;
    }

    static async create(supervisorData) {
        try {
            const db = await getDB();
            
            // No encriptar contraseña aquí ya que se hace en Login.create
            // Solo crear el objeto Supervisor con los datos proporcionados
            
            const result = await db.collection('Supervisores').insertOne(new Supervisor(supervisorData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const supervisores = await db.collection('Supervisores').find({}).toArray();
            return supervisores;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const supervisor = await db.collection('Supervisores').findOne({ _id: id });
            return supervisor;
        } catch (error) {
            throw error;
        }
    }

    static async findByUsuario(usuario) {
        try {
            const db = await getDB();
            const supervisor = await db.collection('Supervisores').findOne({ Usuario: usuario });
            return supervisor;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Supervisores').updateOne(
                { _id: id },
                { $set: updateData }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateByUsuario(usuario, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Supervisores').updateOne(
                { Usuario: usuario },
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
            const result = await db.collection('Supervisores').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByDepartamento(departamento) {
        try {
            const db = await getDB();
            const supervisores = await db.collection('Supervisores').find({ 
                DEPARTAMENTO: departamento 
            }).toArray();
            return supervisores;
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

    static async updateVerificationToken(usuario, token) {
        try {
            const db = await getDB();
            const result = await db.collection('Supervisores').updateOne(
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

    static async markEmailAsVerified(usuario) {
        try {
            const db = await getDB();
            const result = await db.collection('Supervisores').updateOne(
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

module.exports = Supervisor;
