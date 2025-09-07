const Resultado = require('../models/Resultado');

const getAllResultados = async (req, res) => {
    try {
        const resultados = await Resultado.findAll();
        res.json({ success: true, data: resultados, count: resultados.length });
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getResultadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Resultado.findById(id);
        if (!resultado) return res.status(404).json({ error: 'Resultado no encontrado' });
        res.json({ success: true, data: resultado });
    } catch (error) {
        console.error('Error al obtener resultado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createResultado = async (req, res) => {
    try {
        const resultadoData = req.body;
        const result = await Resultado.create(resultadoData);
        if (result.insertedId) {
            res.status(201).json({ success: true, message: 'Resultado creado exitosamente', data: { _id: result.insertedId, ...resultadoData } });
        } else {
            res.status(500).json({ error: 'Error al crear el resultado' });
        }
    } catch (error) {
        console.error('Error al crear resultado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await Resultado.update(id, updateData);
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Resultado no encontrado' });
        res.json({ success: true, message: result.modifiedCount > 0 ? 'Resultado actualizado exitosamente' : 'No se realizaron cambios' });
    } catch (error) {
        console.error('Error al actualizar resultado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Resultado.delete(id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Resultado no encontrado' });
        res.json({ success: true, message: 'Resultado eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar resultado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getResultadosByAlumno = async (req, res) => {
    try {
        const { codigoAlumno } = req.params;
        const resultados = await Resultado.findByAlumno(codigoAlumno);
        res.json({ success: true, data: resultados, count: resultados.length });
    } catch (error) {
        console.error('Error al obtener resultados por alumno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getResultadosByColegio = async (req, res) => {
    try {
        const { codigoColegio } = req.params;
        const resultados = await Resultado.findByColegio(codigoColegio);
        res.json({ success: true, data: resultados, count: resultados.length });
    } catch (error) {
        console.error('Error al obtener resultados por colegio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getResultadosByMaestro = async (req, res) => {
    try {
        const { codigoMaestro } = req.params;
        const resultados = await Resultado.findByMaestro(codigoMaestro);
        res.json({ success: true, data: resultados, count: resultados.length });
    } catch (error) {
        console.error('Error al obtener resultados por maestro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAllResultados, getResultadoById, createResultado, updateResultado, deleteResultado,
    getResultadosByAlumno, getResultadosByColegio, getResultadosByMaestro
};
