import { Logout } from "@mui/icons-material";
import { 
    Button,
    AppBar,
    Toolbar,
    Typography,
    Box
} from "@mui/material";

interface NavbarProps {
    onLogout?: () => void;
    onNavigate?: (page: string) => void;
    currentPage?: string;
}
export default function NavbarDirector({ onLogout, onNavigate, currentPage }: NavbarProps) {
    const handleNavigation = (page: string) => {
        if (onNavigate) {
            onNavigate(page);
        }
    };

    return(
        <>
            <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: "bold", marginLeft: 3 }}>
                        Director
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button 
                            color="inherit" 
                            onClick={() => handleNavigation('inicio')}
                            sx={{ 
                                backgroundColor: currentPage === 'inicio' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                fontWeight: currentPage === 'inicio' ? 'bold' : 'normal'
                            }}
                        >
                            Inicio
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => handleNavigation('alumnos')}
                            sx={{ 
                                backgroundColor: currentPage === 'alumnos' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                fontWeight: currentPage === 'alumnos' ? 'bold' : 'normal'
                            }}
                        >
                            Alumnos
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => handleNavigation('cursos')}
                            sx={{ 
                                backgroundColor: currentPage === 'cursos' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                fontWeight: currentPage === 'cursos' ? 'bold' : 'normal'
                            }}
                        >
                            Cursos
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => handleNavigation('tests')}
                            sx={{ 
                                backgroundColor: currentPage === 'tests' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                fontWeight: currentPage === 'tests' ? 'bold' : 'normal'
                            }}
                        >
                            Tests
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => handleNavigation('historial')}
                            sx={{ 
                                backgroundColor: currentPage === 'historial' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                fontWeight: currentPage === 'historial' ? 'bold' : 'normal'
                            }}
                        >
                            Historial
                        </Button>
                        <Button 
                            color="inherit" 
                            onClick={() => handleNavigation('informacion')}
                            sx={{ 
                                backgroundColor: currentPage === 'informacion' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                fontWeight: currentPage === 'informacion' ? 'bold' : 'normal'
                            }}
                        >
                            Información
                        </Button>
                        <Button 
                            color="inherit" 
                            startIcon={<Logout />}
                            onClick={onLogout}
                            sx={{ 
                                color: '#d32f2f',
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
        </>
    )
}  
