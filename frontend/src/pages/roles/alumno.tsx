import { API_BASE_URL } from "../../constants/index";
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getAlumnoSession } from '../../utils/sessionManager';
import { getSessionUser, getSessionRole } from '../../utils/authUtils';

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución: string;
    Nombre_Institución?: string;
}
import IndexAlumno from '../../components/common/Alumno/index';

export default function Alumno() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 Alumno - Iniciando verificación de sesión...');
        
        // Verificar datos básicos de localStorage primero
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const user = localStorage.getItem('user') || localStorage.getItem('user_data');
        
        console.log('🔍 Alumno - Datos de localStorage:', { 
            hasToken: !!token, 
            hasUser: !!user,
            token: token?.substring(0, 20) + '...',
            user: user ? JSON.parse(user) : null
        });
        
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser.Rol === 'Alumno') {
                    console.log('✅ Alumno - Usando datos de localStorage');
                    
                    // Inicializar el session manager específico para Alumno
                    const alumnoSession = getAlumnoSession();
                    alumnoSession.setSession(token || '', parsedUser, 'Alumno');
                    
                    setUserData(parsedUser);
                    setLoading(false);
                    return;
                } else {
                    console.warn('⚠️ Alumno - Usuario no es alumno:', parsedUser.Rol);
                    console.warn('⚠️ Alumno - Redirigiendo al panel correcto...');
                    
                    // Redirigir al panel correcto según el rol
                    if (parsedUser.Rol === 'Maestro') {
                        window.location.href = '/maestro';
                        return;
                    } else if (parsedUser.Rol === 'Director') {
                        window.location.href = '/director';
                        return;
                    } else if (parsedUser.Rol === 'Supervisor') {
                        window.location.href = '/supervisor';
                        return;
                    }
                    
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.error('❌ Alumno - Error al parsear usuario:', error);
            }
        }
        
        // Si no hay datos en localStorage, intentar obtener de la sesión aislada
        const sessionUser = getSessionUser();
        const sessionRole = getSessionRole();
        
        console.log('🔍 Alumno - Datos de sesión aislada:', { sessionUser, sessionRole });
        
        if (sessionUser && sessionRole === 'Alumno') {
            console.log('✅ Alumno - Usando datos de sesión aislada');
            setUserData(sessionUser);
            setLoading(false);
        } else if (token) {
            console.log('🔄 Alumno - Obteniendo datos del backend...');
            fetchUserData();
        } else {
            console.log('❌ Alumno - No hay token disponible');
            setLoading(false);
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            console.log('🔄 Alumno - Token para fetch:', token?.substring(0, 20) + '...');
            
            const response = await fetch(`${API_BASE_URL}/auth/verify-with-role-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Alumno - Datos obtenidos del backend:', data.user);
                setUserData(data.user);
            } else {
                const errorData = await response.json();
                console.error('❌ Alumno - Error en respuesta:', errorData);
            }
        } catch (error) {
            console.error('❌ Alumno - Error al obtener datos del usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>Cargando...</Typography>
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', p: 2 }}>
                <Typography color="error" variant="h5" gutterBottom>
                    No se encontraron datos del usuario
                </Typography>
            </Box>
        );
    }

    return <IndexAlumno userData={userData} />;
}