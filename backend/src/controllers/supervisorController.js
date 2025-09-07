const Supervisor = require('../models/Supervisor');

const getAllSupervisores = async (req, res) => {
    try {
        const supervisores = await Supervisor.findAll();
        res.json({ success: true, data: supervisores, count: supervisores.length });
    } catch (error) {
        console.error('Error al obtener supervisores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getSupervisorById = async (req, res) => {
    try {
        const { id } = req.params;
        const supervisor = await Supervisor.findById(id);
        if (!supervisor) return res.status(404).json({ error: 'Supervisor no encontrado' });
        res.json({ success: true, data: supervisor });
    } catch (error) {
        console.error('Error al obtener supervisor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createSupervisor = async (req, res) => {
    try {
        const supervisorData = req.body;
        const existingSupervisor = await Supervisor.findByUsuario(supervisorData.Usuario);
        if (existingSupervisor) return res.status(400).json({ error: 'El usuario ya existe' });
        
        const result = await Supervisor.create(supervisorData);
        if (result.insertedId) {
            res.status(201).json({ success: true, message: 'Supervisor creado exitosamente', data: { _id: result.insertedId, ...supervisorData } });
        } else {
            res.status(500).json({ error: 'Error al crear el supervisor' });
        }
    } catch (error) {
        console.error('Error al crear supervisor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateSupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await Supervisor.update(id, updateData);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Supervisor no encontrado' });
        res.json({ success: true, message: result.modifiedCount > 0 ? 'Supervisor actualizado exitosamente' : 'No se realizaron cambios' });
    } catch (error) {
        console.error('Error al actualizar supervisor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteSupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Supervisor.delete(id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Supervisor no encontrado' });
        res.json({ success: true, message: 'Supervisor eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar supervisor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getSupervisoresByDepartamento = async (req, res) => {
    try {
        const { departamento } = req.params;
        const supervisores = await Supervisor.findByDepartamento(departamento);
        res.json({ success: true, data: supervisores, count: supervisores.length });
    } catch (error) {
        console.error('Error al obtener supervisores por departamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllSupervisores, getSupervisorById, createSupervisor, updateSupervisor, deleteSupervisor, getSupervisoresByDepartamento
};
