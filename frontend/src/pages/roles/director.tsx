import { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 

    Container
} from '@mui/material';
import NavbarDirector from '../../components/common/Director/navbar';
import InformacionDirector from '../../components/common/Director/informacion';

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
    const [currentPage, setCurrentPage] = useState('inicio');

    const handleLogout = () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_role');
        
        // Redirigir al inicio
        window.location.href = 'http://localhost:5173';
    };

    const handleNavigation = (page: string) => {
        setCurrentPage(page);
    };

    const renderPageContent = () => {
        switch (currentPage) {
            case 'informacion':
                return <InformacionDirector userData={userData} />;
            case 'alumnos':
                return (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Gestión de Alumnos
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Aquí podrás gestionar la información de los alumnos de tu institución.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            case 'cursos':
                return (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Gestión de Cursos
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Aquí podrás gestionar los cursos y materias de tu institución.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            case 'tests':
                return (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Gestión de Tests
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Aquí podrás gestionar los tests y evaluaciones.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            case 'historial':
                return (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Historial
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Aquí podrás ver el historial de actividades y reportes.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            default: // 'inicio'
                return (
                    <Typography variant='h2'>Bienvenido</Typography>
                );
        }
    };

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

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5', 
        }}>
            <Container
                sx={{
                    minWidth: '100%',
                    minHeight: '100%',
                }}>
                <NavbarDirector 
                    onLogout={handleLogout} 
                    onNavigate={handleNavigation}
                    currentPage={currentPage}
                />
                <Box sx={{ p: 3 }}>
                    {renderPageContent()}
                </Box>
            </Container>
        </Box>
    );
}