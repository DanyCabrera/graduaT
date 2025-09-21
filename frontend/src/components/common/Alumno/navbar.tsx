import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Logout } from "@mui/icons-material";

interface NavbarProps {
    onLogout?: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
    return (
        <>
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginLeft: 3 }}>
                        Estudiante
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button color="inherit">Inicio</Button>
                        <Button color="inherit">PruebaT</Button>
                        <Button color="inherit">Progreso</Button>
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