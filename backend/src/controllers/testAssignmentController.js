const { getDB } = require('../config/db');

class TestAssignmentController {
    // Obtener tests asignados al estudiante actual
    async getAssignedTestsForStudent(req, res) {
        try {
            // Obtener el ID del estudiante desde el token
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            const studentId = decoded.usuario; // Usar el usuario como ID del estudiante
            
            console.log('🔍 Buscando asignaciones para estudiante:', studentId);

            const db = await getDB();
            
            // Buscar asignaciones para este estudiante (tanto grupales como individuales)
            const assignments = await db.collection('testAssignments').find({
                studentIds: { $in: [studentId] },
                estado: { $in: ['asignado', 'completado'] }
            }).toArray();
            
            console.log('📝 Asignaciones encontradas:', assignments.length);
            console.log('📋 Detalles de asignaciones:', assignments.map(a => ({
                testId: a.testId,
                testType: a.testType,
                studentIds: a.studentIds,
                estado: a.estado
            })));

            // Para cada asignación, obtener los detalles del test
            const assignmentsWithTests = await Promise.all(assignments.map(async (assignment) => {
                const collectionName = assignment.testType === 'matematicas' ? 'testmatematicas' : 'testcomunicacions';
                
                // Convertir testId a ObjectId si es necesario
                const { ObjectId } = require('mongodb');
                let testId;
                try {
                    testId = new ObjectId(assignment.testId);
                } catch (error) {
                    console.error('Error converting testId to ObjectId:', assignment.testId);
                    testId = assignment.testId;
                }
                
                const test = await db.collection(collectionName).findOne({ _id: testId });
                
                console.log(`🔍 Buscando test ${assignment.testId} en ${collectionName}:`, test ? 'Encontrado' : 'No encontrado');
                
                // Verificar si el estudiante ya completó este test
                const testResult = await db.collection('testResults').findOne({
                    testId: assignment.testId,
                    studentId: studentId,
                    testType: assignment.testType
                });
                
                // Si el estudiante ya completó el test, marcar como completado
                if (testResult) {
                    assignment.estado = 'completado';
                }
                
                // Agregar campos faltantes al test
                if (test) {
                    test.titulo = `Test de ${assignment.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación'} - Semana ${test.semana}`;
                    test.descripcion = `Evaluación de ${assignment.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación y Lenguaje'} para la semana ${test.semana}`;
                    test.duracion = 30; // Duración por defecto
                    test.dificultad = 'media'; // Dificultad por defecto
                    test.curso = assignment.testType;
                }
                
                return {
                    ...assignment,
                    test: test
                };
            }));

            res.json({
                success: true,
                data: assignmentsWithTests,
                message: 'Tests asignados obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener tests asignados:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener un test específico para que el estudiante lo responda
    async getTestForStudent(req, res) {
        try {
            const { testType, testId } = req.params;
            
            const db = await getDB();
            const collectionName = testType === 'matematicas' ? 'testmatematicas' : 'testcomunicacions';
            
            // Convertir testId a ObjectId
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(testId);
            
            const test = await db.collection(collectionName).findOne({ _id: objectId });
            
            if (!test) {
                return res.status(404).json({
                    success: false,
                    message: 'Test no encontrado'
                });
            }

            res.json({
                success: true,
                data: [test],
                message: 'Test obtenido exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener test para estudiante:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Enviar respuestas del test
    async submitTestAnswers(req, res) {
        try {
            const { testType, testId } = req.params;
            const { answers, timestamp } = req.body;
            
            console.log('📝 Enviando respuestas del test:', { testType, testId, answers });

            // Obtener el ID del estudiante desde el token
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_seguro_aqui');
            const studentId = decoded.usuario;

            const db = await getDB();
            const collectionName = testType === 'matematicas' ? 'testmatematicas' : 'testcomunicacions';
            
            // Convertir testId a ObjectId
            const { ObjectId } = require('mongodb');
            const objectId = new ObjectId(testId);
            
            // Obtener el test para verificar las respuestas correctas
            const test = await db.collection(collectionName).findOne({ _id: objectId });
            
            if (!test) {
                return res.status(404).json({
                    success: false,
                    message: 'Test no encontrado'
                });
            }

            // Calcular puntuación (2 puntos por pregunta)
            let correctAnswers = 0;
            const totalQuestions = test.preguntas.length;
            const pointsPerQuestion = 2;
            const totalPoints = totalQuestions * pointsPerQuestion;

            test.preguntas.forEach((pregunta, index) => {
                const questionId = pregunta._id;
                const studentAnswer = answers[questionId];
                const correctAnswer = pregunta.respuesta;

                if (studentAnswer === correctAnswer) {
                    correctAnswers++;
                }
            });

            const earnedPoints = correctAnswers * pointsPerQuestion;
            const score = Math.round((earnedPoints / totalPoints) * 100);

            // Guardar el resultado del test
            const testResult = {
                studentId,
                testId,
                testType,
                answers,
                score,
                correctAnswers,
                totalQuestions,
                earnedPoints,
                totalPoints,
                pointsPerQuestion,
                timestamp: timestamp || new Date(),
                submittedAt: new Date()
            };

            await db.collection('testResults').insertOne(testResult);

            // Actualizar el estado de la asignación para este estudiante específico
            // Primero, obtener la asignación actual
            const assignment = await db.collection('testAssignments').findOne({
                testId: new ObjectId(testId),
                studentIds: { $in: [studentId] }
            });

            if (assignment) {
                // Verificar si ya existe una asignación individual para este estudiante
                const existingIndividual = await db.collection('testAssignments').findOne({
                    testId: new ObjectId(testId),
                    studentIds: [studentId],
                    estado: 'completado'
                });

                if (!existingIndividual) {
                    // Crear una nueva asignación individual para este estudiante con estado completado
                    const individualAssignment = {
                        testId: new ObjectId(testId),
                        testType: testType,
                        studentIds: [studentId],
                        estado: 'completado',
                        fechaAsignacion: assignment.fechaAsignacion,
                        fechaVencimiento: assignment.fechaVencimiento,
                        maestroId: assignment.maestroId,
                        institucionId: assignment.institucionId,
                        completedAt: new Date()
                    };

                    // Insertar la nueva asignación individual
                    await db.collection('testAssignments').insertOne(individualAssignment);
                    console.log('✅ Asignación individual creada para estudiante completado:', studentId);
                }

                // Remover al estudiante de la asignación original solo si no es la única persona
                if (assignment.studentIds.length > 1) {
                    await db.collection('testAssignments').updateOne(
                        { _id: assignment._id },
                        { $pull: { studentIds: studentId } }
                    );
                } else {
                    // Si es el único estudiante, marcar la asignación como completada
                    await db.collection('testAssignments').updateOne(
                        { _id: assignment._id },
                        { 
                            $set: { 
                                estado: 'completado',
                                completedAt: new Date()
                            }
                        }
                    );
                }
            }
            
            console.log('✅ Estado actualizado a completado para estudiante:', studentId, 'test:', testId);

            // Crear notificación para el maestro
            const notification = {
                type: 'test_completed',
                title: 'Test Completado',
                message: `El estudiante ${studentId} ha completado un test de ${testType}`,
                studentId: studentId,
                testId: testId,
                testType: testType,
                score: score,
                createdAt: new Date(),
                read: false
            };

            await db.collection('notifications').insertOne(notification);

            console.log('✅ Notificación creada para el maestro:', notification);

            res.json({
                success: true,
                data: {
                    score,
                    totalQuestions,
                    correctAnswers,
                    earnedPoints,
                    totalPoints,
                    pointsPerQuestion,
                    timeSpent: 0 // Por ahora no calculamos tiempo
                },
                message: 'Test enviado exitosamente'
            });
        } catch (error) {
            console.error('Error al enviar respuestas del test:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener resultados de tests del estudiante
    async getStudentTestResults(req, res) {
        try {
            console.log('📊 Obteniendo resultados de tests del estudiante...');
            
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                console.log('❌ No se proporcionó token');
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_seguro_aqui');
            const studentId = decoded.usuario;
            
            console.log('👤 Estudiante ID:', studentId);

            const db = await getDB();
            
            // Obtener resultados de tests del estudiante
            const results = await db.collection('testResults').find({
                studentId: studentId
            }).toArray();
            
            console.log('📋 Resultados encontrados:', results.length);

            // Obtener información de los tests
            const resultsWithTestInfo = [];
            for (const result of results) {
                const collectionName = result.testType === 'matematicas' ? 'testmatematicas' : 'testcomunicacions';
                const { ObjectId } = require('mongodb');
                let testId;
                try {
                    testId = new ObjectId(result.testId);
                } catch (error) {
                    testId = result.testId;
                }

                const test = await db.collection(collectionName).findOne({ _id: testId });
                
                resultsWithTestInfo.push({
                    ...result,
                    test: test ? {
                        titulo: test.titulo,
                        semana: test.semana,
                        descripcion: test.descripcion
                    } : null
                });
            }
            
            console.log('✅ Resultados procesados:', resultsWithTestInfo.length);

            res.json({
                success: true,
                data: resultsWithTestInfo,
                message: 'Resultados de tests obtenidos exitosamente'
            });
        } catch (error) {
            console.error('❌ Error al obtener resultados de tests del estudiante:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener historial de tests completados
    async getTestHistory(req, res) {
        try {
            // Obtener el ID del estudiante desde el token
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            const studentId = decoded.usuario;

            const db = await getDB();
            
            // Obtener historial de tests completados
            const history = await db.collection('testResults').find({
                studentId
            }).sort({ submittedAt: -1 }).toArray();

            res.json({
                success: true,
                data: history,
                message: 'Historial obtenido exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener historial:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener resultados de tests de estudiantes para el maestro
    async getTeacherStudentTestResults(req, res) {
        try {
            // Obtener el token del maestro
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

            console.log('👤 Usuario extraído del token:', maestroUsuario);
            console.log('🎭 Rol extraído del token:', userRole);

            // Verificar que el usuario sea un maestro
            if (userRole !== 'Maestro') {
                console.log('❌ Usuario no es maestro, rol:', userRole);
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los maestros pueden acceder a esta función.'
                });
            }

            const db = await getDB();
            
            // Buscar el maestro con diferentes campos y colecciones posibles
            console.log('🔍 Buscando maestro con usuario:', maestroUsuario);
            let maestro = await db.collection('maestros').findOne({ usuario: maestroUsuario });
            
            if (!maestro) {
                console.log('🔍 No encontrado en "maestros", buscando en "Maestros":');
                maestro = await db.collection('Maestros').findOne({ Usuario: maestroUsuario });
            }
            
            if (!maestro) {
                console.log('🔍 No encontrado por "Usuario", buscando por "Correo":');
                maestro = await db.collection('Maestros').findOne({ Correo: maestroUsuario });
            }
            
            if (!maestro) {
                console.log('🔍 No encontrado por "Correo", listando todos los maestros:');
                const todosMaestros = await db.collection('Maestros').find({}).toArray();
                console.log('📋 Maestros en la base de datos:', todosMaestros.map(m => ({
                    usuario: m.usuario || m.Usuario,
                    correo: m.Correo,
                    nombre: m.Nombre
                })));
                
                return res.status(404).json({
                    success: false,
                    message: 'Maestro no encontrado en la base de datos'
                });
            }
            
            console.log('✅ Maestro encontrado:', {
                usuario: maestro.usuario || maestro.Usuario,
                correo: maestro.Correo,
                nombre: maestro.Nombre,
                cursos: maestro.CURSO
            });

            const cursosMaestro = maestro.CURSO || [];
            console.log('📚 Cursos del maestro:', cursosMaestro);

            // Determinar qué tipos de test puede ver el maestro
            const testTypesPermitidos = [];
            if (cursosMaestro.includes('Matemáticas')) {
                testTypesPermitidos.push('matematicas');
            }
            if (cursosMaestro.includes('Comunicación y lenguaje')) {
                testTypesPermitidos.push('comunicacion');
            }

            if (testTypesPermitidos.length === 0) {
                return res.json({
                    success: true,
                    data: [],
                    message: 'El maestro no tiene cursos asignados'
                });
            }

            // Obtener asignaciones de tests para mostrar en la tabla
            const assignments = await db.collection('testAssignments').find({
                testType: { $in: testTypesPermitidos },
                estado: { $in: ['asignado', 'completado'] }
            }).toArray();

            console.log('📋 Asignaciones encontradas:', assignments.length);

            // Crear un array combinado de asignaciones y resultados
            const combinedData = [];

            // Procesar asignaciones
            for (const assignment of assignments) {
                // Obtener información de cada estudiante en la asignación
                for (const studentId of assignment.studentIds) {
                    // Buscar información del estudiante
                    console.log(`🔍 Buscando información del estudiante: ${studentId}`);
                    let studentInfo = await db.collection('alumnos').findOne({ usuario: studentId });
                    if (!studentInfo) {
                        console.log(`🔍 No encontrado en 'alumnos', buscando en 'Alumnos'`);
                        studentInfo = await db.collection('Alumnos').findOne({ Usuario: studentId });
                    }
                    
                    if (!studentInfo) {
                        console.log(`❌ Estudiante no encontrado: ${studentId}`);
                        // Listar algunos estudiantes para debugging
                        const sampleStudents = await db.collection('Alumnos').find({}).limit(3).toArray();
                        console.log('📋 Ejemplo de estudiantes en la base de datos:', sampleStudents.map(s => ({
                            Usuario: s.Usuario,
                            Nombre: s.Nombre,
                            Apellido: s.Apellido
                        })));
                    } else {
                        console.log(`✅ Estudiante encontrado: ${studentInfo.Nombre} ${studentInfo.Apellido}`);
                    }

                    // Buscar resultado del test si existe
                    const result = await db.collection('testResults').findOne({
                        testId: assignment.testId,
                        studentId: studentId,
                        testType: assignment.testType
                    });

                    // Obtener información del test
                    const collectionName = assignment.testType === 'matematicas' ? 'testmatematicas' : 'testcomunicacions';
                    const { ObjectId } = require('mongodb');
                    let testId;
                    try {
                        testId = new ObjectId(assignment.testId);
                    } catch (error) {
                        testId = assignment.testId;
                    }
                    
                    const test = await db.collection(collectionName).findOne({ _id: testId });

                    // Crear entrada combinada
                    const combinedEntry = {
                        _id: assignment._id,
                        testId: assignment.testId,
                        testType: assignment.testType,
                        studentId: studentId,
                        estado: assignment.estado,
                        fechaAsignacion: assignment.fechaAsignacion,
                        fechaVencimiento: assignment.fechaVencimiento,
                        studentInfo: {
                            nombre: studentInfo?.Nombre || 'Estudiante no encontrado',
                            apellido: studentInfo?.Apellido || '',
                            usuario: studentInfo?.Usuario || studentId,
                            correo: studentInfo?.Correo || ''
                        },
                        testInfo: {
                            titulo: test ? `${assignment.testType === 'matematicas' ? 'Test de Matemáticas' : 'Test de Comunicación'} - Semana ${test.semana}` : 'Test no encontrado',
                            semana: test?.semana || 0
                        },
                        // Información del resultado si existe
                        score: result?.score || null,
                        totalQuestions: result?.totalQuestions || null,
                        correctAnswers: result?.correctAnswers || null,
                        submittedAt: result?.submittedAt || null,
                        timeSpent: result?.timeSpent || null
                    };

                    combinedData.push(combinedEntry);
                }
            }

            // Ordenar por fecha de asignación (más recientes primero)
            combinedData.sort((a, b) => new Date(b.fechaAsignacion) - new Date(a.fechaAsignacion));

            console.log('📊 Datos combinados generados:', combinedData.length);

            res.json({
                success: true,
                data: combinedData,
                message: 'Asignaciones y resultados de tests obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener resultados de tests:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener notificaciones para el maestro
    async getNotifications(req, res) {
        try {
            // Obtener el token del maestro
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

            // Verificar que el usuario sea un maestro
            if (userRole !== 'Maestro') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los maestros pueden acceder a esta función.'
                });
            }

            const db = await getDB();
            
            // Buscar el maestro con diferentes campos y colecciones posibles
            let maestro = await db.collection('maestros').findOne({ usuario: maestroUsuario });
            
            if (!maestro) {
                maestro = await db.collection('Maestros').findOne({ Usuario: maestroUsuario });
            }
            
            if (!maestro) {
                maestro = await db.collection('Maestros').findOne({ Correo: maestroUsuario });
            }
            
            if (!maestro) {
                console.log('❌ Maestro no encontrado para usuario:', maestroUsuario);
                return res.status(404).json({
                    success: false,
                    message: 'Maestro no encontrado'
                });
            }

            const cursosMaestro = maestro.CURSO || [];
            console.log('📚 Cursos del maestro para notificaciones:', cursosMaestro);

            // Determinar qué tipos de test puede ver el maestro
            const testTypesPermitidos = [];
            if (cursosMaestro.includes('Matemáticas')) {
                testTypesPermitidos.push('matematicas');
            }
            if (cursosMaestro.includes('Comunicación y lenguaje')) {
                testTypesPermitidos.push('comunicacion');
            }

            if (testTypesPermitidos.length === 0) {
                return res.json({
                    success: true,
                    data: [],
                    message: 'El maestro no tiene cursos asignados'
                });
            }
            
            // Obtener notificaciones no leídas filtradas por curso del maestro
            const notifications = await db.collection('notifications')
                .find({ 
                    read: false,
                    testType: { $in: testTypesPermitidos }
                })
                .sort({ createdAt: -1 })
                .toArray();

            console.log('🔔 Notificaciones encontradas para el maestro:', notifications.length);

            res.json({
                success: true,
                data: notifications,
                message: 'Notificaciones obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Marcar notificación como leída
    async markNotificationAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            const db = await getDB();
            
            await db.collection('notifications').updateOne(
                { _id: notificationId },
                { $set: { read: true } }
            );

            res.json({
                success: true,
                message: 'Notificación marcada como leída'
            });
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener tests asignados para el maestro (para mostrar cuáles están tachados)
    async getAssignedTestsForTeacher(req, res) {
        try {
            // Obtener el token del maestro
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

            // Verificar que el usuario sea un maestro
            if (userRole !== 'Maestro') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los maestros pueden acceder a esta función.'
                });
            }

            const db = await getDB();
            
            // Buscar el maestro con diferentes campos y colecciones posibles
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
                    message: 'Maestro no encontrado en la base de datos'
                });
            }
            
            // Obtener cursos del maestro para filtrar
            const cursosMaestro = maestro.CURSO || [];
            console.log('📚 Cursos del maestro para obtener asignaciones:', cursosMaestro);
            
            // Determinar qué tipos de test puede ver el maestro
            const testTypesPermitidos = [];
            if (cursosMaestro.includes('Matemáticas')) {
                testTypesPermitidos.push('matematicas');
            }
            if (cursosMaestro.includes('Comunicación y lenguaje')) {
                testTypesPermitidos.push('comunicacion');
            }
            
            console.log('🔍 Tipos de test permitidos:', testTypesPermitidos);
            
            // Obtener asignaciones de tests para mostrar cuáles están asignados
            const assignments = await db.collection('testAssignments').find({
                testType: { $in: testTypesPermitidos },
                estado: { $in: ['asignado', 'completado'] }
            }).toArray();
            
            console.log('📋 Asignaciones encontradas:', assignments.length);
            
            // Crear un array de tests asignados con información del test
            const assignedTestsWithInfo = [];
            
            for (const assignment of assignments) {
                // Obtener información del test
                const collectionName = assignment.testType === 'matematicas' ? 'testmatematicas' : 'testcomunicacions';
                const { ObjectId } = require('mongodb');
                let testId;
                try {
                    testId = new ObjectId(assignment.testId);
                } catch (error) {
                    testId = assignment.testId;
                }
                
                const test = await db.collection(collectionName).findOne({ _id: testId });
                
                if (test) {
                    assignedTestsWithInfo.push({
                        testId: assignment.testId,
                        testType: assignment.testType,
                        estado: assignment.estado,
                        fechaAsignacion: assignment.fechaAsignacion,
                        fechaVencimiento: assignment.fechaVencimiento,
                        test: {
                            _id: test._id,
                            titulo: test.titulo,
                            descripcion: test.descripcion,
                            semana: test.semana,
                            duracion: test.duracion || 30,
                            dificultad: test.dificultad || 'media',
                            curso: assignment.testType
                        }
                    });
                }
            }
            
            console.log('✅ Tests asignados procesados:', assignedTestsWithInfo.length);
            
            res.json({
                success: true,
                data: assignedTestsWithInfo,
                message: 'Tests asignados obtenidos exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener tests asignados para el maestro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Limpiar todos los tests asignados (para reiniciar)
    async clearAllTestAssignments(req, res) {
        try {
            // Obtener el token del maestro
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

            // Verificar que el usuario sea un maestro
            if (userRole !== 'Maestro') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los maestros pueden acceder a esta función.'
                });
            }

            const db = await getDB();
            
            // Verificar que el maestro existe en la base de datos
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
                    message: 'Maestro no encontrado en la base de datos'
                });
            }
            
            // Obtener cursos del maestro para filtrar
            const cursosMaestro = maestro.CURSO || [];
            console.log('📚 Cursos del maestro para limpieza:', cursosMaestro);
            
            // Determinar qué tipos de test puede limpiar el maestro
            const testTypesPermitidos = [];
            if (cursosMaestro.includes('Matemáticas')) {
                testTypesPermitidos.push('matematicas');
            }
            if (cursosMaestro.includes('Comunicación y lenguaje')) {
                testTypesPermitidos.push('comunicacion');
            }
            
            console.log('🧹 Tipos de test a limpiar:', testTypesPermitidos);
            
            // Eliminar solo las asignaciones de tests del curso del maestro
            const assignmentsResult = await db.collection('testAssignments').deleteMany({
                testType: { $in: testTypesPermitidos }
            });
            
            // Eliminar solo los resultados de tests del curso del maestro
            const resultsResult = await db.collection('testResults').deleteMany({
                testType: { $in: testTypesPermitidos }
            });
            
            // Eliminar solo las notificaciones del curso del maestro
            const notificationsResult = await db.collection('notifications').deleteMany({
                testType: { $in: testTypesPermitidos }
            });
            
            console.log('🧹 Limpieza completada:', {
                assignments: assignmentsResult.deletedCount,
                results: resultsResult.deletedCount,
                notifications: notificationsResult.deletedCount
            });

            const courseNames = testTypesPermitidos.map(type => 
                type === 'matematicas' ? 'Matemáticas' : 'Comunicación'
            ).join(' y ');

            res.json({
                success: true,
                message: `Tests de ${courseNames} eliminados exitosamente`,
                data: {
                    assignmentsDeleted: assignmentsResult.deletedCount,
                    resultsDeleted: resultsResult.deletedCount,
                    notificationsDeleted: notificationsResult.deletedCount,
                    coursesCleaned: courseNames
                }
            });
        } catch (error) {
            console.error('Error al limpiar tests asignados:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new TestAssignmentController();
