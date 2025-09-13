import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Paper,
    Chip
} from '@mui/material';
import {
    Dashboard,
    School,
    People,
    Assessment,
    Settings,
    Logout,
    AdminPanelSettings,
    Person,
    Email,
} from '@mui/icons-material';
import CodigoAcceso from '../../components/common/admin/codigo';

interface AdminUser {
    _id: string;
    Nombre: string;
    Apellido: string;
    Usuario: string;
    Correo: string;
    Telefono: string;
    emailVerificado: boolean;
    fechaCreacion: string;
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentView, setCurrentView] = useState<'dashboard' | 'codigos'>('dashboard');

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');
        
        if (!token || !userData) {
            navigate('/admin');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } catch (error) {
            console.error('Error al parsear datos del usuario:', error);
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Limpiar datos del localStorage
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // Redirigir al login
        navigate('/admin');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const stats = [
        { title: 'Total Usuarios', value: '1,234', icon: <People />, color: '#1976d2' },
        { title: 'Instituciones', value: '45', icon: <School />, color: '#388e3c' },
        { title: 'Reportes', value: '12', icon: <Assessment />, color: '#f57c00' },
        { title: 'Activos Hoy', value: '89', icon: <Dashboard />, color: '#7b1fa2' }
    ];

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>Cargando...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <AdminPanelSettings sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Panel de Administración - GraduaT
                    </Typography>
                    
                    <IconButton
                        size="large"
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <Person />
                        </Avatar>
                    </IconButton>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem disabled>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {user.Nombre} {user.Apellido}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user.Usuario}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleMenuClose}>
                            <Person sx={{ mr: 1 }} />
                            Perfil
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Settings sx={{ mr: 1 }} />
                            Configuración
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} />
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                {/* Información del Usuario */}
                <Paper sx={{ p: 3, mb: 4, backgroundColor: '#fff' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 56, height: 56 }}>
                            <AdminPanelSettings />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Bienvenido, {user.Nombre} {user.Apellido}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Email sx={{ fontSize: 16, color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {user.Correo}
                                </Typography>
                                <Chip 
                                    label={user.emailVerificado ? "Verificado" : "No verificado"} 
                                    size="small" 
                                    color={user.emailVerificado ? "success" : "warning"}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Navegación */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant={currentView === 'dashboard' ? 'contained' : 'outlined'}
                        onClick={() => setCurrentView('dashboard')}
                        sx={{ mr: 2 }}
                        startIcon={<Dashboard />}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant={currentView === 'codigos' ? 'contained' : 'outlined'}
                        onClick={() => setCurrentView('codigos')}
                        startIcon={<AdminPanelSettings />}
                    >
                        Generar Códigos
                    </Button>
                </Box>

                {/* Contenido */}
                {currentView === 'dashboard' ? (
                    <>
                        {/* Estadísticas */}
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { 
                                xs: '1fr', 
                                sm: 'repeat(2, 1fr)', 
                                md: 'repeat(4, 1fr)' 
                            }, 
                            gap: 3, 
                            mb: 4 
                        }}>
                            {stats.map((stat, index) => (
                                <Card key={index} sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                                                {stat.icon}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {stat.value}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {stat.title}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        {/* Información adicional */}
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { 
                                xs: '1fr', 
                                md: 'repeat(2, 1fr)' 
                            }, 
                            gap: 3 
                        }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Actividad Reciente
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay actividad reciente para mostrar.
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Sistema
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Sistema funcionando correctamente.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                ) : (
                    <CodigoAcceso />
                )}
            </Container>
        </Box>
    );
}
