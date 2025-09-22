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

    // Enviar email de verificación de registro de Administrador
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
                from: process.env.EMAIL_USER,
                to: email,
                subject: '🎓 Registro de Institución Exitoso - GraduaT',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0;">¡Registro de Institución Exitoso!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px;">
                                Felicitaciones, <strong>${nombreInstitucion}</strong> ha sido registrada exitosamente en nuestra plataforma.
                            </p>
                            
                            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                                <h3 style="color: #16a34a; margin-top: 0;">✅ Estado del Registro</h3>
                                <p style="color: #16a34a; margin: 0; font-weight: 500;">
                                    Su institución ha sido registrada correctamente y ya puede comenzar a utilizar la plataforma.
                                </p>
                            </div>

                            <h3 style="color: #333; margin-top: 30px;">🔑 Códigos de Acceso Generados</h3>
                            <p style="color: #666; line-height: 1.6;">
                                Se han generado los siguientes códigos únicos para su institución:
                            </p>

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

                            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                                <h3 style="color: #1e40af; margin-top: 0;">📋 Próximos Pasos</h3>
                                <ul style="color: #1e40af; line-height: 1.6;">
                                    <li>Guarde estos códigos en un lugar seguro</li>
                                    <li>Comparta los códigos correspondientes con cada tipo de usuario</li>
                                    <li>Use el código de institución para acceder al panel de administración</li>
                                    <li>Los usuarios pueden registrarse usando sus códigos específicos</li>
                                </ul>
                            </div>

                            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                                <h3 style="color: #d97706; margin-top: 0;">⚠️ Información Importante</h3>
                                <ul style="color: #d97706; line-height: 1.6;">
                                    <li>No comparta estos códigos con personas no autorizadas</li>
                                    <li>Cada código es único y está vinculado a su institución</li>
                                    <li>En caso de pérdida, contacte al administrador del sistema</li>
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
                from: process.env.EMAIL_USER,
                to: email,
                subject: `🎓 Verificación de Email - ${rol} - GraduaT`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 28px;">🎓 GraduaT</h1>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestión Educativa</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
                            <h2 style="color: #333; margin-top: 0;">¡Hola ${nombre}!</h2>
                            
                            <p style="color: #666; line-height: 1.6; font-size: 16px;">
                                Tu registro como <strong>${rol}</strong> ha sido exitoso. Para completar el proceso y acceder a tu panel correspondiente, 
                                necesitas verificar tu dirección de correo electrónico.
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
                                    ✅ Verificar mi Email
                                </a>
                            </div>
                            
                            <p style="color: #888; font-size: 14px; line-height: 1.5;">
                                Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:<br>
                                <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                            </p>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
                                <h3 style="color: #333; margin-top: 0; font-size: 18px;">🎯 Próximos Pasos:</h3>
                                <ul style="color: #666; line-height: 1.6;">
                                    <li>Haz clic en el botón de verificación</li>
                                    <li>Serás redirigido automáticamente a tu panel de ${rol}</li>
                                    <li>Podrás acceder a todas las funcionalidades disponibles</li>
                                </ul>
                            </div>

                            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                                <h3 style="color: #1e40af; margin-top: 0;">🔐 Información de seguridad:</h3>
                                <ul style="color: #1e40af; line-height: 1.6;">
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