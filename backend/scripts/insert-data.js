require('dotenv').config();
const { connectDB, getDB } = require('../src/config/db');

// Datos de ejemplo para insertar
const sampleData = {
    alumnos: [
        {
            Nombre: "Juan",
            Apellido: "Pérez",
            Usuario: "juan.perez",
            Correo: "juan@email.com",
            Teléfono: "12345678",
            Rol: "Alumno",
            Código_Rol: "AL001",
            Código_Institución: "INST001",
            Código_Curso: "CUR001"
        },
        {
            Nombre: "María",
            Apellido: "García",
            Usuario: "maria.garcia",
            Correo: "maria@email.com",
            Teléfono: "87654321",
            Rol: "Alumno",
            Código_Rol: "AL002",
            Código_Institución: "INST001",
            Código_Curso: "CUR001"
        }
    ],
    maestros: [
        {
            Nombre: "Carlos",
            Apellido: "López",
            Usuario: "carlos.lopez",
            Correo: "carlos@email.com",
            Teléfono: "11223344",
            Rol: "Maestro",
            Código_Rol: "MA001",
            Código_Institución: "INST001",
            CURSO: "Matemáticas"
        }
    ],
    cursos: [
        {
            Código: "CUR001",
            Nombre_Curso: "Matemáticas Básicas"
        },
        {
            Código: "CUR002",
            Nombre_Curso: "Español"
        }
    ]
};

async function insertSampleData() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await connectDB();
        const db = await getDB();
        
        console.log('📊 Insertando datos de ejemplo...');
        
        // Insertar alumnos
        if (sampleData.alumnos.length > 0) {
            const alumnosResult = await db.collection('Alumnos').insertMany(sampleData.alumnos);
            console.log(`✅ ${alumnosResult.insertedCount} alumnos insertados`);
        }
        
        // Insertar maestros
        if (sampleData.maestros.length > 0) {
            const maestrosResult = await db.collection('Maestros').insertMany(sampleData.maestros);
            console.log(`✅ ${maestrosResult.insertedCount} maestros insertados`);
        }
        
        // Insertar cursos
        if (sampleData.cursos.length > 0) {
            const cursosResult = await db.collection('Cursos').insertMany(sampleData.cursos);
            console.log(`✅ ${cursosResult.insertedCount} cursos insertados`);
        }
        
        console.log('🎉 Datos insertados exitosamente!');
        
    } catch (error) {
        console.error('❌ Error al insertar datos:', error);
    } finally {
        process.exit(0);
    }
}

// Ejecutar solo si este archivo se ejecuta directamente
if (require.main === module) {
    insertSampleData();
}

module.exports = { insertSampleData };
