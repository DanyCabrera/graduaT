const { getDB } = require('../config/db');

class Maestro {
    constructor(data) {
        this.Apellido = data.Apellido;
        this.Código_Institución = data.Código_Institución;
        this.Código_Rol = data.Código_Rol;
        this.Correo = data.Correo;
        this.CURSO = data.CURSO;
        this.Nombre = data.Nombre;
        this.Rol = data.Rol;
        this.Teléfono = data.Teléfono;
        this.Usuario = data.Usuario;
    }

    static async create(maestroData) {
        try {
            const db = await getDB();
            const result = await db.collection('Maestros').insertOne(new Maestro(maestroData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const maestros = await db.collection('Maestros').find({}).toArray();
            return maestros;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const maestro = await db.collection('Maestros').findOne({ _id: id });
            return maestro;
        } catch (error) {
            throw error;
        }
    }

    static async findByUsuario(usuario) {
        try {
            const db = await getDB();
            const maestro = await db.collection('Maestros').findOne({ Usuario: usuario });
            return maestro;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Maestros').updateOne(
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
            const result = await db.collection('Maestros').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByInstitucion(codigoInstitucion) {
        try {
            const db = await getDB();
            const maestros = await db.collection('Maestros').find({ 
                Código_Institución: codigoInstitucion 
            }).toArray();
            return maestros;
        } catch (error) {
            throw error;
        }
    }

    static async findByCurso(curso) {
        try {
            const db = await getDB();
            const maestros = await db.collection('Maestros').find({ 
                CURSO: curso 
            }).toArray();
            return maestros;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Maestro;
