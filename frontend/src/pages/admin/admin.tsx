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
    Settings,
    Logout,
    AdminPanelSettings,
    Person,
    Email,
    Business,
    Refresh,
    CheckCircle,
    Cancel,
    ToggleOn,
    ToggleOff
} from '@mui/icons-material';
import CodigoAcceso from '../../components/common/admin/codigo';
import TablaCodigos from '../../components/common/admin/tablaCodigos';
import DashboardPrincipal from '../../components/common/admin/DashboardPrincipal';

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
    habilitado: boolean;
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentView, setCurrentView] = useState<'dashboard' | 'codigos' | 'instituciones' | 'todos-codigos'>('dashboard');
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [loadingInstituciones, setLoadingInstituciones] = useState(false);
    const [errorInstituciones, setErrorInstituciones] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
            const response = await fetch('http://localhost:3001/api/colegios');
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

    const toggleHabilitado = async (institucionId: string, habilitado: boolean) => {
        try {
            const response = await fetch(`http://localhost:3001/api/colegios/${institucionId}/habilitado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ habilitado }),
            });

            const result = await response.json();
            
            if (result.success) {
                // Actualizar la lista de instituciones
                setInstituciones(prev => 
                    prev.map(inst => 
                        inst._id === institucionId 
                            ? { ...inst, habilitado: habilitado }
                            : inst
                    )
                );
                
                // Mostrar mensaje de éxito
                setSuccessMessage(result.message || `Institución ${habilitado ? 'habilitada' : 'deshabilitada'} exitosamente`);
                setErrorInstituciones(null);
                
                // Limpiar mensaje después de 5 segundos
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            } else {
                setErrorInstituciones(result.error || 'Error al cambiar el estado de la institución');
                setSuccessMessage(null);
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            setErrorInstituciones('Error de conexión al cambiar el estado');
        }
    };


    // Cargar instituciones cuando se cambie a vistas que las necesiten
    useEffect(() => {
        if (currentView === 'instituciones' || 
            currentView === 'todos-codigos' || 
            currentView === 'dashboard') {
            cargarInstituciones();
        }
    }, [currentView]);


    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>Cargando...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: '#212529' }}>
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
                <Paper 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        backgroundColor: '#006d77',
                        borderRadius: 3
                    }}
                    >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#83c5be', mr: 2, width: 56, height: 56 }}>
                            <AdminPanelSettings />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                Bienvenido, {user.Nombre} {user.Apellido}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Email sx={{ fontSize: 16, color: '#fff' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ color: '#fff' }}>
                                    {user.Correo}
                                </Typography>
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
                        Gestionar Instituciones ({instituciones.length})
                    </Button>
                    <Button
                        variant={currentView === 'todos-codigos' ? 'contained' : 'outlined'}
                        onClick={() => setCurrentView('todos-codigos')}
                        sx={{ mr: 2 }}
                        startIcon={<School />}
                    >
                        Todos los Códigos
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
                    <DashboardPrincipal 
                        instituciones={instituciones}
                    />
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

                            {successMessage && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {successMessage}
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
                                                <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Código Institución</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Fecha Registro</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {instituciones.map((institucion) => (
                                                <TableRow key={institucion._id} hover>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                            {institucion.Nombre_Completo}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {institucion.Correo}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {institucion.Teléfono}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {institucion.Dirección}
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
                                                        <Chip 
                                                            icon={institucion.habilitado ? <CheckCircle /> : <Cancel />}
                                                            label={institucion.habilitado ? "Habilitada" : "Deshabilitada"}
                                                            color={institucion.habilitado ? "success" : "error"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {new Date(institucion.fechaCreacion).toLocaleDateString('es-GT')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {institucion.habilitado ? (
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="small"
                                                                    startIcon={<ToggleOff />}
                                                                    onClick={() => toggleHabilitado(institucion._id, false)}
                                                                >
                                                                    Deshabilitar
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="outlined"
                                                                    color="success"
                                                                    size="small"
                                                                    startIcon={<ToggleOn />}
                                                                    onClick={() => toggleHabilitado(institucion._id, true)}
                                                                >
                                                                    Habilitar
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                ) : currentView === 'todos-codigos' ? (
                    <TablaCodigos 
                        instituciones={instituciones}
                        loading={loadingInstituciones}
                        error={errorInstituciones}
                        onRefresh={cargarInstituciones}
                    />
                ) : (
                    <CodigoAcceso />
                )}
            </Container>
        </Box>
    );
}
