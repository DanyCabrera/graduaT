import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { 
    Logout, 
    Home, 
    TrendingUp, 
    Menu as MenuIcon
} from "@mui/icons-material";
import {
    House,
    ChartNoAxesCombined,
    LogOut
} from 'lucide-react';

interface NavbarProps {
    onLogout?: () => void;
    onNavigate?: (section: string) => void;
    currentSection?: string;
}

export default function Navbar({ onLogout, onNavigate, currentSection = 'inicio' }: NavbarProps) {
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
    const isMobileMenuOpen = Boolean(mobileMenuAnchor);

    const handleNavigation = (section: string) => {
        if (onNavigate) {
            onNavigate(section);
        }
        // Cerrar menú móvil después de navegar
        setMobileMenuAnchor(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const getButtonStyle = (section: string) => ({
        color: currentSection === section ? 'primary.main' : 'inherit',
        fontWeight: currentSection === section ? 'bold' : 'normal',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    });

    const getMenuItemStyle = (section: string) => ({
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
            <Toolbar sx={{ 
                display: "flex", 
                justifyContent: "space-between",
                px: { xs: 1, sm: 2, md: 3 }
            }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ 
                        fontWeight: "bold",
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        width: '20%'
                    }}
                >
                    Estudiante
                </Typography>

                {/* Navegación para desktop */}
                <Box sx={{ 
                    display: { xs: "none", md: "flex" }, 
                    gap: 1,
                    alignItems: "center",
                    width: '90%'
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            width: '80%'
                        }}
                    >
                        <Button 
                            color="inherit" 
                            startIcon={<House />}
                            onClick={() => handleNavigation('inicio')}
                            sx={getButtonStyle('inicio')}
                        >
                            Inicio
                        </Button>
                        <Button 
                            color="inherit" 
                            startIcon={<ChartNoAxesCombined />}
                            onClick={() => handleNavigation('progreso')}
                            sx={getButtonStyle('progreso')}
                        >
                            Progreso
                        </Button>
                    </Box>
                    <Button 
                        color="inherit" 
                        startIcon={<LogOut />}
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

                {/* Navegación para tablet */}
                <Box sx={{ 
                    display: { xs: "none", sm: "flex", md: "none" }, 
                    gap: 0.5,
                    alignItems: "center"
                }}>
                    <Button 
                        color="inherit" 
                        startIcon={<House />}
                        onClick={() => handleNavigation('inicio')}
                        sx={{ ...getButtonStyle('inicio'), minWidth: 'auto', px: 1 }}
                    >
                        Inicio
                    </Button>
                    <Button 
                        color="inherit" 
                        startIcon={<ChartNoAxesCombined />}
                        onClick={() => handleNavigation('progreso')}
                        sx={{ ...getButtonStyle('progreso'), minWidth: 'auto', px: 1 }}
                    >
                        Progreso
                    </Button>
                    <IconButton 
                        color="inherit" 
                        onClick={onLogout}
                        sx={{ 
                            color: '#d32f2f',
                            marginLeft: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.04)'
                            }
                        }}
                    >
                        <LogOut />
                    </IconButton>
                </Box>

                {/* Menú hamburguesa para móvil */}
                <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                    <IconButton
                        color="inherit"
                        onClick={handleMobileMenuOpen}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>

            {/* Menú móvil */}
            <Menu
                anchorEl={mobileMenuAnchor}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
                PaperProps={{
                    sx: {
                        width: '100vw',
                        maxWidth: '100vw',
                        marginTop: 1,
                        borderRadius: 0,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem 
                    onClick={() => handleNavigation('inicio')}
                    sx={getMenuItemStyle('inicio')}
                >
                    <Home sx={{ mr: 2 }} />
                    Inicio
                </MenuItem>
                <MenuItem 
                    onClick={() => handleNavigation('progreso')}
                    sx={getMenuItemStyle('progreso')}
                >
                    <TrendingUp sx={{ mr: 2 }} />
                    Progreso
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        handleMobileMenuClose();
                        if (onLogout) onLogout();
                    }}
                    sx={{ 
                        color: '#d32f2f',
                        '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                        }
                    }}
                >
                    <Logout sx={{ mr: 2 }} />
                    Cerrar Sesión
                </MenuItem>
            </Menu>
        </AppBar>
    );
}