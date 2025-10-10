const { getDB } = require('../config/db');

class TestController {
    // Obtener todos los tests de matemáticas
    async getTestsMatematicas(req, res) {
        try {
            const db = await getDB();
            const tests = await db.collection('testmatematicas').find({}).toArray();
            
            res.json({
                success: true,
                data: tests,
                message: 'Tests de matemáticas obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener tests de matemáticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener todos los tests de comunicación
    async getTestsComunicacion(req, res) {
        try {
            const db = await getDB();
            const tests = await db.collection('testcomunicacions').find({}).toArray();
            
            res.json({
                success: true,
                data: tests,
                message: 'Tests de comunicación obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener tests de comunicación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener un test específico por ID y tipo
    async getTestById(req, res) {
        try {
            const { id, tipo } = req.params;
            const db = await getDB();
            
            let collectionName;
            if (tipo === 'matematicas') {
                collectionName = 'testmatematicas';
            } else if (tipo === 'comunicacion') {
                collectionName = 'testcomunicacions';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de test inválido. Debe ser "matematicas" o "comunicacion"'
                });
            }

            const test = await db.collection(collectionName).findOne({ _id: id });
            
            if (!test) {
                return res.status(404).json({
                    success: false,
                    message: 'Test no encontrado'
                });
            }

            res.json({
                success: true,
                data: test,
                message: 'Test obtenido exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener test:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener tests organizados por curso
    async getTestsByCourse(req, res) {
        try {
            const db = await getDB();
            
            // Obtener tests de matemáticas
            const testsMatematicas = await db.collection('testmatematicas').find({}).toArray();
            
            // Obtener tests de comunicación
            const testsComunicacion = await db.collection('testcomunicacions').find({}).toArray();

            // Organizar por curso
            const testsByCourse = {
                matematicas: testsMatematicas.map(test => ({
                    _id: test._id,
                    titulo: `Test Matemáticas - Semana ${test.semana}`,
                    descripcion: 'Test de matemáticas semanal',
                    preguntas: test.preguntas || [],
                    duracion: 30,
                    dificultad: 'media',
                    semana: test.semana || 1,
                    curso: 'matematicas'
                })),
                comunicacion: testsComunicacion.map(test => ({
                    _id: test._id,
                    titulo: `Test Comunicación - Semana ${test.semana}`,
                    descripcion: 'Test de comunicación semanal',
                    preguntas: test.preguntas || [],
                    duracion: 30,
                    dificultad: 'media',
                    semana: test.semana || 1,
                    curso: 'comunicacion'
                }))
            };

            res.json({
                success: true,
                data: testsByCourse,
                message: 'Tests organizados por curso obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener tests por curso:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Asignar test a estudiantes
    async assignTestToStudents(req, res) {
        try {
            console.log('📝 Datos recibidos para asignación:', req.body);
            
            const { testIds, testType, studentIds, fechaAsignacion, fechaVencimiento } = req.body;
            
            if (!testIds || !Array.isArray(testIds) || !testType || !studentIds || !Array.isArray(studentIds)) {
                console.log('❌ Datos inválidos:', { testIds, testType, studentIds });
                return res.status(400).json({
                    success: false,
                    message: 'Datos requeridos: testIds (array), testType, studentIds (array)'
                });
            }

            // Verificar autenticación del maestro
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            const maestroUsuario = decoded.usuario;
            const userRole = decoded.rol;

            if (userRole !== 'Maestro') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los maestros pueden asignar tests.'
                });
            }

            const db = await getDB();
            
            // Obtener información del maestro
            let maestro = await db.collection('maestros').findOne({ usuario: maestroUsuario });
            if (!maestro) {
                maestro = await db.collection('Maestros').findOne({ Usuario: maestroUsuario });
            }
            if (!maestro) {
                maestro = await db.collection('Maestros').findOne({ Correo: maestroUsuario });
            }

            if (!maestro) {
                return res.status(404).json({
                    success: false,
                    message: 'Maestro no encontrado'
                });
            }

            const codigoInstitucionMaestro = maestro.Código_Institución;
            console.log('🏫 Institución del maestro que asigna:', codigoInstitucionMaestro);

            if (!codigoInstitucionMaestro) {
                return res.status(400).json({
                    success: false,
                    message: 'Maestro no tiene código de institución asignado'
                });
            }

            // Verificar que todos los estudiantes pertenezcan a la misma institución del maestro
            const estudiantes = await db.collection('Alumnos').find({
                Usuario: { $in: studentIds }
            }).toArray();

            console.log('👥 Estudiantes encontrados para verificar:', estudiantes.length);

            // Verificar que todos los estudiantes sean de la misma institución
            const estudiantesInstitucion = estudiantes.filter(est => 
                est.Código_Institución === codigoInstitucionMaestro
            );

            console.log('✅ Estudiantes de la misma institución:', estudiantesInstitucion.length);
            console.log('❌ Estudiantes de otras instituciones:', estudiantes.length - estudiantesInstitucion.length);

            if (estudiantesInstitucion.length !== studentIds.length) {
                const estudiantesOtrasInstituciones = estudiantes.filter(est => 
                    est.Código_Institución !== codigoInstitucionMaestro
                );
                
                console.log('🚫 Estudiantes de otras instituciones encontrados:', estudiantesOtrasInstituciones.map(est => ({
                    Usuario: est.Usuario,
                    Nombre: est.Nombre,
                    Código_Institución: est.Código_Institución
                })));

                return res.status(403).json({
                    success: false,
                    message: 'No puedes asignar tests a estudiantes de otras instituciones. Solo puedes asignar a estudiantes de tu propia institución.',
                    detalles: `Se encontraron ${estudiantes.length - estudiantesInstitucion.length} estudiantes de otras instituciones`
                });
            }

            const assignments = [];

            // Crear una asignación para cada test
            for (const testId of testIds) {
                const testAssignment = {
                    testId,
                    testType,
                    studentIds,
                    fechaAsignacion: fechaAsignacion || new Date(),
                    fechaVencimiento: fechaVencimiento || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días por defecto
                    estado: 'asignado',
                    maestroId: maestroUsuario,
                    institucionId: codigoInstitucionMaestro,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                console.log('💾 Guardando asignación:', testAssignment);

                // Guardar en colección de asignaciones
                const result = await db.collection('testAssignments').insertOne(testAssignment);
                assignments.push({
                    assignmentId: result.insertedId,
                    ...testAssignment
                });
            }

            console.log('✅ Asignaciones creadas exitosamente:', assignments.length);

            res.json({
                success: true,
                data: assignments,
                message: `${testIds.length} test(s) asignado(s) exitosamente a ${studentIds.length} estudiante(s)`
            });
        } catch (error) {
            console.error('❌ Error al asignar test:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener asignaciones de tests
    async getTestAssignments(req, res) {
        try {
            const db = await getDB();
            const assignments = await db.collection('testAssignments').find({}).toArray();
            
            res.json({
                success: true,
                data: assignments,
                message: 'Asignaciones de tests obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener asignaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Endpoint de debugging para verificar asignaciones por institución
    async getAssignmentsByInstitution(req, res) {
        try {
            const db = await getDB();
            
            // Obtener todas las asignaciones
            const assignments = await db.collection('testAssignments').find({}).toArray();
            
            // Obtener información de estudiantes para cada asignación
            const assignmentsWithDetails = await Promise.all(assignments.map(async (assignment) => {
                const estudiantes = await db.collection('Alumnos').find({
                    Usuario: { $in: assignment.studentIds }
                }).toArray();
                
                return {
                    assignmentId: assignment._id,
                    testId: assignment.testId,
                    testType: assignment.testType,
                    estado: assignment.estado,
                    maestroId: assignment.maestroId,
                    institucionId: assignment.institucionId,
                    fechaAsignacion: assignment.fechaAsignacion,
                    studentIds: assignment.studentIds,
                    estudiantes: estudiantes.map(est => ({
                        Usuario: est.Usuario,
                        Nombre: est.Nombre,
                        Código_Institución: est.Código_Institución
                    }))
                };
            }));
            
            res.json({
                success: true,
                data: {
                    totalAsignaciones: assignmentsWithDetails.length,
                    asignaciones: assignmentsWithDetails
                },
                message: 'Asignaciones con detalles obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener asignaciones con detalles:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new TestController();
