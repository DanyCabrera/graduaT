const { getDB } = require('../config/db');

class Comunicacion {
    static async findAll() {
        try {
            const db = await getDB();
            const comunicacion = await db.collection('comunicacions').find({}).sort({ semana: 1 }).toArray();
            return comunicacion;
        } catch (error) {
            throw error;
        }
    }

    static async findOne(query) {
        try {
            const db = await getDB();
            const comunicacion = await db.collection('comunicacions').findOne(query);
            return comunicacion;
        } catch (error) {
            throw error;
        }
    }

    static async insertMany(documents) {
        try {
            const db = await getDB();
            const result = await db.collection('comunicacions').insertMany(documents);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteMany(query = {}) {
        try {
            const db = await getDB();
            const result = await db.collection('comunicacions').deleteMany(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findLastWeek() {
        try {
            const db = await getDB();
            const comunicacion = await db.collection('comunicacions').findOne({}, { sort: { semana: -1 } });
            return comunicacion;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Comunicacion;
