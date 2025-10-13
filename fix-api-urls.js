const fs = require('fs');
const path = require('path');

// Lista de archivos que necesitan corrección
const filesToFix = [
    'frontend/src/components/common/admin/login.tsx',
    'frontend/src/components/common/Alumno/index.tsx',
    'frontend/src/pages/roles/maestro.tsx',
    'frontend/src/pages/roles/alumno.tsx',
    'frontend/src/components/common/Maestro/test.tsx',
    'frontend/src/components/common/Maestro/alumnos.tsx',
    'frontend/src/pages/roles/director.tsx',
    'frontend/src/pages/auth/verify-email.tsx',
    'frontend/src/components/forms/codigoAcceso.tsx',
    'frontend/src/components/common/Supervisor/DashboardSupervisor.tsx',
    'frontend/src/pages/roles/supervisor.tsx',
    'frontend/src/pages/admin/admin.tsx',
    'frontend/src/pages/institution/loginIntitucion/formInst.tsx',
    'frontend/src/pages/auth/login/acceso.tsx',
    'frontend/src/components/common/Director/rendimiento.tsx',
    'frontend/src/components/common/Director/cursos.tsx',
    'frontend/src/components/common/Director/dashboard.tsx',
    'frontend/src/components/common/Director/maestros.tsx',
    'frontend/src/components/common/Director/alumnos.tsx',
    'frontend/src/pages/institution/loginIntitucion/login.tsx',
    'frontend/src/pages/auth/login/registro.tsx'
];

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Reemplazar URLs hardcodeadas
        const originalContent = content;
        content = content.replace(/http:\/\/localhost:3001\/api/g, '${API_BASE_URL}');
        
        if (content !== originalContent) {
            // Verificar si ya tiene el import de API_BASE_URL
            if (!content.includes("import { API_BASE_URL }")) {
                // Agregar import al inicio del archivo
                const importMatch = content.match(/^import\s+.*?from\s+['"][^'"]+['"];?\s*\n/m);
                if (importMatch) {
                    const importStatement = `import { API_BASE_URL } from "../../../constants";\n`;
                    content = content.replace(importMatch[0], importStatement + importMatch[0]);
                } else {
                    // Si no hay imports, agregar al inicio
                    content = `import { API_BASE_URL } from "../../../constants";\n` + content;
                }
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            modified = true;
        } else {
            console.log(`⏭️  No changes needed: ${filePath}`);
        }
        
        return modified;
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

console.log('🔧 Starting to fix hardcoded API URLs...\n');

let totalFixed = 0;
filesToFix.forEach(file => {
    if (fixFile(file)) {
        totalFixed++;
    }
});

console.log(`\n🎉 Fixed ${totalFixed} files out of ${filesToFix.length}`);
console.log('\n📝 Next steps:');
console.log('1. Review the changes');
console.log('2. Run: git add .');
console.log('3. Run: git commit -m "fix: Replace all hardcoded localhost URLs with API_BASE_URL"');
console.log('4. Run: git push origin main');
