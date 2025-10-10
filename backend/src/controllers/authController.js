const jwt = require('jsonwebtoken');
const Login = require('../models/Login');
const Alumno = require('../models/Alumno');
const Maestro = require('../models/Maestro');
const Director = require('../models/Director');
const Supervisor = require('../models/Supervisor');
const emailService = require('../services/emailService');

// Generar JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            usuario: user.Usuario, 
            rol: user.Rol,
            codigoInstitucion: user.Código_Institución 
        },
        process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Login
const login = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        if (!usuario || !contraseña) {
            return res.status(400).json({
                error: 'campos requeridos'
            });
        }

        // Buscar usuario en la colección Login
        const user = await Login.findByUsuario(usuario);
        
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await Login.verifyPassword(contraseña, user.Contraseña);
        
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar si el usuario está habilitado
        let userRoleData = null;
        try {
            switch (user.Rol) {
                case 'Supervisor':
                    userRoleData = await Supervisor.findByUsuario(usuario);
                    break;
                case 'Director':
                    userRoleData = await Director.findByUsuario(usuario);
                    break;
                case 'Maestro':
                    userRoleData = await Maestro.findByUsuario(usuario);
                    break;
                case 'Alumno':
                    userRoleData = await Alumno.findByUsuario(usuario);
                    break;
                default:
                    console.log('Rol no reconocido:', user.Rol);
            }

            // Verificar si el usuario está deshabilitado
            if (userRoleData && userRoleData.habilitado === false) {
                return res.status(403).json({
                    error: 'Su cuenta ha sido deshabilitada.'
                });
            }

        } catch (roleError) {
            console.error('Error al verificar estado del usuario:', roleError);
            // Continuar con el login si hay error al verificar el rol
        }

        // Generar token
        const token = generateToken(user);

        // Respuesta exitosa (sin incluir la contraseña)
        const { Contraseña, ...userWithoutPassword } = user;
        
        // Incluir datos específicos del rol si están disponibles
        let completeUserData = userWithoutPassword;
        if (userRoleData) {
            completeUserData = {
                ...userWithoutPassword,
                ...userRoleData
            };
        }
        
        res.json({
            message: 'Login exitoso',
            token,
            user: completeUserData
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Registro
const register = async (req, res) => {
    try {
        const userData = req.body;
        

        const existingUser = await Login.findByUsuario(userData.Usuario);
        if (existingUser) {
            console.log('Usuario ya existe:', existingUser.Usuario);
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }

        // Verificar si el correo ya existe
        console.log('Verificando si el correo ya existe:', userData.Correo);
        const existingEmail = await Login.findByCorreo(userData.Correo);
        if (existingEmail) {
            console.log('Correo ya existe:', existingEmail.Correo);
            return res.status(400).json({
                error: 'El correo ya está registrado'
            });
        }

        // Crear nuevo usuario en Login
        console.log('Intentando crear usuario con datos:', JSON.stringify(userData, null, 2));
        const loginResult = await Login.create(userData);
        console.log('Resultado de Login.create:', loginResult);
        
        if (loginResult.insertedId) {
            console.log('Usuario creado en Login exitosamente, ID:', loginResult.insertedId);
            // Crear usuario en la colección específica según su rol
            let roleResult = null;
            
            try {
                switch (userData.Rol) {
                    case 'Alumno':
                        roleResult = await Alumno.create({
                            ...userData,
                            Código_Curso: '', // Se llenará después
                            Código_Rol: userData.Código_Rol || '',
                            Nombre_Institución: userData.Nombre_Institución || ''
                        });
                        break;
                    case 'Maestro':
                        const maestroData = {
                            ...userData,
                            CURSO: userData.Cursos || [], // Guardar los cursos seleccionados
                            Código_Rol: userData.Código_Rol || '',
                            Nombre_Institución: userData.Nombre_Institución || '',
                            // Asegurar que todos los campos requeridos estén presentes
                            Apellido: userData.Apellido || '',
                            Código_Institución: userData.Código_Institución || '',
                            Correo: userData.Correo || '',
                            Nombre: userData.Nombre || '',
                            Rol: userData.Rol || '',
                            Teléfono: userData.Teléfono || '',
                            Usuario: userData.Usuario || ''
                        };
                        console.log('📝 Datos del maestro a crear:', JSON.stringify(maestroData, null, 2));
                        console.log('🔍 Cursos recibidos:', userData.Cursos);
                        console.log('🔍 Cursos en maestroData:', maestroData.CURSO);
                        try {
                            roleResult = await Maestro.create(maestroData);
                            console.log('✅ Maestro creado exitosamente:', roleResult);
                        } catch (maestroError) {
                            console.error('❌ Error específico al crear maestro:', maestroError);
                            throw maestroError;
                        }
                        break;
                    case 'Director':
                        roleResult = await Director.create({
                            ...userData,
                            Código_Rol: userData.Código_Rol || '',
                            Nombre_Institución: userData.Nombre_Institución || ''
                        });
                        break;
                    case 'Supervisor':
                        console.log('Creando supervisor con datos:', JSON.stringify(userData, null, 2));
                        roleResult = await Supervisor.create({
                            ...userData,
                            Código: userData.Código_Rol || '',
                            DEPARTAMENTO: userData.Departamento || '',
                            Nombre_Institución: userData.Nombre_Institución || ''
                        });
                        console.log('Supervisor creado exitosamente:', roleResult);
                        break;
                    default:
                        console.log('Rol no reconocido:', userData.Rol);
                }
                
                if (roleResult) {
                    console.log(`Usuario creado en colección ${userData.Rol}:`, roleResult.insertedId);
                }
                
            } catch (roleError) {
                console.error(`Error creando usuario en colección ${userData.Rol}:`, roleError);
                // No fallar el registro si hay error en la colección específica
            }
            
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                userId: loginResult.insertedId,
                roleCollection: userData.Rol
            });
        } else {
            res.status(500).json({
                error: 'Error al crear el usuario'
            });
        }

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Verificar token
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                error: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
        
        res.json({
            valid: true,
            user: decoded
        });

    } catch (error) {
        res.status(401).json({
            error: 'Token inválido'
        });
    }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
    try {
        const { usuario, contraseñaActual, nuevaContraseña } = req.body;

        if (!usuario || !contraseñaActual || !nuevaContraseña) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        // Buscar usuario
        const user = await Login.findByUsuario(usuario);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const isValidPassword = await Login.verifyPassword(contraseñaActual, user.Contraseña);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Contraseña actual incorrecta'
            });
        }

        // Actualizar contraseña
        const result = await Login.updatePassword(usuario, nuevaContraseña);
        
        if (result.modifiedCount > 0) {
            res.json({
                message: 'Contraseña actualizada exitosamente'
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar la contraseña'
            });
        }

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Enviar correo de verificación
const sendVerificationEmail = async (req, res) => {
    try {
        const { email, nombre, rol } = req.body;

        if (!email || !nombre || !rol) {
            return res.status(400).json({
                error: 'Email, nombre y rol son requeridos'
            });
        }

        // Buscar usuario por email
        const user = await Login.findByCorreo(email);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Generar token de verificación
        const verificationToken = require('crypto').randomBytes(32).toString('hex');
        
        // Actualizar usuario con token de verificación
        await Login.updateVerificationToken(user.Usuario, verificationToken);

        // Enviar correo de verificación (opcional - no fallar si hay error)
        let emailSent = false;
        try {
            await emailService.sendUserVerificationEmail(email, verificationToken, nombre, rol);
            console.log('✅ Correo de verificación enviado exitosamente');
            emailSent = true;
        } catch (emailError) {
            console.error('⚠️ Error al enviar correo de verificación:', emailError.message);
            console.log('📧 El usuario puede verificar manualmente usando el token:', verificationToken);
            // No fallar el proceso si el email falla
        }

        res.json({
            message: emailSent 
                ? 'Usuario registrado exitosamente. Correo de verificación enviado.' 
                : 'Usuario registrado exitosamente. Puede verificar su email manualmente.',
            email: email,
            token: verificationToken, // Incluir token para testing
            emailSent: emailSent
        });

    } catch (error) {
        console.error('Error al enviar correo de verificación:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Actualizar datos del usuario con información de institución
const updateUserInstitution = async (req, res) => {
    try {
        const { email, codigoInstitucion, codigoRol } = req.body;

        if (!email || !codigoInstitucion) {
            return res.status(400).json({
                error: 'Email y código de institución son requeridos'
            });
        }

        // Buscar usuario en Login
        const user = await Login.findByCorreo(email);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Actualizar en Login
        await Login.update(user._id, {
            Código_Institución: codigoInstitucion,
            Código_Rol: codigoRol || ''
        });

        // Actualizar en la colección específica según el rol
        let roleUpdateResult = null;
        
        try {
            switch (user.Rol) {
                case 'Alumno':
                    roleUpdateResult = await Alumno.updateByUsuario(user.Usuario, {
                        Código_Institución: codigoInstitucion,
                        Código_Rol: codigoRol || ''
                    });
                    break;
                case 'Maestro':
                    roleUpdateResult = await Maestro.updateByUsuario(user.Usuario, {
                        Código_Institución: codigoInstitucion,
                        Código_Rol: codigoRol || ''
                    });
                    break;
                case 'Director':
                    roleUpdateResult = await Director.updateByUsuario(user.Usuario, {
                        Código_Institución: codigoInstitucion,
                        Código_Rol: codigoRol || ''
                    });
                    break;
                case 'Supervisor':
                    roleUpdateResult = await Supervisor.updateByUsuario(user.Usuario, {
                        Código: codigoRol || ''
                    });
                    break;
            }
            
            if (roleUpdateResult) {
                console.log(`Usuario actualizado en colección ${user.Rol}:`, roleUpdateResult.modifiedCount);
            }
            
        } catch (roleError) {
            console.error(`Error actualizando usuario en colección ${user.Rol}:`, roleError);
            // No fallar si hay error en la colección específica
        }

        res.json({
            message: 'Datos de institución actualizados exitosamente',
            rol: user.Rol,
            institucion: codigoInstitucion
        });

    } catch (error) {
        console.error('Error al actualizar datos de institución:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Verificar email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                error: 'Token de verificación requerido'
            });
        }

        // Buscar usuario por token de verificación
        const user = await Login.findByVerificationToken(token);
        if (!user) {
            return res.status(400).json({
                error: 'Token de verificación inválido o expirado'
            });
        }

        // Marcar email como verificado
        await Login.markEmailAsVerified(user.Usuario);

        // Generar token de acceso
        const accessToken = generateToken(user);

        res.json({
            message: 'Email verificado exitosamente',
            token: accessToken,
            user: {
                Usuario: user.Usuario,
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                Correo: user.Correo,
                Teléfono: user.Teléfono,
                Rol: user.Rol,
                Código_Institución: user.Código_Institución,
                Nombre_Institución: user.Nombre_Institución
            }
        });

    } catch (error) {
        console.error('Error al verificar email:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Verificar token
const verifyTokenAlumno = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'Token de acceso requerido'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
        
        // Buscar usuario
        const user = await Login.findByUsuario(decoded.usuario);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            user: {
                Usuario: user.Usuario,
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                Correo: user.Correo,
                Teléfono: user.Teléfono,
                Rol: user.Rol,
                Código_Institución: user.Código_Institución,
                Nombre_Institución: user.Nombre_Institución
            }
        });

    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(401).json({
            error: 'Token inválido o expirado'
        });
    }
};

