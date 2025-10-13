import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { hasValidAccessToken, clearAccessTokens, getSessionToken, getSessionUser, getSessionRole } from '../../utils/authUtils';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredAccess?: string; // 'ROL' para panel de roles, 'INSTITUCION' para registro
}

export default function ProtectedRoute({ children, requiredAccess = 'ROL' }: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = () => {
        try {
            console.log('🔍 ProtectedRoute - Verificando acceso para:', requiredAccess);
            
            // Verificar datos de localStorage directamente
            const authToken = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');
            const userRole = localStorage.getItem('user_role');
            
            console.log('🔍 ProtectedRoute - Datos de localStorage:', {
                hasAuthToken: !!authToken,
                hasUserData: !!userData,
                hasUserRole: !!userRole,
                authToken: authToken?.substring(0, 20) + '...',
                userData: userData ? JSON.parse(userData) : null
            });
            
            // Para el panel de roles, verificar si tenemos datos básicos de autenticación
            if (requiredAccess === 'ROL') {
                // Si tenemos datos básicos de autenticación, permitir acceso
                if (authToken && userData && userRole) {
                    console.log('✅ ProtectedRoute - Acceso autorizado por datos de autenticación básicos');
                    setIsAuthorized(true);
                    setLoading(false);
                    return;
                }
                
                // Si no hay datos básicos, verificar token de acceso
                const isValid = hasValidAccessToken(requiredAccess);
                console.log('✅ ProtectedRoute - Token de acceso válido:', isValid);
                
                if (isValid) {
                    const token = getSessionToken();
                    const user = getSessionUser();
                    const role = getSessionRole();
                    
                    console.log('🔍 ProtectedRoute - Datos de sesión:', { token: !!token, user: !!user, role });
                    
                    if (!token || !user || !role) {
                        console.warn('❌ ProtectedRoute - Sesión incompleta, redirigiendo al login');
                        setIsAuthorized(false);
                        setLoading(false);
                        return;
                    }
                }
                
                setIsAuthorized(isValid);
            } else {
                // Para otros tipos de acceso, usar la lógica normal
                const isValid = hasValidAccessToken(requiredAccess);
                console.log('✅ ProtectedRoute - Token de acceso válido:', isValid);
                setIsAuthorized(isValid);
            }
        } catch (error) {
            console.error('❌ ProtectedRoute - Error checking access:', error);
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    };

    // No limpiar tokens automáticamente para permitir recarga de página
    // Los tokens se limpiarán solo cuando el usuario haga logout explícitamente

    const handleGoToAccess = () => {
        navigate('/codigo-acceso');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Verificando acceso...
                </Typography>
            </Box>
        );
    }

    if (!isAuthorized) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    p: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        backgroundColor: '#fef2f2',
                        mb: 2,
                    }}
                >
                    <SecurityIcon sx={{ fontSize: 50, color: '#ef4444' }} />
                </Box>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        textAlign: 'center',
                    }}
                >
                    Acceso Restringido
                </Typography>

                <Alert 
                    severity="warning" 
                    sx={{ 
                        maxWidth: 500,
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {requiredAccess === 'ROL' 
                            ? 'Necesitas un código de acceso válido para acceder al panel de roles.'
                            : 'Necesitas un código de acceso válido para acceder a esta sección.'
                        }
                    </Typography>
                </Alert>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: 'center', maxWidth: 400 }}
                >
                    {requiredAccess === 'ROL' 
                        ? 'El director debe proporcionarte un código de acceso para seleccionar tu rol en el sistema.'
                        : 'Contacta al administrador para obtener un código de acceso válido.'
                    }
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleGoToAccess}
                    sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: '#374151',
                        '&:hover': {
                            backgroundColor: '#1f2937',
                        },
                    }}
                >
                    Ingresar Código de Acceso
                </Button>
            </Box>
        );
    }

    return <>{children}</>;
}
