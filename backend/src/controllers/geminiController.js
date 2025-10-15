const geminiService = require('../services/geminiService');

const generarEstructuraTema = async (req, res) => {
    try {
        console.log('🎯 Petición para generar estructura de tema recibida');
        console.log('📝 Datos recibidos:', req.body);
        
        const { tema, materia, duracion } = req.body;
        
        // Validar datos requeridos
        if (!tema || !materia) {
            return res.status(400).json({
                success: false,
                error: 'Tema y materia son requeridos'
            });
        }
        
        // Validar duración (opcional, por defecto 45 minutos)
        const duracionClase = duracion && duracion > 0 ? duracion : 45;
        
        console.log(`🚀 Iniciando generación de estructura para: ${tema} - ${materia}`);
        
        // Generar estructura usando Gemini
        const resultado = await geminiService.generarEstructuraTema(tema, materia, duracionClase);
        
        if (resultado.success) {
            console.log('✅ Estructura generada exitosamente');
            res.status(200).json({
                success: true,
                message: 'Estructura de tema generada exitosamente',
                data: resultado.data
            });
        } else {
            console.log('❌ Error al generar estructura:', resultado.error);
            res.status(500).json({
                success: false,
                error: resultado.error || 'Error al generar estructura de tema'
            });
        }
        
    } catch (error) {
        console.error('❌ Error en el controlador de Gemini:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

const generarEstructuraTemaSimple = async (req, res) => {
    try {
        console.log('🎯 Petición para generar estructura simple recibida');
        
        const { tema, materia } = req.body;
        
        if (!tema || !materia) {
            return res.status(400).json({
                success: false,
                error: 'Tema y materia son requeridos'
            });
        }
        
        const resultado = await geminiService.generarEstructuraTemaSimple(tema, materia);
        
        if (resultado.success) {
            res.status(200).json({
                success: true,
                message: 'Estructura simple generada exitosamente',
                data: resultado.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: resultado.error || 'Error al generar estructura'
            });
        }
        
    } catch (error) {
        console.error('❌ Error en el controlador simple:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    generarEstructuraTema,
    generarEstructuraTemaSimple
};
