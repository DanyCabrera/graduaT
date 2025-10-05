const { getDB } = require('../config/db');

class Maestro {
    constructor(data) {
        this.Apellido = data.Apellido;
        this.Código_Institución = data.Código_Institución;
        this.Código_Rol = data.Código_Rol;
        this.Correo = data.Correo;
        this.CURSO = Array.isArray(data.CURSO) ? data.CURSO : (data.CURSO ? [data.CURSO] : []);
        this.Nombre = data.Nombre;
        this.Rol = data.Rol;
        this.Teléfono = data.Teléfono;
        this.Usuario = data.Usuario;
        this.Nombre_Institución = data.Nombre_Institución || '';
        this.habilitado = data.habilitado !== undefined ? data.habilitado : true;
    }

    static async create(maestroData) {
        try {
            console.log('🔧 Maestro.create - Datos recibidos:', JSON.stringify(maestroData, null, 2));
            const db = await getDB();
            console.log('🔧 Maestro.create - Base de datos obtenida');
            const maestroInstance = new Maestro(maestroData);
            console.log('🔧 Maestro.create - Instancia creada:', JSON.stringify(maestroInstance, null, 2));
            const result = await db.collection('Maestros').insertOne(maestroInstance);
            console.log('🔧 Maestro.create - Resultado de inserción:', result);
            return result;
        } catch (error) {
            console.error('🔧 Maestro.create - Error:', error);
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

    static async updateByUsuario(usuario, updateData) {
        try {
            const db = await getDB();
            const result = await db.collection('Maestros').updateOne(
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
                CURSO: { $in: [curso] }
            }).toArray();
            return maestros;
        } catch (error) {
            throw error;
        }
    }

    static async findByCursos(cursos) {
        try {
            const db = await getDB();
            const maestros = await db.collection('Maestros').find({ 
                CURSO: { $in: cursos }
            }).toArray();
            return maestros;
        } catch (error) {
            throw error;
        }
    }

    static async findByCursoAndInstitucion(curso, codigoInstitucion) {
        try {
            const db = await getDB();
            const maestros = await db.collection('Maestros').find({ 
                CURSO: { $in: [curso] },
                Código_Institución: codigoInstitucion
            }).toArray();
            return maestros;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Maestro;
