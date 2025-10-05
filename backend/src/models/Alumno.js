const { getDB } = require('../config/db');

class Alumno {
    constructor(data) {
        this.Apellido = data.Apellido;
        this.Código_Curso = data.Código_Curso;
        this.Código_Rol = data.Código_Rol;
        this.Código_Institución = data.Código_Institución;
        this.Correo = data.Correo;
        this.Nombre = data.Nombre;
        this.Rol = data.Rol;
        this.Teléfono = data.Teléfono;
        this.Usuario = data.Usuario;
        this.habilitado = data.habilitado !== undefined ? data.habilitado : true;
    }

    static async create(alumnoData) {
        try {
            const db = await getDB();
            const result = await db.collection('Alumnos').insertOne(new Alumno(alumnoData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const alumnos = await db.collection('Alumnos').find({}).toArray();
            return alumnos;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const alumno = await db.collection('Alumnos').findOne({ _id: id });
            return alumno;
        } catch (error) {
            throw error;
        }
    }

    static async findByUsuario(usuario) {
        try {
            const db = await getDB();
            const alumno = await db.collection('Alumnos').findOne({ Usuario: usuario });
            return alumno;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Alumnos').updateOne(
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
            const result = await db.collection('Alumnos').updateOne(
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
            const result = await db.collection('Alumnos').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByInstitucion(codigoInstitucion) {
        try {
            const db = await getDB();
            const alumnos = await db.collection('Alumnos').find({ 
                Código_Institución: codigoInstitucion 
            }).toArray();
            return alumnos;
        } catch (error) {
            throw error;
        }
    }

    static async findByCurso(codigoCurso) {
        try {
            const db = await getDB();
            const alumnos = await db.collection('Alumnos').find({ 
                Código_Curso: codigoCurso 
            }).toArray();
            return alumnos;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Alumno;
