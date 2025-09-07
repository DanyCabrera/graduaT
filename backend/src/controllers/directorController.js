const Director = require('../models/Director');

const getAllDirectores = async (req, res) => {
    try {
        const directores = await Director.findAll();
        res.json({ success: true, data: directores, count: directores.length });
    } catch (error) {
        console.error('Error al obtener directores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getDirectorById = async (req, res) => {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);
        if (!director) return res.status(404).json({ error: 'Director no encontrado' });
        res.json({ success: true, data: director });
    } catch (error) {
        console.error('Error al obtener director:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createDirector = async (req, res) => {
    try {
        const directorData = req.body;
        const existingDirector = await Director.findByUsuario(directorData.Usuario);
        if (existingDirector) return res.status(400).json({ error: 'El usuario ya existe' });
        
        const result = await Director.create(directorData);
        if (result.insertedId) {
            res.status(201).json({ success: true, message: 'Director creado exitosamente', data: { _id: result.insertedId, ...directorData } });
        } else {
            res.status(500).json({ error: 'Error al crear el director' });
        }
    } catch (error) {
        console.error('Error al crear director:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await Director.update(id, updateData);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Director no encontrado' });
        res.json({ success: true, message: result.modifiedCount > 0 ? 'Director actualizado exitosamente' : 'No se realizaron cambios' });
    } catch (error) {
        console.error('Error al actualizar director:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Director.delete(id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Director no encontrado' });
        res.json({ success: true, message: 'Director eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar director:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getDirectoresByInstitucion = async (req, res) => {
    try {
        const { codigoInstitucion } = req.params;
        const directores = await Director.findByInstitucion(codigoInstitucion);
        res.json({ success: true, data: directores, count: directores.length });
    } catch (error) {
        console.error('Error al obtener directores por institución:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllDirectores, getDirectorById, createDirector, updateDirector, deleteDirector, getDirectoresByInstitucion
};
