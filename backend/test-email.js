const emailService = require('./src/services/emailService');

(async () => {
    const ok = await emailService.verifyConnection();
    if (ok) {
        console.log("✅ Conexión SMTP lista para enviar correos");
    } else {
        console.log("❌ No se pudo conectar al servidor SMTP");
    }
})();
