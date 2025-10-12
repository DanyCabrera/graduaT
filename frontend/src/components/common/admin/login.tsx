import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Avatar,
    Divider,
    CircularProgress,
    InputAdornment,
    IconButton,
    Fade,
    Alert,
    Snackbar
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    AdminPanelSettings,
    Login as LoginIcon,
    PersonAdd,
    ArrowBack,
} from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tipos para las props
interface FormData {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    confirmPassword: string;
}

interface LoginFormProps {
    formData: FormData;
    showPassword: boolean;
    isLoading: boolean;
    handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickShowPassword: () => void;
    handleLogin: (e: React.FormEvent) => void;
    toggleRegister: () => void;
}

interface RegisterFormProps {
    formData: FormData;
    errors: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        confirmPassword: string;
    };
    showPassword: boolean;
    showConfirmPassword: boolean;
    isLoading: boolean;
    handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickShowPassword: () => void;
    handleClickShowConfirmPassword: () => void;
    handleRegister: (e: React.FormEvent) => void;
    toggleRegister: () => void;
}

// Componente LoginForm separado
const LoginForm: React.FC<LoginFormProps> = ({
    formData,
    showPassword,
    isLoading,
    handleInputChange,
    handleClickShowPassword,
    handleLogin,
    toggleRegister
}) => (
    <Fade in timeout={800}>
        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: 3,
                maxWidth: 400,
                width: '100%',
                border: '1px solid #e0e0e0',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            {/* Header con logo */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: '#1a1a1a',
                        color: 'white',
                    }}
                >
                    <AdminPanelSettings sx={{ fontSize: 24 }} />
                </Avatar>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Administrador
                </Typography>
            </Box>

            {/* Título */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 1,
                    textAlign: 'center',
                }}
            >
                Iniciar Sesión
            </Typography>
            
            <Typography
                variant="body2"
                sx={{
                    color: '#666',
                    mb: 4,
                    textAlign: 'center',
                }}
            >
                Accede al panel de administración
            </Typography>

            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    label="Usuario"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    placeholder="Ingresa tu usuario"
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fafafa',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'white',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#666',
                            fontWeight: 500,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ccc',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1a1a1a',
                            borderWidth: 2,
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Ingresa tu contraseña"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    sx={{ color: '#999' }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#fafafa',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'white',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#666',
                            fontWeight: 500,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ccc',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1a1a1a',
                            borderWidth: 2,
                        },
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                    sx={{
                        py: 1.5,
                        mb: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#333',
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#999',
                        },
                    }}
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </form>

            <Divider sx={{ my: 3, borderColor: '#f0f0f0' }} />

            <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={toggleRegister}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: '#e0e0e0',
                    color: '#666',
                    '&:hover': {
                        borderColor: '#1a1a1a',
                        backgroundColor: '#fafafa',
                        color: '#1a1a1a',
                    },
                }}
            >
                Crear cuenta de administrador
            </Button>
        </Paper>
    </Fade>
);

