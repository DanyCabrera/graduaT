import { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Avatar,
    Paper,
    Chip,
    Container
} from '@mui/material';
import { School, Person, Email, Phone, Business } from '@mui/icons-material';

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

export default function Director() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

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
            padding: 3 
        }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Header */}
                    <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <School sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    Panel de Director
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    Bienvenido, Dir. {userData.Nombre} {userData.Apellido}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Información del Usuario */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Card sx={{ flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person color="primary" />
                                    Información Personal
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Nombre Completo</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Dir. {userData.Nombre} {userData.Apellido}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Email color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Correo Electrónico</Typography>
                                            <Typography variant="body1">{userData.Correo}</Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                                            <Typography variant="body1">{userData.Teléfono}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Información Académica */}
                        <Card sx={{ flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Business color="primary" />
                                    Información Académica
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Rol</Typography>
                                        <Chip 
                                            label={userData.Rol} 
                                            color="warning" 
                                            variant="outlined"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Institución</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {userData.Nombre_Institución || userData.Código_Institución}
                                        </Typography>
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Usuario</Typography>
                                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                            {userData.Usuario}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Funcionalidades del Director */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Funcionalidades Disponibles
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Aquí se mostrarán las funcionalidades específicas para directores, como:
                                gestionar personal, supervisar actividades académicas, generar reportes, etc.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}