const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, // recomendado para STARTTLS
            secure: false, // true solo si usas puerto 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // ⚠️ debe ser App Password de Gmail
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 10000 // 10s de espera antes de marcar timeout
        });
    }

    // Enviar email de bienvenida para Administrador (sin verificación)
    async sendWelcomeEmail(email, nombre) {
        try {
            const mailOptions = {
                from: 'GraduaT',
                to: email,
                subject: '¡Felicidades por tu registro en GraduaT!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0; text-align: center;">¡Felicidades por tu registro en la plataforma!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px; text-align: center;">
                                Hola ${nombre}, tu registro como administrador fue exitoso. ¡Bienvenido a GraduaT!
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                                    Ya puedes iniciar sesión en tu panel de administración:
                                </p>
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" 
                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                          color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; 
                                          font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                    Ir al Panel de Admin
                                </a>
                            </div>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="color: #333; margin-top: 0; text-align: center;">🔑 Información de Acceso</h3>
                                <p style="color: #666; text-align: center; margin: 0;">
                                    Tu cuenta está lista para usar. Puedes acceder al panel de administración con las credenciales que registraste.
                                </p>
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
            console.log('✅ Email de bienvenida enviado:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error al enviar email de bienvenida:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Enviar email de verificación de registro de Administrador (método anterior - ya no se usa)
    async sendVerificationEmail(email, token, nombre) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

            const mailOptions = {
                from: 'GraduaT',
                to: email,
                subject: '¡Felicidades por tu registro en GraduaT!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0; text-align: center;">¡Felicidades por tu registro en la plataforma!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px; text-align: center;">
                                Hola ${nombre}, tu registro fue exitoso. ¡Bienvenido a GraduaT!
                            </p>
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
            console.error('❌ Error al enviar email de verificación:', error.message);
            console.log('💡 El usuario puede verificar manualmente usando el token');
            // No lanzar error, solo retornar fallo para que el registro continúe
            return { success: false, error: error.message };
        }
    }

    // Enviar email de confirmación de registro de institución
    async sendInstitutionRegistrationEmail(email, nombreInstitucion, codigos) {
        try {
            const mailOptions = {
                from: 'GraduaT',
                to: email,
                subject: '¡Felicidades por tu registro en GraduaT!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0; text-align: center;">¡Felicidades por tu registro en la plataforma!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px; text-align: center;">
                                <strong>${nombreInstitucion}</strong> ha sido registrada exitosamente. ¡Bienvenido a GraduaT!
                            </p>

                            <h3 style="color: #333; margin-top: 30px; text-align: center;">🔑 Códigos de Acceso</h3>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr style="background: #e9ecef;">
                                        <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Tipo</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #dee2e6;">Código</th>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: 500;">Institución</td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-family: monospace; font-weight: bold; color: #1e40af;">${codigos.Código_Institución}</td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: 500;">Supervisor</td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-family: monospace; font-weight: bold; color: #7c3aed;">${codigos.Código_Supervisor}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: 500;">Director</td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-family: monospace; font-weight: bold; color: #16a34a;">${codigos.Código_Director}</td>
                                    </tr>
                                    <tr style="background: #f8f9fa;">
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: 500;">Maestro</td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-family: monospace; font-weight: bold; color: #d97706;">${codigos.Código_Maestro}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: 500;">Alumno</td>
                                        <td style="padding: 10px; border: 1px solid #dee2e6; font-family: monospace; font-weight: bold; color: #0369a1;">${codigos.Código_Alumno}</td>
                                    </tr>
                                </table>
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
            console.log('✅ Email de registro de institución enviado:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error al enviar email de registro de institución:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Enviar email de verificación de usuario
    async sendUserVerificationEmail(email, token, nombre, rol) {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

            const mailOptions = {
                from: 'GraduaT',
                to: email,
                subject: '¡Felicidades por tu registro en GraduaT!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0; text-align: center;">¡Felicidades por tu registro en la plataforma!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px; text-align: center;">
                                Hola ${nombre}, tu registro como <strong>${rol}</strong> fue exitoso. ¡Bienvenido a GraduaT!
                            </p>
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
            console.log('✅ Email de verificación de usuario enviado:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error al enviar email de verificación de usuario:', error.message);
            console.log('💡 El usuario puede verificar manualmente usando el token');
            return { success: false, error: error.message };
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