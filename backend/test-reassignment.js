const axios = require('axios');

// Script para probar la reasignación de tests a nuevos alumnos
async function testReassignment() {
    const baseURL = 'http://localhost:3001';
    
    try {
        console.log('🧪 Probando reasignación de tests a nuevos alumnos...\n');
        
        // 1. Verificar asignaciones existentes para COLKEC
        console.log('1️⃣ Verificando asignaciones existentes para COLKEC...');
        try {
            const debugResponse = await axios.get(`${baseURL}/api/tests/debug-assignments/COLKEC`);
            console.log('✅ Asignaciones encontradas:', debugResponse.data.data.totalAssignments);
            
            if (debugResponse.data.data.totalAssignments > 0) {
                console.log('📋 Detalles de asignaciones:');
                debugResponse.data.data.allAssignments.forEach((assignment, index) => {
                    console.log(`  ${index + 1}. Test: ${assignment.testId}, Estado: ${assignment.estado}, Estudiantes: ${assignment.studentIds?.length || 0}`);
                });
            }
        } catch (error) {
            console.error('❌ Error al verificar asignaciones:', error.message);
        }
        
        // 2. Probar reasignación para un nuevo alumno
        console.log('\n2️⃣ Probando reasignación para nuevo alumno...');
        const testStudent = {
            studentUsuario: 'nuevo_alumno_test@test.com',
            studentInstitution: 'COLKEC'
        };
        
        try {
            const reassignResponse = await axios.post(`${baseURL}/api/tests/reassign-to-new-student`, testStudent);
            console.log('✅ Reasignación exitosa:');
            console.log(`   - Alumno: ${reassignResponse.data.data.studentUsuario}`);
            console.log(`   - Institución: ${reassignResponse.data.data.studentInstitution}`);
            console.log(`   - Asignaciones existentes: ${reassignResponse.data.data.existingAssignments}`);
            console.log(`   - Nuevas asignaciones: ${reassignResponse.data.data.newAssignments}`);
            console.log(`   - Test IDs: ${reassignResponse.data.data.testIds?.join(', ') || 'N/A'}`);
        } catch (error) {
            console.error('❌ Error en reasignación:', error.response?.data || error.message);
        }
        
        // 3. Verificar que se crearon las nuevas asignaciones
        console.log('\n3️⃣ Verificando nuevas asignaciones...');
        try {
            const debugResponse2 = await axios.get(`${baseURL}/api/tests/debug-assignments/COLKEC`);
            console.log('✅ Total de asignaciones después de la reasignación:', debugResponse2.data.data.totalAssignments);
            
            // Buscar asignaciones para el nuevo alumno
            const newStudentAssignments = debugResponse2.data.data.allAssignments.filter(
                assignment => assignment.studentIds && assignment.studentIds.includes(testStudent.studentUsuario)
            );
            
            console.log(`📋 Asignaciones para ${testStudent.studentUsuario}: ${newStudentAssignments.length}`);
            newStudentAssignments.forEach((assignment, index) => {
                console.log(`  ${index + 1}. Test: ${assignment.testId}, Estado: ${assignment.estado}`);
            });
        } catch (error) {
            console.error('❌ Error al verificar nuevas asignaciones:', error.message);
        }
        
        // 4. Probar con otro alumno para verificar que no se duplican
        console.log('\n4️⃣ Probando reasignación para el mismo alumno (debería no duplicar)...');
        try {
            const reassignResponse2 = await axios.post(`${baseURL}/api/tests/reassign-to-new-student`, testStudent);
            console.log('✅ Segunda reasignación:');
            console.log(`   - Nuevas asignaciones: ${reassignResponse2.data.data.newAssignments}`);
            console.log(`   - Mensaje: ${reassignResponse2.data.message}`);
        } catch (error) {
            console.error('❌ Error en segunda reasignación:', error.response?.data || error.message);
        }
        
        console.log('\n✅ Prueba de reasignación completada');
        
    } catch (error) {
        console.error('❌ Error general en la prueba:', error.message);
    }
}

// Función para probar con diferentes instituciones
async function testWithDifferentInstitution() {
    const baseURL = 'http://localhost:3001';
    
    console.log('\n🧪 Probando con institución diferente...');
    
    const testStudent = {
        studentUsuario: 'alumno_otra_institucion@test.com',
        studentInstitution: 'OTRA_INST'
    };
    
    try {
        const response = await axios.post(`${baseURL}/api/tests/reassign-to-new-student`, testStudent);
        console.log('✅ Resultado para institución diferente:');
        console.log(`   - Asignaciones existentes: ${response.data.data.existingAssignments}`);
        console.log(`   - Nuevas asignaciones: ${response.data.data.newAssignments}`);
        console.log(`   - Mensaje: ${response.data.message}`);
    } catch (error) {
        console.error('❌ Error con institución diferente:', error.response?.data || error.message);
    }
}

// Ejecutar las pruebas
async function runTests() {
    console.log('🚀 Iniciando pruebas de reasignación de tests...\n');
    
    // Verificar que el servidor esté corriendo
    try {
        await axios.get('http://localhost:3001/api/tests/debug-assignments/COLKEC');
        console.log('✅ Servidor backend está corriendo\n');
    } catch (error) {
        console.error('❌ Error: El servidor backend no está corriendo en http://localhost:3001');
        console.error('   Por favor, inicia el servidor con: npm start');
        return;
    }
    
    await testReassignment();
    await testWithDifferentInstitution();
    
    console.log('\n🎉 Todas las pruebas completadas');
}

// Ejecutar el script
runTests();
