const Colegio = require('../models/Colegio');

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
        const colegio = await Colegio.findById(id);
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
        const existingColegio = await Colegio.findByCodigoInstitucion(colegioData.Código_Institución);
        if (existingColegio) return res.status(400).json({ error: 'El código de institución ya existe' });
        
        const result = await Colegio.create(colegioData);
        if (result.insertedId) {
            res.status(201).json({ success: true, message: 'Colegio creado exitosamente', data: { _id: result.insertedId, ...colegioData } });
        } else {
            res.status(500).json({ error: 'Error al crear el colegio' });
        }
    } catch (error) {
        console.error('Error al crear colegio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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

module.exports = {
    getAllColegios, getColegioById, createColegio, updateColegio, deleteColegio, getColegiosByDepartamento
};
