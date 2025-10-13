import { API_BASE_URL } from "../../constants";
import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Toolbar
} from '@mui/material';
import SidebarSupervisor from '../../components/common/Supervisor/SidebarSupervisor';
import DashboardSupervisor from '../../components/common/Supervisor/DashboardSupervisor';

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución: string;
    Nombre_Institución?: string;
    DEPARTAMENTO?: string;
}

const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');

    // Redirigir al inicio
    window.location.href = '/';
};

export default function Supervisor() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState<'dashboard'>('dashboard');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (user) {
            setUserData(JSON.parse(user));
        } else if (token) {
            fetchUserData();
        }

        setLoading(false);
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
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

    const handleViewChange = (view: 'dashboard') => {
        setCurrentView(view);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SidebarSupervisor 
                currentView={currentView}
                onViewChange={handleViewChange}
                userData={userData}
                onLogout={handleLogout}
            />
            
            {/* Contenido Principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
                <Toolbar />
                
                {/* Dashboard Principal */}
                <DashboardSupervisor userData={userData} />
            </Box>
        </Box>
    );
}