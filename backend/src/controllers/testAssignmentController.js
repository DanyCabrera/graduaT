const { getDB } = require('../config/db');

class TestAssignmentController {
    // Endpoint temporal para verificar datos del maestro
    async getMaestroInfo(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            const userRole = decoded.rol;
            const userId = decoded.usuario;

            if (userRole !== 'Maestro') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los maestros pueden acceder a esta función.'
                });
            }

            const db = await getDB();
            
            // Obtener información del maestro
            let maestro = await db.collection('maestros').findOne({ usuario: userId });
            if (!maestro) {
                maestro = await db.collection('Maestros').findOne({ Usuario: userId });
            }
            if (!maestro) {
                maestro = await db.collection('Maestros').findOne({ Correo: userId });
            }

            if (!maestro) {
                return res.status(404).json({
                    success: false,
                    message: 'Maestro no encontrado'
                });
            }

            // Obtener información de la institución
            const institucion = await db.collection('Colegio').findOne({
                Código_Institución: maestro.Código_Institución
            });

            // Obtener estudiantes de la institución
            const estudiantes = await db.collection('Alumnos').find({
                Código_Institución: maestro.Código_Institución
            }).toArray();

            // Obtener asignaciones de tests
            const asignaciones = await db.collection('testAssignments').find({}).toArray();

            res.json({
                success: true,
                data: {
                    maestro: {
                        Usuario: maestro.Usuario || maestro.usuario,
                        Nombre: maestro.Nombre,
                        Código_Institución: maestro.Código_Institución,
                        CURSO: maestro.CURSO
                    },
                    institucion: institucion ? {
                        _id: institucion._id,
                        Nombre_Completo: institucion.Nombre_Completo,
                        Código_Institución: institucion.Código_Institución,
                        DEPARTAMENTO: institucion.DEPARTAMENTO
                    } : null,
                    estudiantes: {
                        total: estudiantes.length,
                        muestra: estudiantes.slice(0, 5).map(est => ({
                            Usuario: est.Usuario,
                            Nombre: est.Nombre,
                            Código_Institución: est.Código_Institución
                        }))
                    },
                    asignaciones: {
                        total: asignaciones.length,
                        muestra: asignaciones.slice(0, 3).map(ass => ({
                            testId: ass.testId,
                            testType: ass.testType,
                            studentIds: ass.studentIds,
                            estado: ass.estado
                        }))
                    }
                },
                message: 'Información del maestro obtenida exitosamente'
            });

        } catch (error) {
            console.error('Error al obtener información del maestro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Endpoint temporal para verificar datos del director
    async getDirectorInfo(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            const userRole = decoded.rol;
            const userId = decoded.usuario;

            if (userRole !== 'Director') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los directores pueden acceder a esta función.'
                });
            }

            const db = await getDB();
            
            // Obtener información del director
            const director = await db.collection('Directores').findOne({ Usuario: userId });
            if (!director) {
                return res.status(404).json({
                    success: false,
                    message: 'Director no encontrado'
                });
            }

            // Obtener información de la institución
            const institucion = await db.collection('Colegio').findOne({
                Código_Institución: director.Código_Institución
            });

            // Obtener estudiantes de la institución
            const estudiantes = await db.collection('Alumnos').find({
                Código_Institución: director.Código_Institución
            }).toArray();

            res.json({
                success: true,
                data: {
                    director: {
                        Usuario: director.Usuario,
                        Nombre: director.Nombre,
                        Código_Institución: director.Código_Institución,
                        Nombre_Institución: director.Nombre_Institución,
                        Colegio: director.Colegio
                    },
                    institucion: institucion ? {
                        _id: institucion._id,
                        Nombre_Completo: institucion.Nombre_Completo,
                        Código_Institución: institucion.Código_Institución,
                        DEPARTAMENTO: institucion.DEPARTAMENTO
                    } : null,
                    estudiantes: {
                        total: estudiantes.length,
                        muestra: estudiantes.slice(0, 5).map(est => ({
                            Usuario: est.Usuario,
                            Nombre: est.Nombre,
                            Código_Institución: est.Código_Institución
                        }))
                    }
                },
                message: 'Información del director obtenida exitosamente'
            });

        } catch (error) {
            console.error('Error al obtener información del director:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

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

            // Optimizar: obtener todos los tests de una vez por tipo
            const { ObjectId } = require('mongodb');
            
            // Separar asignaciones por tipo de test
            const mathAssignments = assignments.filter(a => a.testType === 'matematicas');
            const commAssignments = assignments.filter(a => a.testType === 'comunicacion');
            
            // Obtener todos los testIds únicos por tipo
            const mathTestIds = [...new Set(mathAssignments.map(a => a.testId))];
            const commTestIds = [...new Set(commAssignments.map(a => a.testId))];
            
            // Obtener todos los tests de matemáticas de una vez
            let mathTests = [];
            if (mathTestIds.length > 0) {
                const mathObjectIds = mathTestIds.map(id => {
                    try {
                        return new ObjectId(id);
                    } catch (error) {
                        console.error('Error converting math testId to ObjectId:', id);
                        return id;
                    }
                });
                mathTests = await db.collection('testmatematicas').find({ 
                    _id: { $in: mathObjectIds } 
                }).toArray();
                console.log(`🔍 Obtenidos ${mathTests.length} tests de matemáticas de una vez`);
            }
            
            // Obtener todos los tests de comunicación de una vez
            let commTests = [];
            if (commTestIds.length > 0) {
                const commObjectIds = commTestIds.map(id => {
                    try {
                        return new ObjectId(id);
                    } catch (error) {
                        console.error('Error converting comm testId to ObjectId:', id);
                        return id;
                    }
                });
                commTests = await db.collection('testcomunicacions').find({ 
                    _id: { $in: commObjectIds } 
                }).toArray();
                console.log(`🔍 Obtenidos ${commTests.length} tests de comunicación de una vez`);
            }
            
            // Crear mapas para acceso rápido
            const mathTestsMap = new Map(mathTests.map(test => [test._id.toString(), test]));
            const commTestsMap = new Map(commTests.map(test => [test._id.toString(), test]));
            
            // Obtener todos los resultados del estudiante de una vez
            const testResults = await db.collection('testResults').find({
                studentId: studentId
            }).toArray();
            
            // Crear mapa de resultados para acceso rápido
            const resultsMap = new Map();
            testResults.forEach(result => {
                const key = `${result.testId}_${result.testType}`;
                resultsMap.set(key, result);
            });
            
            // Procesar asignaciones con datos ya obtenidos
            const assignmentsWithTests = assignments.map(assignment => {
                const testMap = assignment.testType === 'matematicas' ? mathTestsMap : commTestsMap;
                const test = testMap.get(assignment.testId);
                
                // Verificar si el estudiante ya completó este test
                const resultKey = `${assignment.testId}_${assignment.testType}`;
                const testResult = resultsMap.get(resultKey);
                
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
            });

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

            // Optimizar: obtener todos los tests de una vez por tipo
            const { ObjectId } = require('mongodb');
            
            // Separar resultados por tipo de test
            const mathResults = results.filter(r => r.testType === 'matematicas');
            const commResults = results.filter(r => r.testType === 'comunicacion');
            
            // Obtener todos los testIds únicos por tipo
            const mathTestIds = [...new Set(mathResults.map(r => r.testId))];
            const commTestIds = [...new Set(commResults.map(r => r.testId))];
            
            // Obtener todos los tests de matemáticas de una vez
            let mathTests = [];
            if (mathTestIds.length > 0) {
                const mathObjectIds = mathTestIds.map(id => {
                    try {
                        return new ObjectId(id);
                    } catch (error) {
                        return id;
                    }
                });
                mathTests = await db.collection('testmatematicas').find({ 
                    _id: { $in: mathObjectIds } 
                }).toArray();
            }
            
            // Obtener todos los tests de comunicación de una vez
            let commTests = [];
            if (commTestIds.length > 0) {
                const commObjectIds = commTestIds.map(id => {
                    try {
                        return new ObjectId(id);
                    } catch (error) {
                        return id;
                    }
                });
                commTests = await db.collection('testcomunicacions').find({ 
                    _id: { $in: commObjectIds } 
                }).toArray();
            }
            
            // Crear mapas para acceso rápido
            const mathTestsMap = new Map(mathTests.map(test => [test._id.toString(), test]));
            const commTestsMap = new Map(commTests.map(test => [test._id.toString(), test]));
            
            // Procesar resultados con datos ya obtenidos
            const resultsWithTestInfo = results.map(result => {
                const testMap = result.testType === 'matematicas' ? mathTestsMap : commTestsMap;
                const test = testMap.get(result.testId);
                
                return {
                    ...result,
                    test: test ? {
                        titulo: test.titulo || `Test de ${result.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación'} - Semana ${test.semana}`,
                        semana: test.semana,
                        descripcion: test.descripcion || `Evaluación de ${result.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación y Lenguaje'} para la semana ${test.semana}`
                    } : null
                };
            });
            
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
                cursos: maestro.CURSO,
                codigoInstitucion: maestro.Código_Institución
            });

            const cursosMaestro = maestro.CURSO || [];
            const codigoInstitucionMaestro = maestro.Código_Institución;
            console.log('📚 Cursos del maestro:', cursosMaestro);
            console.log('🏫 Institución del maestro:', codigoInstitucionMaestro);

            if (!codigoInstitucionMaestro) {
                console.log('❌ Maestro no tiene código de institución asignado');
                return res.status(400).json({
                    success: false,
                    message: 'Maestro no tiene código de institución asignado. Contacte al administrador.'
                });
            }

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
                    // Buscar información del estudiante SOLO de la misma institución del maestro
                    console.log(`🔍 Buscando información del estudiante: ${studentId} en institución: ${codigoInstitucionMaestro}`);
                    let studentInfo = await db.collection('alumnos').findOne({ 
                        usuario: studentId,
                        codigo_institucion: codigoInstitucionMaestro
                    });
                    if (!studentInfo) {
                        console.log(`🔍 No encontrado en 'alumnos', buscando en 'Alumnos'`);
                        studentInfo = await db.collection('Alumnos').findOne({ 
                            Usuario: studentId,
                            Código_Institución: codigoInstitucionMaestro
                        });
                    }
                    
                    if (!studentInfo) {
                        console.log(`❌ Estudiante no encontrado en la institución del maestro: ${studentId}`);
                        // Listar algunos estudiantes de la institución para debugging
                        const sampleStudents = await db.collection('Alumnos').find({
                            Código_Institución: codigoInstitucionMaestro
                        }).limit(3).toArray();
                        console.log('📋 Ejemplo de estudiantes de la institución:', sampleStudents.map(s => ({
                            Usuario: s.Usuario,
                            Nombre: s.Nombre,
                            Apellido: s.Apellido,
                            Código_Institución: s.Código_Institución
                        })));
                        continue; // Saltar este estudiante si no es de la misma institución
                    } else {
                        console.log(`✅ Estudiante encontrado en la institución: ${studentInfo.Nombre} ${studentInfo.Apellido}`);
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
            const codigoInstitucionMaestro = maestro.Código_Institución;
            console.log('📚 Cursos del maestro para obtener asignaciones:', cursosMaestro);
            console.log('🏫 Institución del maestro para obtener asignaciones:', codigoInstitucionMaestro);

            if (!codigoInstitucionMaestro) {
                return res.status(400).json({
                    success: false,
                    message: 'Maestro no tiene código de institución asignado'
                });
            }
            
            // Determinar qué tipos de test puede ver el maestro
            const testTypesPermitidos = [];
            if (cursosMaestro.includes('Matemáticas')) {
                testTypesPermitidos.push('matematicas');
            }
            if (cursosMaestro.includes('Comunicación y lenguaje')) {
                testTypesPermitidos.push('comunicacion');
            }
            
            console.log('🔍 Tipos de test permitidos:', testTypesPermitidos);
            
            // Obtener estudiantes de la institución del maestro para filtrar
            const estudiantesInstitucion = await db.collection('Alumnos').find({
                Código_Institución: codigoInstitucionMaestro
            }).toArray();
            
            const studentIdsInstitucion = estudiantesInstitucion.map(est => est.Usuario);
            console.log('👥 Estudiantes de la institución para obtener asignaciones:', studentIdsInstitucion.length);
            
            // Obtener asignaciones de tests SOLO de la institución del maestro
            const assignments = await db.collection('testAssignments').find({
                testType: { $in: testTypesPermitidos },
                estado: { $in: ['asignado', 'completado'] },
                $or: [
                    { institucionId: codigoInstitucionMaestro },
                    { studentIds: { $in: studentIdsInstitucion } }
                ]
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

    // Endpoint de debugging para verificar asignaciones por institución
    async getAssignmentsByInstitutionDebug(req, res) {
        try {
            const db = await getDB();
            
            // Obtener todas las asignaciones
            const assignments = await db.collection('testAssignments').find({}).toArray();
            
            // Agrupar por institución
            const assignmentsByInstitution = {};
            
            for (const assignment of assignments) {
                const institucionId = assignment.institucionId || 'Sin institución';
                
                if (!assignmentsByInstitution[institucionId]) {
                    assignmentsByInstitution[institucionId] = {
                        institucionId,
                        totalAsignaciones: 0,
                        asignaciones: []
                    };
                }
                
                // Obtener información de estudiantes
                const estudiantes = await db.collection('Alumnos').find({
                    Usuario: { $in: assignment.studentIds }
                }).toArray();
                
                assignmentsByInstitution[institucionId].totalAsignaciones++;
                assignmentsByInstitution[institucionId].asignaciones.push({
                    assignmentId: assignment._id,
                    testId: assignment.testId,
                    testType: assignment.testType,
                    estado: assignment.estado,
                    maestroId: assignment.maestroId,
                    fechaAsignacion: assignment.fechaAsignacion,
                    studentIds: assignment.studentIds,
                    estudiantes: estudiantes.map(est => ({
                        Usuario: est.Usuario,
                        Nombre: est.Nombre,
                        Código_Institución: est.Código_Institución
                    }))
                });
            }
            
            res.json({
                success: true,
                data: {
                    totalAsignaciones: assignments.length,
                    asignacionesPorInstitucion: assignmentsByInstitution
                },
                message: 'Asignaciones agrupadas por institución obtenidas exitosamente'
            });
        } catch (error) {
            console.error('Error al obtener asignaciones por institución:', error);
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
            const codigoInstitucionMaestro = maestro.Código_Institución;
            console.log('📚 Cursos del maestro para limpieza:', cursosMaestro);
            console.log('🏫 Institución del maestro para limpieza:', codigoInstitucionMaestro);

            if (!codigoInstitucionMaestro) {
                return res.status(400).json({
                    success: false,
                    message: 'Maestro no tiene código de institución asignado'
                });
            }
            
            // Determinar qué tipos de test puede limpiar el maestro
            const testTypesPermitidos = [];
            if (cursosMaestro.includes('Matemáticas')) {
                testTypesPermitidos.push('matematicas');
            }
            if (cursosMaestro.includes('Comunicación y lenguaje')) {
                testTypesPermitidos.push('comunicacion');
            }
            
            console.log('🧹 Tipos de test a limpiar:', testTypesPermitidos);
            
            // Obtener estudiantes de la institución del maestro para filtrar
            const estudiantesInstitucion = await db.collection('Alumnos').find({
                Código_Institución: codigoInstitucionMaestro
            }).toArray();
            
            const studentIdsInstitucion = estudiantesInstitucion.map(est => est.Usuario);
            console.log('👥 Estudiantes de la institución para limpieza:', studentIdsInstitucion.length);
            
            // Eliminar solo las asignaciones de tests del curso del maestro Y de su institución
            const assignmentsResult = await db.collection('testAssignments').deleteMany({
                testType: { $in: testTypesPermitidos },
                $or: [
                    { institucionId: codigoInstitucionMaestro },
                    { studentIds: { $in: studentIdsInstitucion } }
                ]
            });
            
            // Eliminar solo los resultados de tests del curso del maestro Y de su institución
            const resultsResult = await db.collection('testResults').deleteMany({
                testType: { $in: testTypesPermitidos },
                studentId: { $in: studentIdsInstitucion }
            });
            
            // Eliminar solo las notificaciones del curso del maestro Y de su institución
            const notificationsResult = await db.collection('notifications').deleteMany({
                testType: { $in: testTypesPermitidos },
                studentId: { $in: studentIdsInstitucion }
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


    // Obtener estadísticas de rendimiento estudiantil para el director
    async getStudentPerformanceStats(req, res) {
        try {
            console.log('🔍 [Performance Stats] Iniciando solicitud de estadísticas de rendimiento');
            
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                console.log('❌ [Performance Stats] No se encontró token de autorización');
                return res.status(401).json({
                    success: false,
                    message: 'Token de acceso requerido'
                });
            }

            console.log('🔑 [Performance Stats] Token encontrado, verificando...');

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            const userRole = decoded.rol;
            const userId = decoded.usuario;

            console.log('👤 [Performance Stats] Usuario:', userId, 'Rol:', userRole);

            // Verificar que el usuario sea un director
            if (userRole !== 'Director') {
                console.log('❌ [Performance Stats] Acceso denegado - Rol incorrecto:', userRole);
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado. Solo los directores pueden acceder a esta función.'
                });
            }

            console.log('✅ [Performance Stats] Autorización exitosa, conectando a la base de datos...');

            const db = await getDB();
            console.log('📊 [Performance Stats] Conectado a la base de datos');
            
            // Obtener información del director para filtrar por su institución
            const director = await db.collection('Directores').findOne({ Usuario: userId });
            if (!director) {
                console.log('❌ [Performance Stats] Director no encontrado:', userId);
                return res.status(404).json({
                    success: false,
                    message: 'Director no encontrado'
                });
            }

            console.log('👤 [Performance Stats] Datos completos del director:', {
                Usuario: director.Usuario,
                Nombre: director.Nombre,
                Código_Institución: director.Código_Institución,
                Nombre_Institución: director.Nombre_Institución,
                Colegio: director.Colegio
            });

            const codigoInstitucion = director.Código_Institución;
            if (!codigoInstitucion) {
                console.log('❌ [Performance Stats] Director no tiene código de institución asignado');
                return res.status(400).json({
                    success: false,
                    message: 'Director no tiene código de institución asignado. Contacte al administrador.'
                });
            }

            console.log('🏫 [Performance Stats] Institución del director:', codigoInstitucion);
            
            // Obtener todos los resultados de tests
            const allResults = await db.collection('testResults').find({}).toArray();
            console.log('📈 [Performance Stats] Resultados de tests encontrados:', allResults.length);
            
            // Obtener información de estudiantes SOLO de la institución del director
            const students = await db.collection('Alumnos').find({
                Código_Institución: codigoInstitucion
            }).toArray();
            console.log('👥 [Performance Stats] Estudiantes de la institución encontrados:', students.length);
            
            // Log de debugging: mostrar algunos estudiantes encontrados
            if (students.length > 0) {
                console.log('📋 [Performance Stats] Primeros estudiantes encontrados:', students.slice(0, 3).map(est => ({
                    Usuario: est.Usuario,
                    Nombre: est.Nombre,
                    Código_Institución: est.Código_Institución
                })));
            } else {
                console.log('⚠️ [Performance Stats] No se encontraron estudiantes para la institución:', codigoInstitucion);
                
                // Verificar si hay estudiantes con códigos similares
                const estudiantesSimilares = await db.collection('Alumnos').find({
                    Código_Institución: { $regex: codigoInstitucion, $options: 'i' }
                }).limit(5).toArray();
                
                if (estudiantesSimilares.length > 0) {
                    console.log('🔍 [Performance Stats] Estudiantes con códigos similares encontrados:', estudiantesSimilares.map(est => ({
                        Usuario: est.Usuario,
                        Nombre: est.Nombre,
                        Código_Institución: est.Código_Institución
                    })));
                }
            }
            
            const studentsMap = new Map();
            students.forEach(student => {
                // Mapear por Usuario (que es el ID único del estudiante)
                studentsMap.set(student.Usuario, {
                    nombre: student.Nombre,
                    apellido: student.Apellido,
                    correo: student.Correo,
                    institucion: student.Código_Institución
                });
            });

            // Agrupar resultados por estudiante (SOLO de la institución del director)
            const studentStats = new Map();
            
            // Obtener IDs de estudiantes de la institución del director
            const estudiantesIds = students.map(est => est.Usuario);
            console.log('🎯 [Performance Stats] IDs de estudiantes de la institución:', estudiantesIds.length);
            
            // Filtrar resultados solo de estudiantes de la institución del director
            const resultadosInstitucion = allResults.filter(result => 
                estudiantesIds.includes(result.studentId)
            );
            console.log('📊 [Performance Stats] Resultados de la institución:', resultadosInstitucion.length);
            
            resultadosInstitucion.forEach(result => {
                const studentId = result.studentId;
                
                if (!studentStats.has(studentId)) {
                    const studentInfo = studentsMap.get(studentId) || { nombre: 'Desconocido', apellido: '', correo: '', institucion: '' };
                    
                    studentStats.set(studentId, {
                        studentId,
                        studentInfo,
                        totalTests: 0,
                        totalScore: 0,
                        scores: [],
                        testTypes: new Set(),
                        lastTestDate: null,
                        performance: 'unknown',
                        mathTests: 0,
                        mathScore: 0,
                        mathScores: [],
                        communicationTests: 0,
                        communicationScore: 0,
                        communicationScores: []
                    });
                }
                
                const stats = studentStats.get(studentId);
                stats.totalTests++;
                stats.totalScore += result.score || 0;
                stats.scores.push(result.score || 0);
                stats.testTypes.add(result.testType);
                
                // Separar por tipo de test
                if (result.testType === 'matematicas') {
                    stats.mathTests++;
                    stats.mathScore += result.score || 0;
                    stats.mathScores.push(result.score || 0);
                } else if (result.testType === 'comunicacion') {
                    stats.communicationTests++;
                    stats.communicationScore += result.score || 0;
                    stats.communicationScores.push(result.score || 0);
                }
                
                if (!stats.lastTestDate || new Date(result.submittedAt) > new Date(stats.lastTestDate)) {
                    stats.lastTestDate = result.submittedAt;
                }
            });

            // Calcular métricas de rendimiento
            const performanceData = Array.from(studentStats.values()).map(stats => {
                const averageScore = stats.totalTests > 0 ? stats.totalScore / stats.totalTests : 0;
                const minScore = Math.min(...stats.scores);
                const maxScore = Math.max(...stats.scores);
                
                // Calcular promedios por materia
                const mathAverage = stats.mathTests > 0 ? stats.mathScore / stats.mathTests : 0;
                const communicationAverage = stats.communicationTests > 0 ? stats.communicationScore / stats.communicationTests : 0;
                
                // Determinar nivel de rendimiento
                let performance = 'unknown';
                if (averageScore >= 80) {
                    performance = 'excellent';
                } else if (averageScore >= 70) {
                    performance = 'good';
                } else if (averageScore >= 60) {
                    performance = 'average';
                } else if (averageScore >= 50) {
                    performance = 'below_average';
                } else {
                    performance = 'poor';
                }

                return {
                    ...stats,
                    averageScore: Math.round(averageScore * 100) / 100,
                    minScore,
                    maxScore,
                    performance,
                    testTypes: Array.from(stats.testTypes),
                    scores: stats.scores, // Mantener para análisis detallado
                    mathAverage: Math.round(mathAverage * 100) / 100,
                    communicationAverage: Math.round(communicationAverage * 100) / 100
                };
            });

            // Calcular estadísticas generales
            const totalStudents = performanceData.length;
            const studentsWithTests = performanceData.filter(s => s.totalTests > 0).length;
            const performanceDistribution = {
                excellent: performanceData.filter(s => s.performance === 'excellent').length,
                good: performanceData.filter(s => s.performance === 'good').length,
                average: performanceData.filter(s => s.performance === 'average').length,
                below_average: performanceData.filter(s => s.performance === 'below_average').length,
                poor: performanceData.filter(s => s.performance === 'poor').length
            };

            const overallAverage = performanceData.length > 0 
                ? performanceData.reduce((sum, s) => sum + s.averageScore, 0) / performanceData.length 
                : 0;

            const responseData = {
                summary: {
                    totalStudents,
                    studentsWithTests,
                    overallAverage: Math.round(overallAverage * 100) / 100,
                    performanceDistribution
                },
                students: performanceData.sort((a, b) => b.averageScore - a.averageScore), // Ordenar por rendimiento
                totalResults: resultadosInstitucion.length, // Solo resultados de la institución del director
                institucion: {
                    codigo: codigoInstitucion,
                    nombre: director.Colegio || 'Institución del Director'
                }
            };

            console.log('✅ [Performance Stats] Datos procesados exitosamente para la institución:', {
                institucion: codigoInstitucion,
                totalStudents,
                studentsWithTests,
                overallAverage: Math.round(overallAverage * 100) / 100,
                totalResults: resultadosInstitucion.length
            });

            res.json({
                success: true,
                data: responseData,
                message: `Estadísticas de rendimiento obtenidas exitosamente para la institución ${codigoInstitucion}`
            });

        } catch (error) {
            console.error('❌ [Performance Stats] Error al obtener estadísticas de rendimiento:', error);
            console.error('❌ [Performance Stats] Stack trace:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new TestAssignmentController();
