import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import IndexMaestro from '../../components/common/Maestro/index';
import { getSessionToken, getSessionUser, getSessionRole } from '../../utils/authUtils';

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
        // Primero intentar obtener datos de la sesión actual
        const sessionUser = getSessionUser();
        const sessionRole = getSessionRole();
        
        if (sessionUser && sessionRole === 'Maestro') {
            setUserData(sessionUser);
            setLoading(false);
        } else {
            // Si no hay sesión válida, intentar obtener del localStorage
            const token = localStorage.getItem('token');
            if (token) {
                fetchUserData();
            } else {
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography color="error">No se encontraron datos del usuario</Typography>
            </Box>
        );
    }

    return <IndexMaestro userData={userData} />;
}