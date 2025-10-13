const fs = require('fs');

// Archivos que necesitan corrección de rutas de import
const filesToFix = [
    {
        file: 'frontend/src/components/forms/codigoAcceso.tsx',
        correctPath: '../../constants/index'
    },
    {
        file: 'frontend/src/pages/auth/verify-email.tsx',
        correctPath: '../../../constants/index'
    },
    {
        file: 'frontend/src/pages/roles/alumno.tsx',
        correctPath: '../../constants/index'
    },
    {
        file: 'frontend/src/pages/roles/director.tsx',
        correctPath: '../../constants/index'
    },
    {
        file: 'frontend/src/pages/roles/maestro.tsx',
        correctPath: '../../constants/index'
    },
    {
        file: 'frontend/src/pages/roles/supervisor.tsx',
        correctPath: '../../constants/index'
    }
];

// Archivos que pueden tener imports no utilizados
const filesToCheck = [
    'frontend/src/components/common/Alumno/index.tsx',
    'frontend/src/components/common/Director/rendimiento.tsx',
    'frontend/src/pages/auth/login/registro.tsx',
    'frontend/src/pages/institution/loginIntitucion/login.tsx'
];

function fixImportPath(filePath, correctPath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Corregir la ruta de import para apuntar al archivo específico
        const importRegex = /import\s*{\s*API_BASE_URL\s*}\s*from\s*['"][^'"]*['"];?\s*\n?/g;
        const newImport = `import { API_BASE_URL } from "${correctPath}";\n`;
        
        content = content.replace(importRegex, newImport);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed import path in: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

function removeUnusedImport(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si API_BASE_URL se usa en el archivo
        const usesApiBaseUrl = content.includes('${API_BASE_URL}') || 
                              content.includes('API_BASE_URL') ||
                              content.includes('API_BASE_URL +') ||
                              content.includes('API_BASE_URL,');
        
        if (!usesApiBaseUrl) {
            // Remover el import de API_BASE_URL
            const importRegex = /import\s*{\s*API_BASE_URL\s*}\s*from\s*['"][^'"]*['"];?\s*\n?/g;
            content = content.replace(importRegex, '');
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Removed unused import from: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  API_BASE_URL is used in: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error checking ${filePath}:`, error.message);
        return false;
    }
}

console.log('🔧 Fixing all import issues...\n');

let fixedCount = 0;

// Corregir rutas de import para apuntar al archivo específico
filesToFix.forEach(({ file, correctPath }) => {
    if (fixImportPath(file, correctPath)) {
        fixedCount++;
    }
});

// Verificar y remover imports no utilizados
filesToCheck.forEach(file => {
    if (removeUnusedImport(file)) {
        fixedCount++;
    }
});

console.log(`\n🎉 Fixed ${fixedCount} files`);
console.log('\n📝 Next steps:');
console.log('1. Run: git add .');
console.log('2. Run: git commit -m "fix: Correct import paths to specific files and remove unused imports"');
console.log('3. Run: git push origin main');
