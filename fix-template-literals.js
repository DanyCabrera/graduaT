const fs = require('fs');

// Lista de archivos que necesitan corrección de template literals
const filesToFix = [
    'frontend/src/pages/roles/supervisor.tsx',
    'frontend/src/pages/roles/maestro.tsx',
    'frontend/src/pages/roles/director.tsx',
    'frontend/src/pages/roles/alumno.tsx',
    'frontend/src/pages/admin/admin.tsx',
    'frontend/src/pages/institution/loginIntitucion/login.tsx',
    'frontend/src/pages/auth/login/acceso.tsx',
    'frontend/src/components/common/Maestro/alumnos.tsx',
    'frontend/src/components/common/Maestro/test.tsx'
];

function fixTemplateLiterals(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Reemplazar comillas simples con template literals para API_BASE_URL
        const originalContent = content;
        
        // Patrón para encontrar fetch con comillas simples y API_BASE_URL
        content = content.replace(
            /fetch\s*\(\s*['"]\$\{API_BASE_URL\}([^'"]*)['"]\s*,/g,
            'fetch(`${API_BASE_URL}$1`,'
        );
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed template literals in: ${filePath}`);
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

console.log('🔧 Fixing template literals for API_BASE_URL...\n');

let fixedCount = 0;
filesToFix.forEach(file => {
    if (fixTemplateLiterals(file)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files`);
console.log('\n📝 Next steps:');
console.log('1. Run: git add .');
console.log('2. Run: git commit -m "fix: Use template literals for API_BASE_URL in fetch calls"');
console.log('3. Run: git push origin main');
