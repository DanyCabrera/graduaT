import { AppBar, Typography, Toolbar } from "@mui/material";

export default function Navbar() {
    return (
            <AppBar position="static" sx={{
                position: 'relative',
                top: '0',
                left: '0',
                zIndex: 1000,
                minWidth: '100%',
                minHeight: '3.5rem',
                bgcolor: 'rgba(0, 0, 0, 0.89)',
            }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'center', // Centra horizontalmente
                    alignItems: 'center', // Centra verticalmente
                    minHeight: '3.5rem',
                }}>
                    <Typography variant="h5" 
                        sx={{ 
                            textAlign: 'center', 
                            fontWeight: 'bold',
                        }}>
                        🎓GraduaT
                    </Typography>
                </Toolbar>
            </AppBar>
    );
}