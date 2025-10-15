const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            console.error('❌ GEMINI_API_KEY no está configurada en el archivo .env');
            this.model = null;
            return;
        }
        
        try {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            console.log('✅ Servicio de Gemini inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar Gemini:', error.message);
            this.model = null;
        }
    }

    async generarEstructuraTema(tema, materia, duracion = 45) {
        try {
            if (!this.model) {
                // Retornar estructura de ejemplo si Gemini no está disponible
                return {
                    success: true,
                    data: {
                        tema: tema,
                        materia: materia,
                        duracion: duracion,
                        estructura: {
                            objetivos: [
                                `Comprender los conceptos fundamentales de ${tema}`,
                                `Aplicar los conocimientos de ${tema} en situaciones prácticas`,
                                `Desarrollar habilidades de análisis y síntesis`
                            ],
                            inicio: {
                                tiempo: "5-10 minutos",
                                actividad: `Actividad de motivación relacionada con ${tema}. Pregunta inicial para activar conocimientos previos.`
                            },
                            desarrollo: {
                                tiempo: "25-30 minutos",
                                actividades: [
                                    {
                                        tiempo: "10 minutos",
                                        descripcion: `Explicación teórica de ${tema}`
                                    },
                                    {
                                        tiempo: "10 minutos", 
                                        descripcion: "Ejemplos prácticos y casos de estudio"
                                    },
                                    {
                                        tiempo: "5-10 minutos",
                                        descripcion: "Participación activa de los estudiantes"
                                    }
                                ]
                            },
                            cierre: {
                                tiempo: "5-10 minutos",
                                actividad: `Resumen de los puntos clave de ${tema} y evaluación formativa`
                            },
                            recursos: [
                                "Material didáctico impreso",
                                "Presentación multimedia",
                                "Pizarra o pizarra digital"
                            ],
                            evaluacion: `Evaluación formativa durante la clase y tarea para reforzar el aprendizaje de ${tema}`
                        },
                        fechaGeneracion: new Date()
                    }
                };
            }

            console.log('🤖 Generando estructura de tema con Gemini...');
            console.log(`📚 Tema: ${tema}`);
            console.log(`📖 Materia: ${materia}`);
            console.log(`⏱️ Duración: ${duracion} minutos`);

            const prompt = `
Eres un experto en educación y planificación de clases. Necesito que generes una estructura detallada de agenda para una clase de ${materia}.

TEMA DE LA CLASE: "${tema}"
DURACIÓN: ${duracion} minutos
MATERIA: ${materia}

Por favor, genera una estructura de clase que incluya:

1. **OBJETIVOS DE APRENDIZAJE** (3-4 objetivos específicos y medibles)
2. **ACTIVIDADES DE INICIO** (5-10 minutos)
   - Actividad de motivación o activación de conocimientos previos
3. **DESARROLLO DE LA CLASE** (25-30 minutos)
   - Explicación del tema principal
   - Actividades prácticas o ejemplos
   - Participación de estudiantes
4. **ACTIVIDADES DE CIERRE** (5-10 minutos)
   - Resumen de lo aprendido
   - Evaluación formativa
5. **RECURSOS NECESARIOS** (materiales, herramientas, etc.)
6. **EVALUACIÓN** (criterios de evaluación)

IMPORTANTE:
- La estructura debe ser práctica y aplicable en un aula real
- Incluye tiempos específicos para cada sección
- Las actividades deben ser interactivas y motivadoras
- Adapta el contenido al nivel educativo (secundaria)
- Usa un lenguaje claro y profesional
- Formatea la respuesta en secciones claras

Responde en formato JSON con la siguiente estructura:
{
  "objetivos": ["objetivo1", "objetivo2", "objetivo3"],
  "inicio": {
    "tiempo": "5-10 minutos",
    "actividad": "descripción de la actividad de inicio"
  },
  "desarrollo": {
    "tiempo": "25-30 minutos",
    "actividades": [
      {
        "tiempo": "10 minutos",
        "descripcion": "Explicación del tema principal"
      },
      {
        "tiempo": "10 minutos", 
        "descripcion": "Actividades prácticas"
      },
      {
        "tiempo": "5-10 minutos",
        "descripcion": "Participación de estudiantes"
      }
    ]
  },
  "cierre": {
    "tiempo": "5-10 minutos",
    "actividad": "descripción de la actividad de cierre"
  },
  "recursos": ["recurso1", "recurso2", "recurso3"],
  "evaluacion": "criterios de evaluación"
}
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log('✅ Respuesta recibida de Gemini');
            
            // Intentar parsear como JSON
            try {
                const jsonResponse = JSON.parse(text);
                return {
                    success: true,
                    data: {
                        tema: tema,
                        materia: materia,
                        duracion: duracion,
                        estructura: jsonResponse,
                        fechaGeneracion: new Date()
                    }
                };
            } catch (parseError) {
                console.log('⚠️ La respuesta no es JSON válido, devolviendo como texto');
                return {
                    success: true,
                    data: {
                        tema: tema,
                        materia: materia,
                        duracion: duracion,
                        estructura: {
                            contenido: text,
                            formato: 'texto'
                        },
                        fechaGeneracion: new Date()
                    }
                };
            }

        } catch (error) {
            console.error('❌ Error al generar estructura con Gemini:', error);
            return {
                success: false,
                error: error.message || 'Error al generar estructura de tema'
            };
        }
    }

    async generarEstructuraTemaSimple(tema, materia) {
        try {
            console.log('🤖 Generando estructura simple de tema...');
            
            const prompt = `
Genera una estructura de clase de 45 minutos para el tema "${tema}" de la materia ${materia}.

Incluye:
1. Objetivos (3 puntos)
2. Actividades de inicio (5 min)
3. Desarrollo (30 min) 
4. Cierre (10 min)
5. Recursos necesarios

Responde en formato JSON simple y claro.
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            return {
                success: true,
                data: {
                    tema: tema,
                    materia: materia,
                    estructura: text,
                    fechaGeneracion: new Date()
                }
            };

        } catch (error) {
            console.error('❌ Error al generar estructura simple:', error);
            return {
                success: false,
                error: error.message || 'Error al generar estructura'
            };
        }
    }
}

module.exports = new GeminiService();
