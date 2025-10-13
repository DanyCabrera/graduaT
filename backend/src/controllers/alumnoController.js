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
            // Asignar automáticamente tests existentes al nuevo alumno
            console.log('🔄 Iniciando asignación automática de tests para:', {
                usuario: alumnoData.Usuario,
                institucion: alumnoData.Código_Institución,
                insertedId: result.insertedId
            });
            
            // Usar la función mejorada de asignación
            try {
                await assignExistingTestsToNewStudent(alumnoData.Usuario, alumnoData.Código_Institución);
                console.log('✅ Tests existentes asignados automáticamente al nuevo alumno:', alumnoData.Usuario);
            } catch (assignError) {
                console.error('⚠️ Error al asignar tests existentes al nuevo alumno:', assignError);
                console.error('⚠️ Detalles del error:', {
                    message: assignError.message,
                    stack: assignError.stack,
                    usuario: alumnoData.Usuario,
                    institucion: alumnoData.Código_Institución
                });
                
                // Intentar con el endpoint de reasignación como fallback
                try {
                    console.log('🔄 Intentando reasignación como fallback...');
                    const axios = require('axios');
                    const response = await axios.post('http://localhost:3001/api/tests/reassign-to-new-student', {
                        studentUsuario: alumnoData.Usuario,
                        studentInstitution: alumnoData.Código_Institución
                    });
                    console.log('✅ Reasignación exitosa como fallback:', response.data);
                } catch (fallbackError) {
                    console.error('❌ Error en reasignación de fallback:', fallbackError.message);
                }
            }
        } else {
            console.warn('⚠️ No se pudo obtener insertedId del alumno, no se asignarán tests automáticamente');
        }
        
        res.status(201).json({
            success: true,
            message: 'Alumno creado exitosamente',
            data: { _id: result.insertedId, ...alumnoData }
        });
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

// Función para asignar automáticamente tests existentes a un nuevo alumno
const assignExistingTestsToNewStudent = async (studentUsuario, studentInstitution) => {
    try {
        const { getDB } = require('../config/db');
        const db = await getDB();
        
        console.log('🔄 Asignando tests existentes al nuevo alumno:', {
            studentUsuario,
            studentInstitution
        });
        
        // Buscar todas las asignaciones existentes para la institución del alumno
        // Buscar tanto asignaciones activas como completadas para asegurar que el alumno vea todos los tests
        const existingAssignments = await db.collection('testAssignments').find({
            institucionId: studentInstitution,
            estado: { $in: ['asignado', 'completado'] }
        }).toArray();
        
        console.log('📚 Asignaciones existentes encontradas:', existingAssignments.length);
        
        // Log detallado de las asignaciones encontradas
        if (existingAssignments.length > 0) {
            console.log('📋 Detalles de asignaciones encontradas:', existingAssignments.map(a => ({
                testId: a.testId,
                testType: a.testType,
                estado: a.estado,
                studentIds: a.studentIds,
                institucionId: a.institucionId
            })));
        }
        
        if (existingAssignments.length === 0) {
            console.log('ℹ️ No hay tests existentes para asignar al nuevo alumno');
            return;
        }
        
        // Crear nuevas asignaciones para el nuevo alumno
        const newAssignments = [];
        
        for (const assignment of existingAssignments) {
            // Verificar si el alumno ya está en esta asignación
            if (assignment.studentIds && assignment.studentIds.includes(studentUsuario)) {
                console.log('ℹ️ El alumno ya está asignado al test:', assignment.testId);
                continue;
            }
            
            // Crear una nueva asignación individual para el nuevo alumno
            const newAssignment = {
                testId: assignment.testId,
                testType: assignment.testType,
                studentIds: [studentUsuario],
                fechaAsignacion: assignment.fechaAsignacion,
                fechaVencimiento: assignment.fechaVencimiento,
                estado: 'asignado',
                maestroId: assignment.maestroId,
                institucionId: studentInstitution,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            newAssignments.push(newAssignment);
        }
        
        if (newAssignments.length > 0) {
            // Insertar todas las nuevas asignaciones
            const result = await db.collection('testAssignments').insertMany(newAssignments);
            console.log('✅ Tests asignados automáticamente al nuevo alumno:', {
                studentUsuario,
                assignedTests: result.insertedCount,
                testIds: newAssignments.map(a => a.testId)
            });
        } else {
            console.log('ℹ️ No se asignaron nuevos tests al alumno (ya tenía todos los tests existentes)');
        }
        
    } catch (error) {
        console.error('❌ Error al asignar tests existentes al nuevo alumno:', error);
        throw error;
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