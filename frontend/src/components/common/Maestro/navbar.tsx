import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { Logout, Home, People, CalendarToday, History, Quiz } from "@mui/icons-material";

interface NavbarProps {
    onLogout?: () => void;
    onNavigate?: (section: string) => void;
    currentSection?: string;
    notificationCount?: number; // Contador de notificaciones
}

export default function Navbar({ onLogout, onNavigate, currentSection = 'inicio', notificationCount = 0 }: NavbarProps) {
    const handleNavigation = (section: string) => {
        if (onNavigate) {
            onNavigate(section);
        }
    };

    const getButtonStyle = (section: string) => ({
        color: currentSection === section ? 'primary.main' : 'inherit',
        fontWeight: currentSection === section ? 'bold' : 'normal',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    });

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "white",
                color: "black",
                boxShadow: "none",
                borderBottom: "1px solid #e0e0e0",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", marginLeft: 3 }}
                >
                    Maestro
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button 
                        color="inherit" 
                        startIcon={<Home />}
                        onClick={() => handleNavigation('inicio')}
                        sx={getButtonStyle('inicio')}
                    >
                        Inicio
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={<People />}
                        onClick={() => handleNavigation('alumnos')}
                        sx={getButtonStyle('alumnos')}
                    >
                        Alumnos
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={<CalendarToday />}
                        onClick={() => handleNavigation('agenda')}
                        sx={getButtonStyle('agenda')}
                    >
                        Agenda
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={
                            <Badge 
                                badgeContent={notificationCount} 
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontSize: '0.7rem',
                                        minWidth: '18px',
                                        height: '18px'
                                    }
                                }}
                            >
                                <History />
                            </Badge>
                        }
                        onClick={() => handleNavigation('historial')}
                        sx={getButtonStyle('historial')}
                    >
                        Historial
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={<Quiz />}
                        onClick={() => handleNavigation('tests')}
                        sx={getButtonStyle('tests')}
                    >
                        Tests
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={<Logout />}
                        onClick={onLogout}
                        sx={{ 
                            color: '#d32f2f',
                            marginLeft: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.04)'
                            }
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
