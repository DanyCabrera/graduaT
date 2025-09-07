const { getDB } = require('../config/db');

class Resultado {
    constructor(data) {
        this.Código_Alumnos = data.Código_Alumnos;
        this.Código_Colegios = data.Código_Colegios;
        this.Código_Directores = data.Código_Directores;
        this.Código_Maestros = data.Código_Maestros;
        this.Punteo = data.Punteo;
    }

    static async create(resultadoData) {
        try {
            const db = await getDB();
            const result = await db.collection('Resultados').insertOne(new Resultado(resultadoData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const resultados = await db.collection('Resultados').find({}).toArray();
            return resultados;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const resultado = await db.collection('Resultados').findOne({ _id: id });
            return resultado;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Resultados').updateOne(
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
            const result = await db.collection('Resultados').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByAlumno(codigoAlumno) {
        try {
            const db = await getDB();
            const resultados = await db.collection('Resultados').find({ 
                Código_Alumnos: codigoAlumno 
            }).toArray();
            return resultados;
        } catch (error) {
            throw error;
        }
    }

    static async findByColegio(codigoColegio) {
        try {
            const db = await getDB();
            const resultados = await db.collection('Resultados').find({ 
                Código_Colegios: codigoColegio 
            }).toArray();
            return resultados;
        } catch (error) {
            throw error;
        }
    }

    static async findByMaestro(codigoMaestro) {
        try {
            const db = await getDB();
            const resultados = await db.collection('Resultados').find({ 
                Código_Maestros: codigoMaestro 
            }).toArray();
            return resultados;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Resultado;
