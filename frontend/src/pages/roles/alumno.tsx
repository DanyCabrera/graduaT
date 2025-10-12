import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
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
}
import IndexAlumno from '../../components/common/Alumno/index';

export default function Alumno() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 Alumno - Iniciando verificación de sesión...');
        
        // Obtener datos del usuario desde localStorage o token
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
                    setUserData(parsedUser);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.error('❌ Alumno - Error al parsear usuario:', error);
            }
        }
        
        if (token) {
            console.log('🔄 Alumno - Obteniendo datos del backend...');
            // Si hay token pero no datos de usuario, obtenerlos del backend
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
            
            const response = await fetch('http://localhost:3001/api/auth/verify-with-role-data', {
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
                <SessionDebugger />
            </Box>
        );
    }

    return <IndexAlumno userData={userData} />;
}