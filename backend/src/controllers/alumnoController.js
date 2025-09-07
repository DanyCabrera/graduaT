const Alumno = require('../models/Alumno');

// Obtener todos los alumnos
const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll();
        res.json({
            success: true,
            data: alumnos,
            count: alumnos.length
        });
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener alumno por ID
const getAlumnoById = async (req, res) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findById(id);
        
        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: alumno
        });
    } catch (error) {
        console.error('Error al obtener alumno:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo alumno
const createAlumno = async (req, res) => {
    try {
        const alumnoData = req.body;
        
        // Verificar si el usuario ya existe
        const existingAlumno = await Alumno.findByUsuario(alumnoData.Usuario);
        if (existingAlumno) {
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }
        
        const result = await Alumno.create(alumnoData);
        
        if (result.insertedId) {
            res.status(201).json({
                success: true,
                message: 'Alumno creado exitosamente',
                data: { _id: result.insertedId, ...alumnoData }
            });
        } else {
            res.status(500).json({
                error: 'Error al crear el alumno'
            });
        }
    } catch (error) {
        console.error('Error al crear alumno:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar alumno
const updateAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const result = await Alumno.update(id, updateData);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }
        
        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'Alumno actualizado exitosamente'
            });
        } else {
            res.json({
                success: true,
                message: 'No se realizaron cambios'
            });
        }
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar alumno
const deleteAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Alumno.delete(id);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Alumno eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener alumnos por institución
const getAlumnosByInstitucion = async (req, res) => {
    try {
        const { codigoInstitucion } = req.params;
        const alumnos = await Alumno.findByInstitucion(codigoInstitucion);
        
        res.json({
            success: true,
            data: alumnos,
            count: alumnos.length
        });
    } catch (error) {
        console.error('Error al obtener alumnos por institución:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener alumnos por curso
const getAlumnosByCurso = async (req, res) => {
    try {
        const { codigoCurso } = req.params;
        const alumnos = await Alumno.findByCurso(codigoCurso);
        
        res.json({
            success: true,
            data: alumnos,
            count: alumnos.length
        });
    } catch (error) {
        console.error('Error al obtener alumnos por curso:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAlumnosByInstitucion,
    getAlumnosByCurso
};
