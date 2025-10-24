import { 
    Logout, 
    Dashboard, 
    School, 
    Person, 
    Book, 
    Assessment, 
    Info 
} from "@mui/icons-material";
import { 
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";

interface NavbarProps {
    onLogout?: () => void;
    onNavigate?: (page: string) => void;
    currentPage?: string;
}

const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: <Dashboard /> },
    { id: 'alumnos', label: 'Alumnos', icon: <School /> },
    { id: 'maestros', label: 'Maestros', icon: <Person /> },
    { id: 'cursos', label: 'Cursos', icon: <Book /> },
    { id: 'rendimiento', label: 'Rendimiento', icon: <Assessment /> },
    { id: 'informacion', label: 'Información', icon: <Info /> }
];

export default function NavbarDirector({ onLogout, onNavigate, currentPage }: NavbarProps) {
    const handleNavigation = (page: string) => {
        // Redirigir a la ruta correspondiente
        switch (page) {
            case 'inicio':
                window.location.href = '/director';
                break;
            case 'alumnos':
                window.location.href = '/director/alumnos';
                break;
            case 'maestros':
                window.location.href = '/director/maestros';
                break;
            case 'cursos':
                window.location.href = '/director/cursos';
                break;
            case 'rendimiento':
                window.location.href = '/director/rendimiento';
                break;
            case 'informacion':
                window.location.href = '/director/informacion';
                break;
        }
    };

    return(
        <Box
            sx={{
                width: 280,
                height: '100vh',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1000,
                boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: "bold", color: '#1976d2' }}>
                    Director
                </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List sx={{ px: 2, py: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.id)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: currentPage === item.id ? '#e3f2fd' : 'transparent',
                                    color: currentPage === item.id ? '#1976d2' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: currentPage === item.id ? '#e3f2fd' : '#f5f5f5'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    color: currentPage === item.id ? '#1976d2' : 'inherit',
                                    minWidth: 40
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: currentPage === item.id ? 'bold' : 'normal'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Logout Button */}
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Logout />}
                    onClick={onLogout}
                    sx={{
                        color: '#d32f2f',
                        borderColor: '#d32f2f',
                        '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)',
                            borderColor: '#d32f2f'
                        }
                    }}
                >
                    Cerrar Sesión
                </Button>
            </Box>
        </Box>
    )
}  
