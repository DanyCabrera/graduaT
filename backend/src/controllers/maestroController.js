const Maestro = require('../models/Maestro');

// Obtener todos los maestros
const getAllMaestros = async (req, res) => {
    try {
        const maestros = await Maestro.findAll();
        res.json({
            success: true,
            data: maestros,
            count: maestros.length
        });
    } catch (error) {
        console.error('Error al obtener maestros:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener maestro por ID
const getMaestroById = async (req, res) => {
    try {
        const { id } = req.params;
        const maestro = await Maestro.findById(id);
        
        if (!maestro) {
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: maestro
        });
    } catch (error) {
        console.error('Error al obtener maestro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Crear nuevo maestro
const createMaestro = async (req, res) => {
    try {
        const maestroData = req.body;
        
        // Verificar si el usuario ya existe
        const existingMaestro = await Maestro.findByUsuario(maestroData.Usuario);
        if (existingMaestro) {
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }
        
        const result = await Maestro.create(maestroData);
        
        if (result.insertedId) {
            res.status(201).json({
                success: true,
                message: 'Maestro creado exitosamente',
                data: { _id: result.insertedId, ...maestroData }
            });
        } else {
            res.status(500).json({
                error: 'Error al crear el maestro'
            });
        }
    } catch (error) {
        console.error('Error al crear maestro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar maestro
const updateMaestro = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const result = await Maestro.update(id, updateData);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        
        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'Maestro actualizado exitosamente'
            });
        } else {
            res.json({
                success: true,
                message: 'No se realizaron cambios'
            });
        }
    } catch (error) {
        console.error('Error al actualizar maestro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Eliminar maestro
const deleteMaestro = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Maestro.delete(id);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Maestro eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar maestro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener maestros por institución
const getMaestrosByInstitucion = async (req, res) => {
    try {
        const { codigoInstitucion } = req.params;
        const maestros = await Maestro.findByInstitucion(codigoInstitucion);
        
        res.json({
            success: true,
            data: maestros,
            count: maestros.length
        });
    } catch (error) {
        console.error('Error al obtener maestros por institución:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener maestros por curso
const getMaestrosByCurso = async (req, res) => {
    try {
        const { curso } = req.params;
        const maestros = await Maestro.findByCurso(curso);
        
        res.json({
            success: true,
            data: maestros,
            count: maestros.length
        });
    } catch (error) {
        console.error('Error al obtener maestros por curso:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener maestros por múltiples cursos
const getMaestrosByCursos = async (req, res) => {
    try {
        const { cursos } = req.body;
        
        if (!cursos || !Array.isArray(cursos)) {
            return res.status(400).json({
                error: 'Se requiere un array de cursos'
            });
        }
        
        const maestros = await Maestro.findByCursos(cursos);
        
        res.json({
            success: true,
            data: maestros,
            count: maestros.length
        });
    } catch (error) {
        console.error('Error al obtener maestros por cursos:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener datos completos del maestro por usuario (para verificación de token)
const getMaestroByUsuario = async (req, res) => {
    try {
        const { usuario } = req.params;
        const maestro = await Maestro.findByUsuario(usuario);
        
        if (!maestro) {
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: maestro
        });
    } catch (error) {
        console.error('Error al obtener maestro por usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Obtener maestros para los cursos del alumno (filtrado por institución)
const getMaestrosForAlumno = async (req, res) => {
    try {
        // Verificar que el usuario esté autenticado
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                error: 'Token de acceso requerido'
            });
        }

        // Verificar y decodificar el token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
        
        // Obtener la institución del usuario desde el token
        const codigoInstitucion = decoded.codigoInstitucion;
        if (!codigoInstitucion) {
            return res.status(400).json({
                error: 'Código de institución no encontrado en el token'
            });
        }

        console.log('🔍 getMaestrosForAlumno - Código de institución:', codigoInstitucion);

        // Los cursos que ve el alumno son fijos: Matemáticas y Comunicación y lenguaje
        const cursosAlumno = ['Matemáticas', 'Comunicación y lenguaje'];
        
        // Obtener maestros para cada curso, pero solo de la misma institución
        const maestrosPorCurso = {};
        
        for (const curso of cursosAlumno) {
            // Buscar maestros que tengan este curso Y que sean de la misma institución
            const maestros = await Maestro.findByCursoAndInstitucion(curso, codigoInstitucion);
            maestrosPorCurso[curso] = maestros.map(maestro => ({
                nombre: `${maestro.Nombre} ${maestro.Apellido}`,
                correo: maestro.Correo,
                telefono: maestro.Teléfono
            }));
        }
        
        console.log('🔍 getMaestrosForAlumno - Resultado:', maestrosPorCurso);
        
        res.json({
            success: true,
            data: maestrosPorCurso
        });
    } catch (error) {
        console.error('Error al obtener maestros para alumno:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token inválido'
            });
        }
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllMaestros,
    getMaestroById,
    createMaestro,
    updateMaestro,
    deleteMaestro,
    getMaestrosByInstitucion,
    getMaestrosByCurso,
    getMaestrosByCursos,
    getMaestroByUsuario,
    getMaestrosForAlumno
};
