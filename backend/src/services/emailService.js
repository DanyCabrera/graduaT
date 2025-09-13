const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Enviar email de verificación
    async sendVerificationEmail(email, token, nombre) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Bienvenido a GraduaT - Confirma tu registro',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0;">¡Bienvenido a la plataforma, ${nombre}!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px;">
                                Tu registro fue exitoso. Para completar el proceso y acceder a todas las funcionalidades 
                                de la plataforma, necesitas confirmar tu dirección de correo electrónico.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${verificationUrl}" 
                                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                            color: white; 
                                            padding: 15px 30px; 
                                            text-decoration: none; 
                                            border-radius: 25px; 
                                            font-weight: bold; 
                                            font-size: 16px;
                                            display: inline-block;
                                            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                    ✅ Confirmar mi registro
                                </a>
                            </div>
                            
                            <p style="color: #888; font-size: 14px; line-height: 1.5;">
                                Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:<br>
                                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                            </p>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
                                <h3 style="color: #333; margin-top: 0; font-size: 18px;">🔐 Información de seguridad:</h3>
                                <ul style="color: #666; line-height: 1.6;">
                                    <li>Este enlace expira en 24 horas</li>
                                    <li>No compartas este enlace con nadie</li>
                                    <li>Si no solicitaste este registro, puedes ignorar este email</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
                            <p style="color: #888; font-size: 14px; margin: 0;">
                                © 2024 GraduaT - Sistema de Gestión Educativa<br>
                                Este es un email automático, por favor no respondas.
                            </p>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de verificación enviado:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error al enviar email de verificación:', error);
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    }

    // Verificar configuración del email
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Configuración de email verificada correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error en configuración de email:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