// Verificar token y obtener datos completos del usuario según su rol
const verifyTokenWithRoleData = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                error: 'Token de acceso requerido'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui');
        
        // Buscar usuario en Login
        const user = await Login.findByUsuario(decoded.usuario);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Obtener datos completos según el rol
        let roleData = null;
        try {
            switch (user.Rol) {
                case 'Maestro':
                    roleData = await Maestro.findByUsuario(user.Usuario);
                    break;
                case 'Alumno':
                    roleData = await Alumno.findByUsuario(user.Usuario);
                    break;
                case 'Director':
                    roleData = await Director.findByUsuario(user.Usuario);
                    break;
                case 'Supervisor':
                    roleData = await Supervisor.findByUsuario(user.Usuario);
                    break;
            }
        } catch (roleError) {
            console.error(`Error obteniendo datos de ${user.Rol}:`, roleError);
            // Continuar con datos básicos si hay error
        }

        // Combinar datos básicos con datos específicos del rol
        const completeUserData = {
            Usuario: user.Usuario,
            Nombre: user.Nombre,
            Apellido: user.Apellido,
            Correo: user.Correo,
            Teléfono: user.Teléfono,
            Rol: user.Rol,
            Código_Institución: user.Código_Institución,
            Nombre_Institución: user.Nombre_Institución,
            // Agregar datos específicos del rol si están disponibles
            ...(roleData && {
                CURSO: roleData.CURSO || [],
                Código_Rol: roleData.Código_Rol || user.Código_Rol,
                // Para Supervisor
                ...(user.Rol === 'Supervisor' && {
                    DEPARTAMENTO: roleData?.DEPARTAMENTO || '',
                    Código: roleData?.Código || ''
                }),
                // Para Alumno
                ...(user.Rol === 'Alumno' && {
                    Código_Curso: roleData?.Código_Curso || ''
                })
            })
        };

        res.json({
            user: completeUserData
        });

    } catch (error) {
        console.error('Error al verificar token con datos de rol:', error);
        res.status(401).json({
            error: 'Token inválido o expirado'
        });
    }
};

module.exports = {
    login,
    register,
    verifyToken,
    changePassword,
    sendVerificationEmail,
    verifyEmail,
    updateUserInstitution,
    verifyTokenAlumno,
    verifyTokenWithRoleData
};
