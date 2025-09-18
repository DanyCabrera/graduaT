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
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert
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
    Business,
    LocationOn,
    Phone,
    Refresh
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

interface Institucion {
    _id: string;
    Nombre_Completo: string;
    Correo: string;
    Dirección: string;
    Teléfono: string;
    DEPARTAMENTO: string;
    Código_Institución: string;
    Código_Alumno: string;
    Código_Director: string;
    Código_Maestro: string;
    Código_Supervisor: string;
    fechaCreacion: string;
    emailVerificado: boolean;
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentView, setCurrentView] = useState<'dashboard' | 'codigos' | 'instituciones'>('dashboard');
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [loadingInstituciones, setLoadingInstituciones] = useState(false);
    const [errorInstituciones, setErrorInstituciones] = useState<string | null>(null);

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

    const cargarInstituciones = async () => {
        setLoadingInstituciones(true);
        setErrorInstituciones(null);
        
        try {
            const response = await fetch('http://localhost:5000/api/colegios');
            const result = await response.json();
            
            if (result.success) {
                setInstituciones(result.data);
            } else {
                setErrorInstituciones('Error al cargar las instituciones');
            }
        } catch (error) {
            console.error('Error al cargar instituciones:', error);
            setErrorInstituciones('Error de conexión al cargar las instituciones');
        } finally {
            setLoadingInstituciones(false);
        }
    };

    // Cargar instituciones cuando se cambie a la vista de instituciones
    useEffect(() => {
        if (currentView === 'instituciones') {
            cargarInstituciones();
        }
    }, [currentView]);

    const stats = [
        { title: 'Total Usuarios', value: '1,234', icon: <People />, color: '#1976d2' },
        { title: 'Instituciones Registradas', value: instituciones.length.toString(), icon: <School />, color: '#388e3c' },
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
                        variant={currentView === 'instituciones' ? 'contained' : 'outlined'}
                        onClick={() => setCurrentView('instituciones')}
                        sx={{ mr: 2 }}
                        startIcon={<Business />}
                    >
                        Instituciones ({instituciones.length})
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
                ) : currentView === 'instituciones' ? (
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Instituciones Registradas
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={cargarInstituciones}
                                    disabled={loadingInstituciones}
                                >
                                    Actualizar
                                </Button>
                            </Box>

                            {errorInstituciones && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errorInstituciones}
                                </Alert>
                            )}

                            {loadingInstituciones ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : instituciones.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Business sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        No hay instituciones registradas
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Las instituciones aparecerán aquí una vez que se registren
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Institución</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Código Institución</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Registro</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {instituciones.map((institucion) => (
                                                <TableRow key={institucion._id} hover>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                {institucion.Nombre_Completo}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                <LocationOn sx={{ fontSize: 14, color: '#666', mr: 0.5 }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {institucion.Dirección}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                <Phone sx={{ fontSize: 14, color: '#666', mr: 0.5 }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {institucion.Teléfono}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {institucion.Correo}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={institucion.DEPARTAMENTO} 
                                                            size="small" 
                                                            variant="outlined"
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                fontFamily: 'monospace', 
                                                                fontWeight: 'bold',
                                                                color: '#1976d2'
                                                            }}
                                                        >
                                                            {institucion.Código_Institución}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {new Date(institucion.fechaCreacion).toLocaleDateString('es-GT')}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <CodigoAcceso />
                )}
            </Container>
        </Box>
    );
}
