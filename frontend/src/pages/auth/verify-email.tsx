import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    Paper,
    Fade
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Email,
    ArrowBack
} from '@mui/icons-material';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            verifyEmail(token);
        } else {
            setError('Token de verificación no encontrado');
            setLoading(false);
        }
    }, [searchParams]);

    const verifyEmail = async (verificationToken: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/useradmin/verify-email/${verificationToken}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    navigate('/admin');
                }, 3000);
            } else {
                setError(data.message || 'Error al verificar el email');
            }
        } catch (error) {
            console.error('Error al verificar email:', error);
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoToLogin = () => {
        navigate('/admin');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={800}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            textAlign: 'center',
                            backgroundColor: 'white',
                        }}
                    >
                        {loading ? (
                            <Box>
                                <CircularProgress size={60} sx={{ mb: 3, color: '#1976d2' }} />
                                <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                                    Verificando tu email...
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    Por favor espera mientras confirmamos tu registro.
                                </Typography>
                            </Box>
                        ) : success ? (
                            <Box>
                                <CheckCircle 
                                    sx={{ 
                                        fontSize: 80, 
                                        color: '#4caf50', 
                                        mb: 3 
                                    }} 
                                />
                                <Typography variant="h4" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                                    ¡Email Verificado!
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 3, color: '#4caf50' }}>
                                    Tu cuenta ha sido activada exitosamente
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 4, color: '#666', lineHeight: 1.6 }}>
                                    ¡Registro validado exitosamente! Ya puedes iniciar sesión en la plataforma.
                                    Serás redirigido automáticamente al login en unos segundos.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleGoToLogin}
                                    startIcon={<Email />}
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#1565c0',
                                        },
                                    }}
                                >
                                    Ir al Login
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Error 
                                    sx={{ 
                                        fontSize: 80, 
                                        color: '#f44336', 
                                        mb: 3 
                                    }} 
                                />
                                <Typography variant="h4" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                                    Error de Verificación
                                </Typography>
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 3,
                                        textAlign: 'left',
                                        backgroundColor: '#ffebee',
                                        border: '1px solid #ffcdd2',
                                    }}
                                >
                                    {error}
                                </Alert>
                                <Typography variant="body1" sx={{ mb: 4, color: '#666', lineHeight: 1.6 }}>
                                    El enlace de verificación puede haber expirado o ser inválido.
                                    Contacta al administrador si el problema persiste.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleGoHome}
                                        startIcon={<ArrowBack />}
                                        sx={{
                                            borderColor: '#e0e0e0',
                                            color: '#666',
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#bdbdbd',
                                                backgroundColor: '#f5f5f5',
                                            },
                                        }}
                                    >
                                        Ir al Inicio
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleGoToLogin}
                                        startIcon={<Email />}
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                            },
                                        }}
                                    >
                                        Intentar Login
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
}
