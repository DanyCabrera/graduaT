import { API_BASE_URL } from "../../constants/index";
import { useEffect, useState } from 'react';
import { 
    Box, 
    Typography
} from '@mui/material';
import NavbarDirector from '../../components/common/Director/navbar';
import Dashboard from '../../components/common/Director/dashboard';
import { getSessionToken, getSessionUser, getSessionRole } from '../../utils/authUtils';
import { sessionManager } from '../../utils/sessionManager';

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución: string;
    Nombre_Institución: string;
}

export default function Director() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const handleLogout = () => {
        // Limpiar sesión actual
        sessionManager.clearSessionManually();
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_role');
        
        // Redirigir al inicio
        window.location.href = '/';
    };

    useEffect(() => {
        // Primero intentar obtener datos de la sesión actual
        const sessionUser = getSessionUser();
        const sessionRole = getSessionRole();
        
        if (sessionUser && sessionRole === 'Director') {
            setUserData(sessionUser);
            setLoading(false);
        } else {
            // Si no hay sesión válida, intentar obtener del localStorage
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (user) {
                setUserData(JSON.parse(user));
                setLoading(false);
            } else if (token) {
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
            
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
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

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5',
            display: 'flex'
        }}>
            <NavbarDirector 
                onLogout={handleLogout} 
                currentPage="inicio"
            />
            <Box sx={{ 
                flex: 1,
                marginLeft: '280px', // Ancho de la barra lateral
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <Box sx={{ p: 3 }}>
                    <Dashboard userData={userData} />
                </Box>
            </Box>
        </Box>
    );
}