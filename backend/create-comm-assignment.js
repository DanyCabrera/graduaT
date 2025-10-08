const { getDB } = require('./src/config/db');

async function createCommAssignment() {
    try {
        console.log('🔍 Creando asignación de comunicación...');
        
        const db = await getDB();
        
        // Obtener un estudiante real
        const student = await db.collection('Alumnos').findOne({});
        if (!student) {
            console.log('❌ No hay estudiantes registrados');
            return;
        }
        
        console.log('👤 Estudiante encontrado:', student.Nombre, student.Apellido, '(' + student.Usuario + ')');
        
        // Obtener un test de comunicación
        const commTest = await db.collection('testcomunicacions').findOne({});
        if (!commTest) {
            console.log('❌ No hay tests de comunicación');
            return;
        }
        
        console.log('📚 Test de comunicación encontrado:', 'Semana', commTest.semana);
        
        // Crear asignación de comunicación
        const testAssignment = {
            testId: commTest._id,
            testType: 'comunicacion',
            studentIds: [student.Usuario], // Usar el Usuario real
            fechaAsignacion: new Date(),
            fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
            estado: 'asignado',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('💾 Creando asignación de comunicación...');
        const result = await db.collection('testAssignments').insertOne(testAssignment);
        
        console.log('✅ Asignación de comunicación creada exitosamente:');
        console.log('   - ID:', result.insertedId);
        console.log('   - Test:', commTest._id);
        console.log('   - Estudiante:', student.Usuario);
        console.log('   - Tipo:', 'comunicacion');
        console.log('   - Semana:', commTest.semana);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

createCommAssignment();
