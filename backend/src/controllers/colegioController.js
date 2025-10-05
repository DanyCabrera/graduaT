const Colegio = require('../models/Colegio');
const Supervisor = require('../models/Supervisor');
const Director = require('../models/Director');
const Maestro = require('../models/Maestro');
const Alumno = require('../models/Alumno');
const emailService = require('../services/emailService');

const getAllColegios = async (req, res) => {
    try {
        const colegios = await Colegio.findAll();
        res.json({ success: true, data: colegios, count: colegios.length });
    } catch (error) {
        console.error('Error al obtener colegios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getColegioById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Buscando colegio con ID:', id);
        const colegio = await Colegio.findById(id);
        console.log('Colegio encontrado:', colegio ? 'Sí' : 'No');
        if (!colegio) return res.status(404).json({ error: 'Colegio no encontrado' });
        res.json({ success: true, data: colegio });
    } catch (error) {
        console.error('Error al obtener colegio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createColegio = async (req, res) => {
    try {
        const colegioData = req.body;
        
        const result = await Colegio.create(colegioData);
        if (result.success) {
            // Enviar email de confirmación
            try {
                await emailService.sendInstitutionRegistrationEmail(
                    result.data.Correo,
                    result.data.Nombre_Completo,
                    {
                        Código_Institución: result.data.Código_Institución,
                        Código_Supervisor: result.data.Código_Supervisor,
                        Código_Director: result.data.Código_Director,
                        Código_Maestro: result.data.Código_Maestro,
                        Código_Alumno: result.data.Código_Alumno
                    }
                );
                console.log('✅ Email de confirmación enviado exitosamente');
            } catch (emailError) {
                console.error('⚠️ Error al enviar email de confirmación:', emailError.message);
                // No fallar el registro si el email falla
            }

            res.status(201).json({ 
                success: true, 
                message: 'Institución registrada exitosamente. Se ha enviado un email de confirmación.', 
                data: result.data 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: result.error 
            });
        }
    } catch (error) {
        console.error('Error al crear colegio:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor' 
        });
    }
};

const updateColegio = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await Colegio.update(id, updateData);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Colegio no encontrado' });
        res.json({ success: true, message: result.modifiedCount > 0 ? 'Colegio actualizado exitosamente' : 'No se realizaron cambios' });
    } catch (error) {
        console.error('Error al actualizar colegio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteColegio = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Colegio.delete(id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Colegio no encontrado' });
        res.json({ success: true, message: 'Colegio eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar colegio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getColegiosByDepartamento = async (req, res) => {
    try {
        const { departamento } = req.params;
        const colegios = await Colegio.findByDepartamento(departamento);
        res.json({ success: true, data: colegios, count: colegios.length });
    } catch (error) {
        console.error('Error al obtener colegios por departamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getColegioByCode = async (req, res) => {
    try {
        const { codigo } = req.params;
        const colegio = await Colegio.findByAnyCode(codigo);
        if (!colegio) {
            return res.status(404).json({ 
                success: false, 
                error: 'Institución no encontrada con el código proporcionado' 
            });
        }
        res.json({ 
            success: true, 
            data: {
                nombre: colegio.Nombre_Completo,
                direccion: colegio.Dirección,
                departamento: colegio.DEPARTAMENTO,
                correo: colegio.Correo,
                telefono: colegio.Teléfono,
                codigos: {
                    institucion: colegio.Código_Institución,
                    supervisor: colegio.Código_Supervisor,
                    director: colegio.Código_Director,
                    maestro: colegio.Código_Maestro,
                    alumno: colegio.Código_Alumno
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar colegio por código:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor' 
        });
    }
};

const toggleHabilitado = async (req, res) => {
    try {
        const { id } = req.params;
        const { habilitado } = req.body;
        
        if (typeof habilitado !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                error: 'El campo habilitado debe ser un valor booleano' 
            });
        }

        // Obtener la institución para obtener su código
        const institucion = await Colegio.findById(id);
        if (!institucion) {
            return res.status(404).json({ 
                success: false, 
                error: 'Institución no encontrada' 
            });
        }

        // Actualizar la institución
        const result = await Colegio.update(id, { 
            habilitado: habilitado,
            fechaActualizacion: new Date()
        });
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Institución no encontrada' 
            });
        }

        // Actualizar todos los roles de la institución
        const codigoInstitucion = institucion.Código_Institución;
        const updateData = { habilitado: habilitado };

        try {
            // Actualizar supervisores
            const { getDB } = require('../config/db');
            const db = await getDB();
            
            await db.collection('Supervisores').updateMany(
                { Código_Institución: codigoInstitucion },
                { $set: updateData }
            );

            // Actualizar directores
            await db.collection('Directores').updateMany(
                { Código_Institución: codigoInstitucion },
                { $set: updateData }
            );

            // Actualizar maestros
            await db.collection('Maestros').updateMany(
                { Código_Institución: codigoInstitucion },
                { $set: updateData }
            );

            // Actualizar alumnos
            await db.collection('Alumnos').updateMany(
                { Código_Institución: codigoInstitucion },
                { $set: updateData }
            );

            console.log(`✅ Todos los roles de la institución ${codigoInstitucion} han sido ${habilitado ? 'habilitados' : 'deshabilitados'}`);

        } catch (rolesError) {
            console.error('Error al actualizar roles:', rolesError);
            // No fallar la operación si hay error en roles, pero logearlo
        }

        const accion = habilitado ? 'habilitada' : 'deshabilitada';
        res.json({ 
            success: true, 
            message: `Institución y todos sus roles ${accion} exitosamente`,
            data: { habilitado: habilitado }
        });
    } catch (error) {
        console.error('Error al cambiar estado de la institución:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor' 
        });
    }
};

module.exports = {
    getAllColegios, 
    getColegioById, 
    createColegio, 
    updateColegio, 
    deleteColegio, 
    getColegiosByDepartamento,
    getColegioByCode,
    toggleHabilitado
};
