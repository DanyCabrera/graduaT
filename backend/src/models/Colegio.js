const { getDB } = require('../config/db');
const crypto = require('crypto');

class Colegio {
    constructor(data) {
        this.Código_Institución = data.Código_Institución;
        this.Código_Alumno = data.Código_Alumno;
        this.Código_Director = data.Código_Director;
        this.Código_Maestro = data.Código_Maestro;
        this.Código_Supervisor = data.Código_Supervisor;
        this.Correo = data.Correo;
        this.DEPARTAMENTO = data.DEPARTAMENTO;
        this.Dirección = data.Dirección;
        this.ID_Colegio = data.ID_Colegio;
        this.Nombre_Completo = data.Nombre_Completo;
        this.Teléfono = data.Teléfono;
        this.emailVerificado = data.emailVerificado || false;
        this.tokenVerificacion = data.tokenVerificacion || null;
        this.habilitado = data.habilitado !== undefined ? data.habilitado : true;
        this.fechaCreacion = data.fechaCreacion || new Date();
        this.fechaActualizacion = data.fechaActualizacion || new Date();
    }

    // Validar datos del modelo
    validate() {
        const errors = [];

        if (!this.Nombre_Completo || this.Nombre_Completo.trim().length < 2) {
            errors.push('El nombre de la institución debe tener al menos 2 caracteres');
        }

        if (!this.Correo || !this.isValidEmail(this.Correo)) {
            errors.push('El correo electrónico no es válido');
        }

        if (!this.Dirección || this.Dirección.trim().length < 5) {
            errors.push('La dirección debe tener al menos 5 caracteres');
        }

        if (!this.Teléfono || this.Teléfono.trim().length < 8) {
            errors.push('El teléfono debe tener al menos 8 caracteres');
        }

        if (!this.DEPARTAMENTO || this.DEPARTAMENTO.trim().length < 2) {
            errors.push('El departamento es requerido');
        }

        return errors;
    }

    // Validar formato de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Generar códigos únicos para la institución
    static generateUniqueCodes(nombreInstitucion) {
        const generateCode = (prefix) => {
            const randomPart = Array(3)
                .fill(0)
                .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
                .join('');
            return prefix + randomPart;
        };

        // Determinar el prefijo basado en el nombre de la institución
        const nombreUpper = nombreInstitucion.toUpperCase().trim();
        let prefijoInstitucion = 'INS'; // Por defecto
        
        if (nombreUpper.startsWith('COLEGIO')) {
            prefijoInstitucion = 'COL';
        } else if (nombreUpper.startsWith('INSTITUTO')) {
            prefijoInstitucion = 'INS';
        } else if (nombreUpper.startsWith('ESCUELA')) {
            prefijoInstitucion = 'ESC';
        } else if (nombreUpper.startsWith('UNIVERSIDAD')) {
            prefijoInstitucion = 'UNI';
        } else if (nombreUpper.startsWith('ACADEMIA')) {
            prefijoInstitucion = 'ACA';
        }

        return {
            Código_Institución: generateCode(prefijoInstitucion),
            Código_Alumno: generateCode('ALU'),
            Código_Director: generateCode('DIR'),
            Código_Maestro: generateCode('MAE'),
            Código_Supervisor: generateCode('SUP')
        };
    }

    // Generar token de verificación
    generateVerificationToken() {
        this.tokenVerificacion = crypto.randomBytes(32).toString('hex');
        return this.tokenVerificacion;
    }

    // Convertir a objeto sin información sensible
    toJSON() {
        const { tokenVerificacion, ...colegioData } = this;
        return colegioData;
    }

    static async create(colegioData) {
        try {
            const colegio = new Colegio(colegioData);
            const validationErrors = colegio.validate();
            
            if (validationErrors.length > 0) {
                throw new Error(`Errores de validación: ${validationErrors.join(', ')}`);
            }

            // Verificar si el correo ya existe
            const existingColegio = await Colegio.findByCorreo(colegio.Correo);
            if (existingColegio) {
                throw new Error('Ya existe una institución registrada con este correo electrónico');
            }

            // Generar códigos únicos
            const codigos = Colegio.generateUniqueCodes(colegio.Nombre_Completo);
            Object.assign(colegio, codigos);

            // Generar token de verificación
            colegio.generateVerificationToken();
            
            const db = await getDB();
            const result = await db.collection('Colegio').insertOne(colegio);
            
            return {
                success: true,
                data: {
                    id: result.insertedId,
                    ...colegio.toJSON()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
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
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(id);
            const colegio = await db.collection('Colegio').findOne({ _id: objectId });
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

    static async findByCorreo(correo) {
        try {
            const db = await getDB();
            const colegio = await db.collection('Colegio').findOne({ 
                Correo: correo 
            });
            return colegio;
        } catch (error) {
            throw error;
        }
    }

    static async findByAnyCode(codigo) {
        try {
            const db = await getDB();
            const colegio = await db.collection('Colegio').findOne({
                $or: [
                    { Código_Institución: codigo },
                    { Código_Alumno: codigo },
                    { Código_Director: codigo },
                    { Código_Maestro: codigo },
                    { Código_Supervisor: codigo }
                ]
            });
            return colegio;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await getDB();
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(id);
            const result = await db.collection('Colegio').updateOne(
                { _id: objectId },
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
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(id);
            const result = await db.collection('Colegio').deleteOne({ _id: objectId });
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
