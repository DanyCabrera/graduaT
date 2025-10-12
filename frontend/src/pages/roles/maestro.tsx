import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import IndexMaestro from '../../components/common/Maestro/index';
import { getSessionToken, getSessionUser, getSessionRole } from '../../utils/authUtils';
import { SessionDebugger } from '../../components/common/SessionDebugger';

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución: string;
    Nombre_Institución?: string;
    CURSO?: string[];
}

export default function Maestro() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 Maestro - Iniciando verificación de sesión...');
        
        // Primero intentar obtener datos de la sesión actual
        const sessionUser = getSessionUser();
        const sessionRole = getSessionRole();
        
        console.log('🔍 Maestro - Datos de sesión:', { sessionUser, sessionRole });
        
        if (sessionUser && sessionRole === 'Maestro') {
            console.log('✅ Maestro - Usando datos de sesión');
            setUserData(sessionUser);
            setLoading(false);
        } else {
            // Si no hay sesión válida, intentar obtener del localStorage
            const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
            const user = localStorage.getItem('user') || localStorage.getItem('user_data');
            
            console.log('🔍 Maestro - Datos de localStorage:', { 
                hasToken: !!token, 
                hasUser: !!user,
                token: token?.substring(0, 20) + '...',
                user: user ? JSON.parse(user) : null
            });
            
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    if (parsedUser.Rol === 'Maestro') {
                        console.log('✅ Maestro - Usando datos de localStorage');
                        setUserData(parsedUser);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('❌ Maestro - Error al parsear usuario:', error);
                }
            }
            
            if (token) {
                console.log('🔄 Maestro - Obteniendo datos del backend...');
                fetchUserData();
            } else {
                console.log('❌ Maestro - No hay token disponible');
                setLoading(false);
            }
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const token = getSessionToken() || localStorage.getItem('token');
            
            if (!token) {
                console.error('No hay token disponible');
                setLoading(false);
                return;
            }
            
            const response = await fetch('http://localhost:3001/api/auth/verify-with-role-data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
                        
            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
            } else {
                const errorData = await response.json();
                console.error('🔍 Maestro - Error en respuesta:', errorData);
            }
        } catch (error) {
            console.error('🔍 Maestro - Error al obtener datos del usuario:', error);
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
                <SessionDebugger />
            </Box>
        );
    }

    return <IndexMaestro userData={userData} />;
}