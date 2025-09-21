const { getDB } = require('../config/db');

class Director {
    constructor(data) {
        this.Apellido = data.Apellido;
        this.Código_Rol = data.Código_Rol;
        this.Código_Institución = data.Código_Institución;
        this.Correo = data.Correo;
        this.Nombre = data.Nombre;
        this.Rol = data.Rol;
        this.Teléfono = data.Teléfono;
        this.Usuario = data.Usuario;
    }

    static async create(directorData) {
        try {
            const db = await getDB();
            const result = await db.collection('Directores').insertOne(new Director(directorData));
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const db = await getDB();
            const directores = await db.collection('Directores').find({}).toArray();
            return directores;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await getDB();
            const director = await db.collection('Directores').findOne({ _id: id });
            return director;
        } catch (error) {
            throw error;
        }
    }

    static async findByUsuario(usuario) {
        try {
            const db = await getDB();
            const director = await db.collection('Directores').findOne({ Usuario: usuario });
            return director;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Directores').updateOne(
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
            const result = await db.collection('Directores').updateOne(
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
            const result = await db.collection('Directores').deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByInstitucion(codigoInstitucion) {
        try {
            const db = await getDB();
            const directores = await db.collection('Directores').find({ 
                Código_Institución: codigoInstitucion 
            }).toArray();
            return directores;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Director;
