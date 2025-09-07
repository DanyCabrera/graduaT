const { getDB } = require('../config/db');

class Curso {
    constructor(data) {
        this.Código = data.Código;
        this.Nombre_Curso = data.Nombre_Curso;
    }

    static async create(cursoData) {
        try {
            const db = await getDB();
            const result = await db.collection('Cursos').insertOne(new Curso(cursoData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const cursos = await db.collection('Cursos').find({}).toArray();
            return cursos;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const curso = await db.collection('Cursos').findOne({ _id: id });
            return curso;
        } catch (error) {
            throw error;
        }
    }

    static async findByCodigo(codigo) {
        try {
            const db = await getDB();
            const curso = await db.collection('Cursos').findOne({ Código: codigo });
            return curso;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Cursos').updateOne(
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
            const result = await db.collection('Cursos').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Curso;
