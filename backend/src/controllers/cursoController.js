const Curso = require('../models/Curso');

const getAllCursos = async (req, res) => {
    try {
        const cursos = await Curso.findAll();
        res.json({ success: true, data: cursos, count: cursos.length });
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Curso.findById(id);
        if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json({ success: true, data: curso });
    } catch (error) {
        console.error('Error al obtener curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createCurso = async (req, res) => {
    try {
        const cursoData = req.body;
        const existingCurso = await Curso.findByCodigo(cursoData.Código);
        if (existingCurso) return res.status(400).json({ error: 'El código del curso ya existe' });
        
        const result = await Curso.create(cursoData);
        if (result.insertedId) {
            res.status(201).json({ success: true, message: 'Curso creado exitosamente', data: { _id: result.insertedId, ...cursoData } });
        } else {
            res.status(500).json({ error: 'Error al crear el curso' });
        }
    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await Curso.update(id, updateData);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json({ success: true, message: result.modifiedCount > 0 ? 'Curso actualizado exitosamente' : 'No se realizaron cambios' });
    } catch (error) {
        console.error('Error al actualizar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Curso.delete(id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json({ success: true, message: 'Curso eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllCursos, getCursoById, createCurso, updateCurso, deleteCurso
};
