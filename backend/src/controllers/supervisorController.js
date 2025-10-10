const { getDB } = require('../config/db');

class SupervisorController {
    // Endpoint temporal para verificar todas las colecciones y sus datos
    async getAllCollectionsInfo(req, res) {
        try {
            const db = await getDB();
            
            // Obtener todas las colecciones
            const colecciones = await db.listCollections().toArray();
            console.log('📚 [All Collections] Colecciones disponibles:', colecciones.map(c => c.name));
            
            const coleccionesInfo = {};
            
            // Verificar cada colección
            for (const coleccion of colecciones) {
                const nombre = coleccion.name;
                try {
                    const count = await db.collection(nombre).countDocuments();
                    console.log(`🔍 [All Collections] Colección "${nombre}": ${count} documentos`);
                    
                    if (count > 0) {
                        // Obtener algunos documentos de muestra
                        const muestra = await db.collection(nombre).find({}).limit(3).toArray();
                        coleccionesInfo[nombre] = {
                            total: count,
                            muestra: muestra
                        };
                    } else {
                        coleccionesInfo[nombre] = {
                            total: 0,
                            muestra: []
                        };
                    }
                } catch (error) {
                    console.log(`❌ [All Collections] Error en colección "${nombre}":`, error.message);
                    coleccionesInfo[nombre] = {
                        total: 0,
                        error: error.message
                    };
                }
            }
            
            res.json({
                success: true,
                data: {
                    colecciones: coleccionesInfo
                },
                message: 'Información de todas las colecciones obtenida'
            });
    } catch (error) {
            console.error('Error al obtener información de todas las colecciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Endpoint temporal para verificar datos de la base de datos
    async getDatabaseInfo(req, res) {
        try {
            const db = await getDB();
            
            // Verificar qué colecciones existen
            const colecciones = await db.listCollections().toArray();
            console.log('📚 [Database Info] Colecciones disponibles:', colecciones.map(c => c.name));
            
            // Intentar con diferentes nombres de colección para instituciones
            let coleccionInstituciones = null;
            const posiblesNombres = ['Colegio', 'colegios', 'Colegios', 'instituciones', 'Instituciones', 'schools'];
            
            for (const nombre of posiblesNombres) {
                try {
                    const count = await db.collection(nombre).countDocuments();
                    console.log(`🔍 [Database Info] Colección "${nombre}": ${count} documentos`);
                    if (count > 0) {
                        coleccionInstituciones = nombre;
                        break;
                    }
                } catch (error) {
                    console.log(`❌ [Database Info] Colección "${nombre}" no existe`);
                }
            }
            
            // Obtener información general
            const totalInstituciones = coleccionInstituciones ? await db.collection(coleccionInstituciones).countDocuments() : 0;
            const departamentos = coleccionInstituciones ? await db.collection(coleccionInstituciones).distinct('DEPARTAMENTO') : [];
            const instituciones = coleccionInstituciones ? await db.collection(coleccionInstituciones).find({}).toArray() : [];
            
            // Obtener información de usuarios (intentar diferentes nombres)
            const posiblesColeccionesAlumnos = ['Alumnos', 'alumnos', 'estudiantes', 'Estudiantes'];
            const posiblesColeccionesMaestros = ['Maestros', 'maestros', 'teachers', 'Teachers'];
            
            let totalAlumnos = 0;
            let totalMaestros = 0;
            
            for (const nombre of posiblesColeccionesAlumnos) {
                try {
                    totalAlumnos = await db.collection(nombre).countDocuments();
                    if (totalAlumnos > 0) break;
                } catch (error) {
                    // Continuar con el siguiente nombre
                }
            }
            
            for (const nombre of posiblesColeccionesMaestros) {
                try {
                    totalMaestros = await db.collection(nombre).countDocuments();
                    if (totalMaestros > 0) break;
                } catch (error) {
                    // Continuar con el siguiente nombre
                }
            }
            
            res.json({
                success: true,
                data: {
                    coleccionesDisponibles: colecciones.map(c => c.name),
                    coleccionInstitucionesUsada: coleccionInstituciones,
                    totalInstituciones,
                    departamentos,
                    instituciones: instituciones.map(inst => ({
                        nombre: inst.Nombre_Completo || inst.nombre || inst.Nombre,
                        departamento: inst.DEPARTAMENTO || inst.departamento || inst.Departamento,
                        codigo: inst.Código_Institución || inst.codigo || inst.Codigo
                    })),
                    totalAlumnos,
                    totalMaestros
                },
                message: 'Información de la base de datos obtenida'
            });
    } catch (error) {
            console.error('Error al obtener información de la DB:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Endpoint específico para obtener todos los datos de Retalhuleu
    async getRetalhuleuData(req, res) {
        try {
            const db = await getDB();
            const departamento = 'Retalhuleu';
            
            console.log('🔍 [Retalhuleu] Obteniendo todos los datos para:', departamento);
            
            // Obtener instituciones de Retalhuleu
            const instituciones = await db.collection('Colegio').find({
                $or: [
                    { DEPARTAMENTO: departamento },
                    { departamento: departamento },
                    { Departamento: departamento }
                ]
            }).toArray();
            
            console.log('🏫 [Retalhuleu] Instituciones encontradas:', instituciones.length);
            
            // Obtener alumnos de Retalhuleu
            const alumnos = await db.collection('Alumnos').find({
                $or: [
                    { DEPARTAMENTO: departamento },
                    { departamento: departamento },
                    { Departamento: departamento }
                ]
            }).toArray();
            
            console.log('👥 [Retalhuleu] Alumnos encontrados:', alumnos.length);
            
            // Obtener maestros de Retalhuleu
            const maestros = await db.collection('Maestros').find({
                $or: [
                    { DEPARTAMENTO: departamento },
                    { departamento: departamento },
                    { Departamento: departamento }
                ]
            }).toArray();
            
            console.log('👨‍🏫 [Retalhuleu] Maestros encontrados:', maestros.length);
            
            // Obtener cursos de Retalhuleu
            const cursos = await db.collection('Cursos').find({
                $or: [
                    { DEPARTAMENTO: departamento },
                    { departamento: departamento },
                    { Departamento: departamento }
                ]
            }).toArray();
            
            console.log('📚 [Retalhuleu] Cursos encontrados:', cursos.length);
            
            // Obtener resultados de tests
            const resultados = await db.collection('testResults').find({}).toArray();
            console.log('📊 [Retalhuleu] Resultados de tests encontrados:', resultados.length);
            
            res.json({
                success: true,
                data: {
                    departamento,
                    instituciones,
                    alumnos,
                    maestros,
                    cursos,
                    resultados,
                    estadisticas: {
                        totalInstituciones: instituciones.length,
                        totalAlumnos: alumnos.length,
                        totalMaestros: maestros.length,
                        totalCursos: cursos.length,
                        totalResultados: resultados.length
                    }
                },
                message: `Datos de ${departamento} obtenidos exitosamente`
            });
        } catch (error) {
            console.error('Error al obtener datos de Retalhuleu:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de rendimiento por departamento (similar al Director)
    async getDepartmentPerformanceStats(req, res) {
        try {
            const { departamento } = req.params;
            
            if (!departamento) {
                return res.status(400).json({
                    success: false,
                    message: 'Departamento es requerido'
                });
            }

            console.log('🔍 [Supervisor Performance] Obteniendo estadísticas de rendimiento para departamento:', departamento);

            const db = await getDB();
            
            // Obtener instituciones del departamento
            const instituciones = await db.collection('Colegio').find({
                $or: [
                    { DEPARTAMENTO: departamento },
                    { departamento: departamento },
                    { Departamento: departamento }
                ]
            }).toArray();

            console.log('🏫 [Supervisor Performance] Instituciones encontradas:', instituciones.length);

            if (instituciones.length === 0) {
                return res.json({
                    success: true,
                    data: {
                        instituciones: [],
                        summary: {
                            totalInstituciones: 0,
                            totalEstudiantes: 0,
                            totalMaestros: 0,
                            totalCursos: 0,
                            overallAverage: 0
                        }
                    },
                    message: `No se encontraron instituciones en el departamento ${departamento}`
                });
            }

            // Obtener todos los resultados de tests
            const allResults = await db.collection('testResults').find({}).toArray();
            console.log('📈 [Supervisor Performance] Resultados de tests encontrados:', allResults.length);
            
            // Obtener información de estudiantes
            const students = await db.collection('Alumnos').find({}).toArray();
            console.log('👥 [Supervisor Performance] Estudiantes encontrados:', students.length);
            
            const studentsMap = new Map();
            students.forEach(student => {
                studentsMap.set(student.Usuario, {
                    nombre: student.Nombre,
                    apellido: student.Apellido,
                    correo: student.Correo,
                    institucion: student.Código_Institución
                });
            });

            // Procesar cada institución
            const institucionesData = await Promise.all(instituciones.map(async (institucion) => {
                try {
                    // Contar estudiantes de esta institución
                    const estudiantesInstitucion = await db.collection('Alumnos').find({
                        Código_Institución: institucion.Código_Institución
                    }).toArray();

                    // Contar maestros de esta institución
                    const maestrosInstitucion = await db.collection('Maestros').find({
                        Código_Institución: institucion.Código_Institución
                    }).toArray();

                    // Contar cursos
                    const totalCursos = maestrosInstitucion.reduce((total, maestro) => {
                        return total + (maestro.CURSO ? maestro.CURSO.length : 0);
                    }, 0);

                    // Obtener IDs de estudiantes de esta institución
                    const estudiantesIds = estudiantesInstitucion.map(est => est.Usuario);
                    
                    // Filtrar resultados de tests para esta institución
                    const resultadosInstitucion = allResults.filter(result => 
                        estudiantesIds.includes(result.studentId)
                    );

                    console.log(`📊 [Supervisor Performance] ${institucion.Nombre_Completo}: ${resultadosInstitucion.length} resultados`);

                    // Calcular rendimiento promedio
                    let promedioRendimiento = 0;
                    if (resultadosInstitucion.length > 0) {
                        const sumaPuntajes = resultadosInstitucion.reduce((sum, resultado) => {
                            return sum + (resultado.score || 0);
                        }, 0);
                        promedioRendimiento = sumaPuntajes / resultadosInstitucion.length;
                    }

                    return {
                        institucionId: institucion._id,
                        nombreInstitucion: institucion.Nombre_Completo,
                        codigoInstitucion: institucion.Código_Institución,
                        totalEstudiantes: estudiantesInstitucion.length,
                        totalMaestros: maestrosInstitucion.length,
                        totalCursos,
                        promedioRendimiento: Math.round(promedioRendimiento * 100) / 100,
                        totalResultados: resultadosInstitucion.length,
                        tendencia: promedioRendimiento >= 80 ? 'excelente' : 
                                  promedioRendimiento >= 70 ? 'bueno' : 
                                  promedioRendimiento >= 60 ? 'regular' : 
                                  promedioRendimiento >= 50 ? 'bajo' : 'muy bajo'
                    };
                } catch (error) {
                    console.error(`Error procesando institución ${institucion.Nombre_Completo}:`, error);
                    return {
                        institucionId: institucion._id,
                        nombreInstitucion: institucion.Nombre_Completo,
                        codigoInstitucion: institucion.Código_Institución,
                        totalEstudiantes: 0,
                        totalMaestros: 0,
                        totalCursos: 0,
                        promedioRendimiento: 0,
                        totalResultados: 0,
                        tendencia: 'sin datos'
                    };
                }
            }));

            // Calcular estadísticas generales del departamento
            const totalEstudiantes = institucionesData.reduce((sum, inst) => sum + inst.totalEstudiantes, 0);
            const totalMaestros = institucionesData.reduce((sum, inst) => sum + inst.totalMaestros, 0);
            const totalCursos = institucionesData.reduce((sum, inst) => sum + inst.totalCursos, 0);
            
            // Calcular promedio general del departamento
            const institucionesConRendimiento = institucionesData.filter(inst => inst.promedioRendimiento > 0);
            const promedioGeneralDepartamento = institucionesConRendimiento.length > 0 
                ? Math.round((institucionesConRendimiento.reduce((sum, inst) => sum + inst.promedioRendimiento, 0) / institucionesConRendimiento.length) * 100) / 100
                : 0;

            console.log('📈 [Supervisor Performance] Promedio general del departamento:', promedioGeneralDepartamento);

            res.json({
                success: true,
                data: {
                    instituciones: institucionesData,
                    summary: {
                        totalInstituciones: instituciones.length,
                        totalEstudiantes,
                        totalMaestros,
                        totalCursos,
                        overallAverage: promedioGeneralDepartamento,
                        institucionesConDatos: institucionesConRendimiento.length
                    }
                },
                message: `Estadísticas de rendimiento obtenidas para ${instituciones.length} instituciones del departamento ${departamento}`
            });

        } catch (error) {
            console.error('Error al obtener estadísticas de rendimiento del departamento:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de instituciones por departamento
    async getInstitutionStatsByDepartment(req, res) {
        try {
            const { departamento } = req.params;
            
            if (!departamento) {
                return res.status(400).json({
                    success: false,
                    message: 'Departamento es requerido'
                });
            }

            console.log('🔍 [Supervisor] Obteniendo estadísticas para departamento:', departamento);

            const db = await getDB();
            
            // Verificar qué colecciones existen
            const colecciones = await db.listCollections().toArray();
            console.log('📚 [Supervisor] Colecciones disponibles:', colecciones.map(c => c.name));
            
            // Intentar con diferentes nombres de colección
            let coleccionInstituciones = null;
            const posiblesNombres = ['Colegio', 'colegios', 'Colegios', 'instituciones', 'Instituciones', 'schools'];
            
            for (const nombre of posiblesNombres) {
                try {
                    const count = await db.collection(nombre).countDocuments();
                    console.log(`🔍 [Supervisor] Colección "${nombre}": ${count} documentos`);
                    if (count > 0) {
                        coleccionInstituciones = nombre;
                        break;
        }
    } catch (error) {
                    console.log(`❌ [Supervisor] Colección "${nombre}" no existe`);
                }
            }
            
            if (!coleccionInstituciones) {
                console.log('❌ [Supervisor] No se encontró ninguna colección con instituciones');
                return res.json({
                    success: true,
                    data: [],
                    message: 'No se encontraron instituciones en la base de datos'
                });
            }
            
            console.log(`✅ [Supervisor] Usando colección: ${coleccionInstituciones}`);
            
            // Primero, verificar qué departamentos existen
            const todosLosDepartamentos = await db.collection(coleccionInstituciones).distinct('DEPARTAMENTO');
            console.log('📍 [Supervisor] Departamentos disponibles en la DB:', todosLosDepartamentos);
            
            // Verificar todas las instituciones
            const todasLasInstituciones = await db.collection(coleccionInstituciones).find({}).toArray();
            console.log('🏫 [Supervisor] Total de instituciones en la DB:', todasLasInstituciones.length);
            console.log('📋 [Supervisor] Instituciones con sus departamentos:', todasLasInstituciones.map(inst => ({
                nombre: inst.Nombre_Completo || inst.nombre || inst.Nombre,
                departamento: inst.DEPARTAMENTO || inst.departamento || inst.Departamento
            })));
            
            // Obtener instituciones del departamento
            const instituciones = await db.collection(coleccionInstituciones).find({
                $or: [
                    { DEPARTAMENTO: departamento },
                    { departamento: departamento },
                    { Departamento: departamento }
                ]
            }).toArray();

            console.log('🎯 [Supervisor] Instituciones encontradas para', departamento, ':', instituciones.length);

            // Para cada institución, obtener estadísticas
            const estadisticas = await Promise.all(instituciones.map(async (institucion) => {
                try {
                    // Contar estudiantes
                    const totalEstudiantes = await db.collection('Alumnos').countDocuments({
                        Código_Institución: institucion.Código_Institución
                    });

                    // Contar maestros
                    const totalMaestros = await db.collection('Maestros').countDocuments({
                        Código_Institución: institucion.Código_Institución
                    });

                    // Contar cursos (sumar todos los cursos de los maestros)
                    const maestros = await db.collection('Maestros').find({
                        Código_Institución: institucion.Código_Institución
                    }).toArray();
                    
                    const totalCursos = maestros.reduce((total, maestro) => {
                        return total + (maestro.CURSO ? maestro.CURSO.length : 0);
                    }, 0);

                    // Calcular rendimiento promedio en tests
                    let promedioRendimiento = 0;
                    try {
                        // Obtener resultados de tests de estudiantes de esta institución
                        const estudiantesIds = await db.collection('Alumnos').find({
                            Código_Institución: institucion.Código_Institución
                        }, { projection: { Usuario: 1 } }).toArray();

                        const estudiantesUsuarios = estudiantesIds.map(est => est.Usuario);
                        
                        if (estudiantesUsuarios.length > 0) {
                            const resultados = await db.collection('testResults').find({
                                studentId: { $in: estudiantesUsuarios }
                            }).toArray();

                            if (resultados.length > 0) {
                                const sumaPuntajes = resultados.reduce((sum, resultado) => {
                                    return sum + (resultado.puntaje || 0);
                                }, 0);
                                promedioRendimiento = Math.round((sumaPuntajes / resultados.length) * 100) / 100;
                            }
                        }
    } catch (error) {
                        console.error('Error calculando rendimiento:', error);
                        promedioRendimiento = 0;
                    }

                    return {
                        institucionId: institucion._id,
                        nombreInstitucion: institucion.Nombre_Completo,
                        codigoInstitucion: institucion.Código_Institución,
                        totalEstudiantes,
                        totalMaestros,
                        totalCursos,
                        promedioRendimiento,
                        tendencia: 'stable' // Por ahora fijo, se puede calcular después
                    };
    } catch (error) {
                    console.error(`Error procesando institución ${institucion.Nombre_Completo}:`, error);
                    return {
                        institucionId: institucion._id,
                        nombreInstitucion: institucion.Nombre_Completo,
                        codigoInstitucion: institucion.Código_Institución,
                        totalEstudiantes: 0,
                        totalMaestros: 0,
                        totalCursos: 0,
                        promedioRendimiento: 0,
                        tendencia: 'stable'
                    };
                }
            }));

            console.log('📊 [Supervisor] Estadísticas calculadas:', estadisticas);

            // Calcular promedio general del departamento
            const institucionesConRendimiento = estadisticas.filter(stat => stat.promedioRendimiento > 0);
            const promedioGeneralDepartamento = institucionesConRendimiento.length > 0 
                ? Math.round((institucionesConRendimiento.reduce((sum, stat) => sum + stat.promedioRendimiento, 0) / institucionesConRendimiento.length) * 100) / 100
                : 0;

            console.log('📈 [Supervisor] Promedio general del departamento:', promedioGeneralDepartamento);

            res.json({
                success: true,
                data: estadisticas,
                promedioGeneralDepartamento,
                totalInstituciones: instituciones.length,
                institucionesConDatos: institucionesConRendimiento.length,
                message: `Estadísticas obtenidas para ${instituciones.length} instituciones del departamento ${departamento}`
            });

    } catch (error) {
            console.error('Error al obtener estadísticas de instituciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new SupervisorController();