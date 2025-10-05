const Matematica = require('../models/Matematica');
const Comunicacion = require('../models/Comunicacion');
const Maestro = require('../models/Maestro');

// Obtener agenda del maestro autenticado
const getAgendaMaestro = async (req, res) => {
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
        console.log('🔑 Token recibido:', token.substring(0, 20) + '...');
        
        let usuario;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            console.log('✅ Token decodificado correctamente:', decoded);
            
            // Obtener el usuario del token
            usuario = decoded.usuario;
            if (!usuario) {
                console.log('❌ Usuario no encontrado en el token');
                return res.status(400).json({
                    error: 'Usuario no encontrado en el token'
                });
            }
            console.log('👤 Usuario extraído del token:', usuario);
        } catch (jwtError) {
            console.log('❌ Error al decodificar token:', jwtError.message);
            return res.status(401).json({
                error: 'Token inválido'
            });
        }

        // Buscar el maestro por usuario
        console.log('🔍 Buscando maestro con usuario:', usuario);
        const maestro = await Maestro.findByUsuario(usuario);
        if (!maestro) {
            console.log('❌ Maestro no encontrado para usuario:', usuario);
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        console.log('✅ Maestro encontrado:', maestro.Usuario, 'Cursos:', maestro.CURSO);

        // Determinar qué materia enseñar basado en los cursos del maestro
        let materia = null;
        let ModeloMateria = null;

        // Verificar si el maestro enseña Matemáticas
        let ensenaMatematicas = false;
        if (Array.isArray(maestro.CURSO)) {
            ensenaMatematicas = maestro.CURSO.some(curso => {
                console.log(`  - Verificando curso: "${curso}"`);
                const esMatematicas = curso === 'Matemáticas' || curso.includes('Matemáticas');
                console.log(`    ¿Es Matemáticas?: ${esMatematicas}`);
                return esMatematicas;
            });
        } else {
            ensenaMatematicas = maestro.CURSO === 'Matemáticas' || maestro.CURSO.includes('Matemáticas');
        }

        // Verificar si el maestro enseña Comunicación
        let ensenaComunicacion = false;
        if (Array.isArray(maestro.CURSO)) {
            ensenaComunicacion = maestro.CURSO.some(curso => {
                console.log(`  - Verificando curso: "${curso}"`);
                const esComunicacion = curso === 'Comunicación y lenguaje' || curso.includes('Comunicación');
                console.log(`    ¿Es Comunicación?: ${esComunicacion}`);
                return esComunicacion;
            });
        } else {
            ensenaComunicacion = maestro.CURSO === 'Comunicación y lenguaje' || maestro.CURSO.includes('Comunicación');
        }

        if (ensenaMatematicas) {
            ModeloMateria = Matematica;
            materia = 'Matemáticas';
        } else if (ensenaComunicacion) {
            ModeloMateria = Comunicacion;
            materia = 'Comunicación y lenguaje';
        } else {
            console.log('❌ No se encontró materia válida');
            return res.status(400).json({
                error: 'El maestro no está asignado a ninguna materia válida'
            });
        }

        // Obtener todas las semanas de la materia
        const agenda = await ModeloMateria.findAll();

        res.json({
            success: true,
            data: {
                materia: materia,
                agenda: agenda
            }
        });

    } catch (error) {
        console.error('Error al obtener agenda del maestro:', error);
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

// Generar nueva agenda (siguiente semana)
const generarNuevaAgenda = async (req, res) => {
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
        console.log('🔑 Token recibido:', token.substring(0, 20) + '...');
        
        let usuario;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            console.log('✅ Token decodificado correctamente:', decoded);
            
            // Obtener el usuario del token
            usuario = decoded.usuario;
            if (!usuario) {
                console.log('❌ Usuario no encontrado en el token');
                return res.status(400).json({
                    error: 'Usuario no encontrado en el token'
                });
            }
            console.log('👤 Usuario extraído del token:', usuario);
        } catch (jwtError) {
            console.log('❌ Error al decodificar token:', jwtError.message);
            return res.status(401).json({
                error: 'Token inválido'
            });
        }

        // Buscar el maestro por usuario
        console.log('🔍 Buscando maestro con usuario:', usuario);
        const maestro = await Maestro.findByUsuario(usuario);
        if (!maestro) {
            console.log('❌ Maestro no encontrado para usuario:', usuario);
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        console.log('✅ Maestro encontrado:', maestro.Usuario, 'Cursos:', maestro.CURSO);

        // Determinar qué materia enseñar basado en los cursos del maestro
        let ModeloMateria = null;
        let materia = null;

        // Verificar si el maestro enseña Matemáticas
        let ensenaMatematicas = false;
        if (Array.isArray(maestro.CURSO)) {
            ensenaMatematicas = maestro.CURSO.some(curso => {
                console.log(`  - Verificando curso: "${curso}"`);
                const esMatematicas = curso === 'Matemáticas' || curso.includes('Matemáticas');
                console.log(`    ¿Es Matemáticas?: ${esMatematicas}`);
                return esMatematicas;
            });
        } else {
            ensenaMatematicas = maestro.CURSO === 'Matemáticas' || maestro.CURSO.includes('Matemáticas');
        }

        // Verificar si el maestro enseña Comunicación
        let ensenaComunicacion = false;
        if (Array.isArray(maestro.CURSO)) {
            ensenaComunicacion = maestro.CURSO.some(curso => {
                console.log(`  - Verificando curso: "${curso}"`);
                const esComunicacion = curso === 'Comunicación y lenguaje' || curso.includes('Comunicación');
                console.log(`    ¿Es Comunicación?: ${esComunicacion}`);
                return esComunicacion;
            });
        } else {
            ensenaComunicacion = maestro.CURSO === 'Comunicación y lenguaje' || maestro.CURSO.includes('Comunicación');
        }

        console.log('📊 Enseña Matemáticas:', ensenaMatematicas);
        console.log('📝 Enseña Comunicación:', ensenaComunicacion);

        if (ensenaMatematicas) {
            ModeloMateria = Matematica;
            materia = 'Matemáticas';
        } else if (ensenaComunicacion) {
            ModeloMateria = Comunicacion;
            materia = 'Comunicación y lenguaje';
        } else {
            console.log('❌ No se encontró materia válida');
            return res.status(400).json({
                error: 'El maestro no está asignado a ninguna materia válida'
            });
        }

        // Obtener el número de semana desde el query parameter
        const { semana } = req.query;
        let numeroSemana;

        if (semana) {
            // Si se especifica una semana, usar esa
            numeroSemana = parseInt(semana);
        } else {
            // Si no se especifica, obtener la primera semana disponible
            const primeraSemana = await ModeloMateria.findOne({}, { sort: { semana: 1 } });
            numeroSemana = primeraSemana ? primeraSemana.semana : 1;
        }

        // Obtener la agenda de la semana especificada
        const agendaSemana = await ModeloMateria.findOne({ semana: numeroSemana });

        if (!agendaSemana) {
            return res.status(404).json({
                error: `No hay agenda disponible para la semana ${numeroSemana}`
            });
        }

        res.json({
            success: true,
            data: {
                materia: materia,
                semana: numeroSemana,
                agenda: agendaSemana
            }
        });

    } catch (error) {
        console.error('Error al generar nueva agenda:', error);
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

// Obtener agenda de una semana específica
const getAgendaSemana = async (req, res) => {
    try {
        const { semana } = req.params;
        
        // Verificar que el usuario esté autenticado
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                error: 'Token de acceso requerido'
            });
        }

        // Verificar y decodificar el token
        const jwt = require('jsonwebtoken');
        console.log('🔑 Token recibido:', token.substring(0, 20) + '...');
        
        let usuario;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
            console.log('✅ Token decodificado correctamente:', decoded);
            
            // Obtener el usuario del token
            usuario = decoded.usuario;
            if (!usuario) {
                console.log('❌ Usuario no encontrado en el token');
                return res.status(400).json({
                    error: 'Usuario no encontrado en el token'
                });
            }
            console.log('👤 Usuario extraído del token:', usuario);
        } catch (jwtError) {
            console.log('❌ Error al decodificar token:', jwtError.message);
            return res.status(401).json({
                error: 'Token inválido'
            });
        }

        // Buscar el maestro por usuario
        console.log('🔍 Buscando maestro con usuario:', usuario);
        const maestro = await Maestro.findByUsuario(usuario);
        if (!maestro) {
            console.log('❌ Maestro no encontrado para usuario:', usuario);
            return res.status(404).json({
                error: 'Maestro no encontrado'
            });
        }
        console.log('✅ Maestro encontrado:', maestro.Usuario, 'Cursos:', maestro.CURSO);

        // Determinar qué materia enseñar basado en los cursos del maestro
        let ModeloMateria = null;
        let materia = null;

        // Verificar si el maestro enseña Matemáticas
        let ensenaMatematicas = false;
        if (Array.isArray(maestro.CURSO)) {
            ensenaMatematicas = maestro.CURSO.some(curso => {
                console.log(`  - Verificando curso: "${curso}"`);
                const esMatematicas = curso === 'Matemáticas' || curso.includes('Matemáticas');
                console.log(`    ¿Es Matemáticas?: ${esMatematicas}`);
                return esMatematicas;
            });
        } else {
            ensenaMatematicas = maestro.CURSO === 'Matemáticas' || maestro.CURSO.includes('Matemáticas');
        }

        // Verificar si el maestro enseña Comunicación
        let ensenaComunicacion = false;
        if (Array.isArray(maestro.CURSO)) {
            ensenaComunicacion = maestro.CURSO.some(curso => {
                console.log(`  - Verificando curso: "${curso}"`);
                const esComunicacion = curso === 'Comunicación y lenguaje' || curso.includes('Comunicación');
                console.log(`    ¿Es Comunicación?: ${esComunicacion}`);
                return esComunicacion;
            });
        } else {
            ensenaComunicacion = maestro.CURSO === 'Comunicación y lenguaje' || maestro.CURSO.includes('Comunicación');
        }

        if (ensenaMatematicas) {
            ModeloMateria = Matematica;
            materia = 'Matemáticas';
        } else if (ensenaComunicacion) {
            ModeloMateria = Comunicacion;
            materia = 'Comunicación y lenguaje';
        } else {
            console.log('❌ No se encontró materia válida');
            return res.status(400).json({
                error: 'El maestro no está asignado a ninguna materia válida'
            });
        }

        // Obtener la agenda de la semana específica
        const agenda = await ModeloMateria.findOne({ semana: parseInt(semana) });

        if (!agenda) {
            return res.status(404).json({
                error: `No hay agenda disponible para la semana ${semana}`
            });
        }

        res.json({
            success: true,
            data: {
                materia: materia,
                semana: parseInt(semana),
                agenda: agenda
            }
        });

    } catch (error) {
        console.error('Error al obtener agenda de la semana:', error);
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
    getAgendaMaestro,
    generarNuevaAgenda,
    getAgendaSemana
};