// Componente RegisterForm separado
const RegisterForm: React.FC<RegisterFormProps> = ({
    formData,
    errors,
    showPassword,
    showConfirmPassword,
    isLoading,
    handleInputChange,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    handleRegister,
    toggleRegister
}) => (
    <Fade in timeout={800}>
        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: 3,
                maxWidth: 500,
                width: '100%',
                border: '1px solid #e0e0e0',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            {/* Header con logo */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                    pb: 3,
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: '#1a1a1a',
                        color: 'white',
                    }}
                >
                    <PersonAdd sx={{ fontSize: 24 }} />
                </Avatar>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 600, 
                        color: '#1a1a1a',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Registro
                </Typography>
            </Box>

            {/* Título */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 1,
                    textAlign: 'center',
                }}
            >
                Crear Cuenta
            </Typography>
            
            <Typography
                variant="body2"
                sx={{
                    color: '#666',
                    mb: 4,
                    textAlign: 'center',
                }}
            >
                Crea una nueva cuenta de administrador
            </Typography>

            <form onSubmit={handleRegister}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        variant="outlined"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        sx={textFieldStyles}
                    />
                    <TextField
                        fullWidth
                        label="Apellido"
                        variant="outlined"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        sx={textFieldStyles}
                    />
                    <TextField
                        fullWidth
                        label="Usuario"
                        variant="outlined"
                        value={formData.username}
                        onChange={handleInputChange('username')}
                        error={!!errors.username}
                        helperText={errors.username || "Sugerencia: Usa letras, números y guiones bajos (ej: usuario_123)"}
                        sx={textFieldStyles}
                    />
                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        type="email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={!!errors.email}
                        helperText={errors.email || "ejemplo@correo.com"}
                        sx={textFieldStyles}
                    />
                    <TextField
                        fullWidth
                        label="Teléfono"
                        type="tel"
                        variant="outlined"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        sx={textFieldStyles}
                    />
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            error={!!errors.password}
                            helperText={errors.password || "Mínimo 8 caracteres"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ color: '#666' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyles}
                        />
                        <TextField
                            fullWidth
                            label="Confirmar contraseña"
                            type={showConfirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword || "Repite tu contraseña"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                            sx={{ color: '#666' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldStyles}
                        />
                    </Box>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAdd />}
                    sx={{
                        py: 1.5,
                        mt: 4,
                        mb: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#333',
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#999',
                        },
                    }}
                >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
            </form>

            <Divider sx={{ my: 3, borderColor: '#f0f0f0' }} />

            <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={toggleRegister}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: '#e0e0e0',
                    color: '#666',
                    '&:hover': {
                        borderColor: '#1a1a1a',
                        backgroundColor: '#fafafa',
                        color: '#1a1a1a',
                    },
                }}
            >
                Iniciar sesión
            </Button>
        </Paper>
    </Fade>
);

// Estilos para los TextFields
const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: '#fafafa',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        '&.Mui-focused': {
            backgroundColor: 'white',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#666',
        fontWeight: 500,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e0e0e0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ccc',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a1a1a',
        borderWidth: 2,
    },
};

