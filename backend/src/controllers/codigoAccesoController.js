const { getDB } = require('../config/db');

class CodigoAccesoController {
    // Verificar código de acceso
    async verificarCodigo(req, res) {
        try {
            const { codigo } = req.body;

            if (!codigo) {
                return res.status(400).json({
                    success: false,
                    message: 'Código de acceso requerido'
                });
            }

            console.log('🔍 [CodigoAcceso] Verificando código:', codigo);

            const db = await getDB();
            
            // Buscar el código en la colección de códigos de acceso
            const codigoEncontrado = await db.collection('codigosAcceso').findOne({
                codigo: codigo.trim().toUpperCase(),
                activo: true
            });

            if (codigoEncontrado) {
                console.log('✅ [CodigoAcceso] Código encontrado:', codigoEncontrado);
                
                // Marcar el código como usado (opcional, dependiendo de si quieres códigos de un solo uso)
                // await db.collection('codigosAcceso').updateOne(
                //     { _id: codigoEncontrado._id },
                //     { $set: { usado: true, fechaUso: new Date() } }
                // );

                return res.json({
                    success: true,
                    data: {
                        codigo: codigoEncontrado.codigo,
                        tipo: codigoEncontrado.tipo,
                        activo: codigoEncontrado.activo,
                        fechaCreacion: codigoEncontrado.fechaCreacion
                    },
                    message: 'Código de acceso válido'
                });
            } else {
                console.log('❌ [CodigoAcceso] Código no encontrado:', codigo);
                return res.status(404).json({
                    success: false,
                    message: 'Código de acceso inválido o expirado'
                });
            }

        } catch (error) {
            console.error('❌ [CodigoAcceso] Error al verificar código:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener o generar código de acceso para roles de institución
    async obtenerCodigoRolInstitucion(req, res) {
        try {
            const { codigoInstitucion, nombreInstitucion } = req.body;

            if (!codigoInstitucion || !nombreInstitucion) {
                return res.status(400).json({
                    success: false,
                    message: 'Código de institución y nombre son requeridos'
                });
            }

            console.log('🔍 [CodigoAcceso] Obteniendo código de ROL para institución:', codigoInstitucion);

            const db = await getDB();
            
            // Primero verificar si ya existe un código de ROL para esta institución
            const codigoExistente = await db.collection('codigosAcceso').findOne({
                codigoInstitucion: codigoInstitucion,
                tipo: 'ROL',
                activo: true
            });

            if (codigoExistente) {
                console.log('✅ [CodigoAcceso] Código de ROL existente encontrado:', codigoExistente.codigo);
                return res.json({
                    success: true,
                    data: {
                        codigo: codigoExistente.codigo,
                        tipo: 'ROL',
                        codigoInstitucion: codigoInstitucion,
                        nombreInstitucion: nombreInstitucion,
                        fechaCreacion: codigoExistente.fechaCreacion
                    },
                    message: 'Código de acceso para roles existente obtenido',
                    esNuevo: false
                });
            }

            // Si no existe, generar uno nuevo
            console.log('🆕 [CodigoAcceso] Generando nuevo código de ROL para institución:', codigoInstitucion);
            
            // Generar código aleatorio de 6 caracteres
            const codigo = Array(6)
                .fill(0)
                .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
                .join('');

            // Verificar que el código no exista en otras instituciones
            const codigoDuplicado = await db.collection('codigosAcceso').findOne({
                codigo: codigo
            });

            if (codigoDuplicado) {
                // Si existe, generar otro recursivamente
                return this.obtenerCodigoRolInstitucion(req, res);
            }

            // Crear el código de acceso para roles
            const nuevoCodigo = {
                codigo: codigo,
                tipo: 'ROL',
                activo: true,
                codigoInstitucion: codigoInstitucion,
                nombreInstitucion: nombreInstitucion,
                fechaCreacion: new Date(),
                generadoPor: 'sistema'
            };

            const resultado = await db.collection('codigosAcceso').insertOne(nuevoCodigo);

            console.log('✅ [CodigoAcceso] Nuevo código de ROL generado exitosamente:', codigo);

            return res.json({
                success: true,
                data: {
                    codigo: codigo,
                    tipo: 'ROL',
                    codigoInstitucion: codigoInstitucion,
                    nombreInstitucion: nombreInstitucion,
                    fechaCreacion: nuevoCodigo.fechaCreacion
                },
                message: 'Nuevo código de acceso para roles generado exitosamente',
                esNuevo: true
            });

        } catch (error) {
            console.error('❌ [CodigoAcceso] Error al obtener/generar código de ROL:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }


    // Obtener código de acceso de una institución específica
    async obtenerCodigoPorInstitucion(req, res) {
        try {
            const { codigoInstitucion } = req.params;

            if (!codigoInstitucion) {
                return res.status(400).json({
                    success: false,
                    message: 'Código de institución requerido'
                });
            }

            console.log('🔍 [CodigoAcceso] Buscando código de ROL para institución:', codigoInstitucion);

            const db = await getDB();
            
            // Buscar el código de ROL para esta institución
            const codigoEncontrado = await db.collection('codigosAcceso').findOne({
                codigoInstitucion: codigoInstitucion,
                tipo: 'ROL',
                activo: true
            });

            if (codigoEncontrado) {
                console.log('✅ [CodigoAcceso] Código encontrado:', codigoEncontrado.codigo);
                return res.json({
                    success: true,
                    data: {
                        codigo: codigoEncontrado.codigo,
                        tipo: codigoEncontrado.tipo,
                        codigoInstitucion: codigoEncontrado.codigoInstitucion,
                        nombreInstitucion: codigoEncontrado.nombreInstitucion,
                        fechaCreacion: codigoEncontrado.fechaCreacion
                    },
                    message: 'Código de acceso encontrado'
                });
            } else {
                console.log('❌ [CodigoAcceso] No se encontró código para institución:', codigoInstitucion);
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró código de acceso para esta institución'
                });
            }

        } catch (error) {
            console.error('❌ [CodigoAcceso] Error al obtener código por institución:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Crear un nuevo código de acceso
    async crearCodigo(req, res) {
        try {
            const { codigo, tipo, descripcion } = req.body;

            if (!codigo || !tipo) {
                return res.status(400).json({
                    success: false,
                    message: 'Código y tipo son requeridos'
                });
            }

            console.log('🔍 [CodigoAcceso] Creando nuevo código:', codigo);

            const db = await getDB();
            
            // Verificar si el código ya existe
            const codigoExistente = await db.collection('codigosAcceso').findOne({
                codigo: codigo.trim().toUpperCase()
            });

            if (codigoExistente) {
                return res.status(409).json({
                    success: false,
                    message: 'El código ya existe en el sistema'
                });
            }

            // Crear el nuevo código
            const nuevoCodigo = {
                codigo: codigo.trim().toUpperCase(),
                tipo: tipo,
                activo: true,
                descripcion: descripcion || '',
                fechaCreacion: new Date(),
                generadoPor: 'admin'
            };

            const resultado = await db.collection('codigosAcceso').insertOne(nuevoCodigo);

            console.log('✅ [CodigoAcceso] Nuevo código creado exitosamente:', codigo);

            return res.json({
                success: true,
                data: {
                    id: resultado.insertedId,
                    codigo: nuevoCodigo.codigo,
                    tipo: nuevoCodigo.tipo,
                    activo: nuevoCodigo.activo,
                    descripcion: nuevoCodigo.descripcion,
                    fechaCreacion: nuevoCodigo.fechaCreacion
                },
                message: 'Código de acceso creado exitosamente'
            });

        } catch (error) {
            console.error('❌ [CodigoAcceso] Error al crear código:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener todos los códigos de acceso
    async obtenerCodigos(req, res) {
        try {
            const db = await getDB();
            
            const codigos = await db.collection('codigosAcceso').find({}).toArray();

            return res.json({
                success: true,
                data: codigos,
                message: 'Códigos obtenidos exitosamente'
            });

        } catch (error) {
            console.error('❌ [CodigoAcceso] Error al obtener códigos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = new CodigoAccesoController();
