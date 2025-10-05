const { getDB } = require('../config/db');

class Matematica {
    static async findAll() {
        try {
            const db = await getDB();
            const matematica = await db.collection('matematicas').find({}).sort({ semana: 1 }).toArray();
            return matematica;
        } catch (error) {
            throw error;
        }
    }

    static async findOne(query) {
        try {
            const db = await getDB();
            const matematica = await db.collection('matematicas').findOne(query);
            return matematica;
        } catch (error) {
            throw error;
        }
    }

    static async insertMany(documents) {
        try {
            const db = await getDB();
            const result = await db.collection('matematicas').insertMany(documents);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteMany(query = {}) {
        try {
            const db = await getDB();
            const result = await db.collection('matematicas').deleteMany(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findLastWeek() {
        try {
            const db = await getDB();
            const matematica = await db.collection('matematicas').findOne({}, { sort: { semana: -1 } });
            return matematica;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Matematica;