export default function LoginAdmin() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        confirmPassword: ''
    });

    // Función para validar el username
    const validateUsername = (username: string) => {
        if (!username) {
            return 'El usuario es requerido';
        }
        if (username.length < 3) {
            return 'El usuario debe tener al menos 3 caracteres';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'El usuario solo puede contener letras, números y guiones bajos';
        }
        return '';
    };

    // Función para validar el correo
    const validateEmail = (email: string) => {
        if (!email) {
            return 'El correo es requerido';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Ingresa un correo electrónico válido';
        }
        return '';
    };

    // Función para validar la contraseña
    const validatePassword = (password: string) => {
        if (!password) {
            return 'La contraseña es requerida';
        }
        if (password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres';
        }
        return '';
    };

    // Función para validar confirmación de contraseña
    const validateConfirmPassword = (confirmPassword: string, password: string) => {
        if (!confirmPassword) {
            return 'Confirma tu contraseña';
        }
        if (password && confirmPassword !== password) {
            return 'Las contraseñas no coinciden';
        }
        return '';
    };

    const handleClickShowPassword = useCallback(() => {
        setShowPassword((show) => !show);
    }, []);

    const handleClickShowConfirmPassword = useCallback(() => {
        setShowConfirmPassword((show) => !show);
    }, []);

    const handleInputChange = useCallback((field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setFormData(prev => {
            const newFormData = {
                ...prev,
                [field]: value
            };

            // Validar el campo específico
            if (field === 'username') {
                setErrors(prevErrors => ({ ...prevErrors, username: validateUsername(value) }));
            } else if (field === 'email') {
                setErrors(prevErrors => ({ ...prevErrors, email: validateEmail(value) }));
            } else if (field === 'password') {
                const passwordError = validatePassword(value);
                const confirmPasswordError = validateConfirmPassword(prev.confirmPassword, value);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    password: passwordError,
                    confirmPassword: confirmPasswordError
                }));
            } else if (field === 'confirmPassword') {
                const confirmPasswordError = validateConfirmPassword(value, prev.password);
                console.log('Validando confirmar contraseña:', { value, password: prev.password, confirmPasswordError });
                setErrors(prevErrors => ({
                    ...prevErrors,
                    confirmPassword: confirmPasswordError
                }));
            }

            return newFormData;
        });
    }, []);

    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Limpiar campos cuando el componente se monta
    useEffect(() => {
        setFormData({
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            confirmPassword: ''
        });

        setErrors({
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            confirmPassword: ''
        });
    }, []);

    const handleLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/useradmin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Usuario: formData.username,
                    Contraseña: formData.password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Guardar token y datos del usuario
                localStorage.setItem('adminToken', data.token || 'admin_logged');
                localStorage.setItem('adminUser', JSON.stringify(data.data));

                setSnackbar({
                    open: true,
                    message: 'Login exitoso! Redirigiendo...',
                    severity: 'success'
                });

                // Redirigir al panel de admin
                setTimeout(() => {
                    navigate('/admin/panel');
                }, 1500);
            } else {
                setSnackbar({
                    open: true,
                    message: data.message || 'Credenciales inválidas',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error en login:', error);
            setSnackbar({
                open: true,
                message: 'Error de conexión. Intenta nuevamente.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, navigate]);

    const handleRegister = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validar que las contraseñas coincidan antes de enviar
        if (formData.password !== formData.confirmPassword) {
            setSnackbar({
                open: true,
                message: 'Las contraseñas no coinciden',
                severity: 'error'
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/useradmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre: formData.firstName,
                    Apellido: formData.lastName,
                    Usuario: formData.username,
                    Correo: formData.email,
                    Telefono: formData.phone,
                    Contraseña: formData.password,
                    Confirmar_Contraseña: formData.confirmPassword
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setSnackbar({
                    open: true,
                    message: 'Registro exitoso! Ya puedes iniciar sesión. Revisa tu correo para el mensaje de bienvenida.',
                    severity: 'success'
                });

                // Limpiar formulario y errores
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    confirmPassword: ''
                });

                // Limpiar errores
                setErrors({
                    username: '',
                    password: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    confirmPassword: ''
                });

                // Cambiar a login después de 2 segundos
                setTimeout(() => {
                    setIsRegistering(false);
                }, 2000);
            } else {
                // Mostrar errores específicos si están disponibles
                let errorMessage = data.message || 'Error en el registro';

                // Manejar diferentes tipos de errores
                if (data.errors) {
                    if (Array.isArray(data.errors)) {
                        errorMessage = data.errors.join(', ');
                    } else if (typeof data.errors === 'string') {
                        errorMessage = data.errors;
                    } else if (typeof data.errors === 'object') {
                        errorMessage = JSON.stringify(data.errors);
                    }
                }

                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setSnackbar({
                open: true,
                message: 'Error de conexión. Intenta nuevamente.',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const toggleRegister = useCallback(() => {
        setIsRegistering(prev => !prev);

        // Limpiar formulario y errores cuando se cambia de vista
        setFormData({
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            confirmPassword: ''
        });

        setErrors({
            username: '',
            password: '',
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            confirmPassword: ''
        });
    }, []);



    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {isRegistering ? (
                            <RegisterForm
                                formData={formData}
                                errors={errors}
                                showPassword={showPassword}
                                showConfirmPassword={showConfirmPassword}
                                isLoading={isLoading}
                                handleInputChange={handleInputChange}
                                handleClickShowPassword={handleClickShowPassword}
                                handleClickShowConfirmPassword={handleClickShowConfirmPassword}
                                handleRegister={handleRegister}
                                toggleRegister={toggleRegister}
                            />
                        ) : (
                            <LoginForm
                                formData={formData}
                                showPassword={showPassword}
                                isLoading={isLoading}
                                handleInputChange={handleInputChange}
                                handleClickShowPassword={handleClickShowPassword}
                                handleLogin={handleLogin}
                                toggleRegister={toggleRegister}
                            />
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}