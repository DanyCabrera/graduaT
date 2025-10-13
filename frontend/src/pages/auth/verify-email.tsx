import { API_BASE_URL } from "../../constants/index";
import { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Alert, 
    CircularProgress,
    Button,
    Fade
} from '@mui/material';
import { CheckCircle, Error, Email } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false); // Prevenir múltiples verificaciones
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Si ya se verificó exitosamente o está en proceso, no hacer nada más
        if (isVerified || isVerifying) return;
        
        const token = searchParams.get('token') || localStorage.getItem('verificationToken');
        
        if (!token) {
            setStatus('error');
            setMessage('Token de verificación no encontrado');
            setLoading(false);
            return;
        }

        verifyEmail(token);
    }, [searchParams]); // Removido isVerified de las dependencias

    const verifyEmail = async (token: string) => {
        // Si ya se verificó exitosamente o está en proceso, no hacer nada
        if (isVerified || status === 'success' || isVerifying) return;
        
        setIsVerifying(true);
        
        try {
            console.log('🔍 Iniciando verificación con token:', token);
            
            // Intentar primero con el endpoint de userAdmin (para administradores)
            let response = await fetch(`${API_BASE_URL}/useradmin/verify-email/${token}`);
            
            if (response.ok) {
                const adminData = await response.json();
                console.log('✅ Verificación de admin exitosa:', adminData);
                
                setIsVerified(true);
                setStatus('success');
                setMessage('¡Email verificado exitosamente!');
                setLoading(false);
                setIsVerifying(false);
                
                // Limpiar el token del localStorage después de verificación exitosa
                localStorage.removeItem('verificationToken');
                
                // Redirigir al login de administrador después de 3 segundos
                setTimeout(() => {
                    navigate('/admin');
                }, 3000);
                return; // Salir inmediatamente después del éxito
            } else {
                const adminError = await response.json();
                console.log('❌ Error en verificación de admin:', adminError);
            }
            
            // Si no es un administrador, intentar con el endpoint de auth (para otros usuarios)
            response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);
            
            if (response.ok) {
                const userData = await response.json();
                console.log('✅ Verificación de usuario exitosa:', userData);
                
                // Guardar token y datos del usuario
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData.user));
                
                // Limpiar el token del localStorage después de verificación exitosa
                localStorage.removeItem('verificationToken');
                setIsVerifying(false);
                
                // Redirigir inmediatamente al panel correspondiente sin mostrar el panel de verificación
                redirectToPanel(userData.user.Rol);
                return;
            } else {
                const errorData = await response.json();
                console.log('❌ Error en verificación de usuario:', errorData);
                setStatus('error');
                setMessage(errorData.error || errorData.message || 'Error al verificar el email');
                setLoading(false);
                setIsVerifying(false);
            }
        } catch (error) {
            console.error('💥 Error al verificar email:', error);
            setStatus('error');
            setMessage('Error de conexión. Intenta de nuevo.');
            setLoading(false);
            setIsVerifying(false);
        }
    };

    const redirectToPanel = (rol: string) => {
        switch (rol) {
            case 'Alumno':
                navigate('/alumno');
                break;
            case 'Maestro':
                navigate('/maestro');
                break;
            case 'Director':
                navigate('/director');
                break;
            case 'Supervisor':
                navigate('/supervisor');
                break;
            default:
                navigate('/');
        }
    };

    const handleManualRedirect = () => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            redirectToPanel(user.Rol);
        } else {
            // Si no hay datos de usuario, probablemente es un administrador
            // Redirigir al login de administrador
            navigate('/admin');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
            backgroundColor: '#f5f5f5'
        }}>
            <Fade in timeout={800}>
                <Card sx={{
                    maxWidth: 500,
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        {loading && (
                            <>
                                <CircularProgress size={60} sx={{ mb: 3, color: 'primary.main' }} />
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                                    Verificando tu email...
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Por favor espera mientras verificamos tu dirección de correo electrónico.
                                </Typography>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircle sx={{ 
                                    fontSize: 80, 
                                    color: 'success.main', 
                                    mb: 3 
                                }} />
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500, color: 'success.main' }}>
                                    ¡Verificación Exitosa!
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    {message}
                                </Typography>
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Tu cuenta ha sido verificada correctamente
                                </Alert>
                                <Button
                                    variant="contained"
                                    onClick={handleManualRedirect}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Ir a mi Panel
                                </Button>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <Error sx={{ 
                                    fontSize: 80, 
                                    color: 'error.main', 
                                    mb: 3 
                                }} />
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 500, color: 'error.main' }}>
                                    Error de Verificación
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    {message}
                                </Typography>
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    No se pudo verificar tu email.
                                </Alert>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/admin')}
                                        sx={{
                                            py: 1.5,
                                            px: 3,
                                            borderRadius: 2,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Ir al Registro de Admin
                                    </Button>
                                </Box>
                            </>
                        )}

                        {!loading && status === 'success' && (
                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Redirigiendo automáticamente...
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Fade>
        </Box>
    );
}