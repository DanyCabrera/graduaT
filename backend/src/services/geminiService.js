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
                                    `Identificar y comprender los elementos clave de ${tema}`,
                                    `Aplicar los conceptos de ${tema} en ejercicios prácticos`,
                                    `Analizar ejemplos reales relacionados con ${tema}`,
                                    `Evaluar la importancia de ${tema} en el contexto comunicativo`
                                ],
                                inicio: {
                                    tiempo: "6 minutos",
                                    actividad: `Actividad de motivación: "¿Qué sabes sobre ${tema}?" - Los estudiantes comparten conocimientos previos sobre el tema. Pregunta generadora: "¿Cómo crees que ${tema} se relaciona con tu vida diaria?" Se realiza una lluvia de ideas rápida para activar conocimientos previos y generar interés.`
                                },
                                desarrollo: {
                                    tiempo: "32 minutos", 
                                    actividades: [
                                        {
                                            tiempo: "12 minutos",
                                            descripcion: `Explicación teórica detallada de ${tema}: Definición, características principales, elementos constitutivos y ejemplos concretos. Se utiliza material visual y ejemplos de la vida cotidiana para facilitar la comprensión.`
                                        },
                                        {
                                            tiempo: "12 minutos", 
                                            descripcion: `Actividad práctica: "Aplicando ${tema}" - Los estudiantes trabajan en parejas para identificar ejemplos del tema en textos, imágenes o situaciones propuestas por el docente. Se comparten los hallazgos con la clase.`
                                        },
                                        {
                                            tiempo: "8 minutos",
                                            descripcion: `Ejercicio de análisis: Los estudiantes analizan un caso específico relacionado con ${tema} y explican cómo se manifiesta en el ejemplo dado. Se fomenta la participación y el debate constructivo.`
                                        }
                                    ]
                                },
                                cierre: {
                                    tiempo: "7 minutos",
                                    actividad: `Síntesis y evaluación: Los estudiantes crean un resumen de 3 puntos clave sobre ${tema}. Evaluación formativa mediante preguntas directas sobre los conceptos aprendidos. Conexión con la vida cotidiana: "¿Dónde más puedes observar ${tema}?"`
                                },
                                recursos: [
                                    "Pizarra o pizarra digital",
                                    "Material didáctico impreso con ejemplos",
                                    "Textos o imágenes de ejemplo",
                                    "Hojas de trabajo para actividades prácticas",
                                    "Cronómetro para gestión del tiempo"
                                ],
                                evaluacion: `Evaluación formativa continua mediante observación de la participación, análisis de las respuestas en las actividades prácticas y evaluación del resumen final. Criterios: comprensión conceptual (40%), aplicación práctica (35%), participación activa (25%).`
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
Eres un experto en educación y planificación de clases. Necesito que generes una estructura DETALLADA y ESPECÍFICA para una clase de ${materia} enfocada en UN SOLO TEMA.

TEMA ESPECÍFICO: "${tema}"
DURACIÓN TOTAL: ${duracion} minutos
MATERIA: ${materia}
NIVEL: Secundaria

INSTRUCCIONES ESPECÍFICAS:
- Este es UN TEMA para UN DÍA de clase
- La estructura debe ser MUY DETALLADA y ESPECÍFICA
- Cada actividad debe tener pasos claros y concretos
- Incluye ejemplos específicos del tema
- Las actividades deben ser prácticas y aplicables inmediatamente
- Usa metodologías activas y participativas

ESTRUCTURA REQUERIDA:

1. **OBJETIVOS DE APRENDIZAJE** (3-4 objetivos específicos, medibles y alcanzables en una clase)
   - Cada objetivo debe ser concreto y evaluable
   - Enfocados específicamente en el tema "${tema}"

2. **ACTIVIDADES DE INICIO** (5-8 minutos)
   - Actividad de motivación específica para el tema
   - Activación de conocimientos previos relacionados con "${tema}"
   - Pregunta generadora o situación problemática

3. **DESARROLLO DE LA CLASE** (30-35 minutos)
   - Explicación teórica del tema con ejemplos concretos
   - Actividades prácticas paso a paso
   - Ejercicios de aplicación específicos del tema
   - Participación activa de estudiantes

4. **ACTIVIDADES DE CIERRE** (5-7 minutos)
   - Síntesis de lo aprendido
   - Evaluación formativa específica
   - Conexión con la vida cotidiana

5. **RECURSOS NECESARIOS** (materiales específicos y concretos)
6. **EVALUACIÓN** (criterios específicos y herramientas de evaluación)

IMPORTANTE:
- Sé MUY ESPECÍFICO en cada actividad
- Incluye ejemplos concretos del tema "${tema}"
- Las actividades deben ser realizables en el tiempo asignado
- Usa un lenguaje claro y directo
- Cada sección debe tener pasos detallados

Responde SOLO en formato JSON con esta estructura exacta:
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
