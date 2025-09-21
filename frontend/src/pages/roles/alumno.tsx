import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

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
        // Obtener datos del usuario desde localStorage o token
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (user) {
            setUserData(JSON.parse(user));
        } else if (token) {
            // Si hay token pero no datos de usuario, obtenerlos del backend
            fetchUserData();
        }
        
        setLoading(false);
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
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

    return <IndexAlumno userData={userData} />;
}