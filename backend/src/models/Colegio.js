const { getDB } = require('../config/db');

class Colegio {
    constructor(data) {
        this.Código_Institución = data.Código_Institución;
        this.Código_Alumno = data.Código_Alumno;
        this.Código_Director = data.Código_Director;
        this.Código_Maestro = data.Código_Maestro;
        this.Correo = data.Correo;
        this.DEPARTAMENTO = data.DEPARTAMENTO;
        this.Dirección = data.Dirección;
        this.ID_Colegio = data.ID_Colegio;
        this.Nombre_Completo = data.Nombre_Completo;
        this.Teléfono = data.Teléfono;
    }

    static async create(colegioData) {
        try {
            const db = await getDB();
            const result = await db.collection('Colegio').insertOne(new Colegio(colegioData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const colegios = await db.collection('Colegio').find({}).toArray();
            return colegios;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const colegio = await db.collection('Colegio').findOne({ _id: id });
            return colegio;
        } catch (error) {
            throw error;
        }
    }

    static async findByCodigoInstitucion(codigoInstitucion) {
        try {
            const db = await getDB();
            const colegio = await db.collection('Colegio').findOne({ 
                Código_Institución: codigoInstitucion 
            });
            return colegio;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Colegio').updateOne(
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
            const result = await db.collection('Colegio').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByDepartamento(departamento) {
        try {
            const db = await getDB();
            const colegios = await db.collection('Colegio').find({ 
                DEPARTAMENTO: departamento 
            }).toArray();
            return colegios;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Colegio;
