import { Card, CardContent, Typography, Button, Fade, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { clearAccessTokens } from '../../utils/authUtils';
// import Navbar from './navbar';
import logo from "../../assets/LogoColor1.png";
import IconRol from "../../assets/logo.png";
import { AppBar, Toolbar } from "@mui/material";

export default function PanelRol() {
    // Configuración de roles con estilo infográfico
    const rolesConfig = [
        {
            nombre: 'Supervisor',
            descripcion: 'Supervisa todas las instituciones.',
            imagen: IconRol
        },
        {
            nombre: 'Director',
            descripcion: 'Supervisa a sus maestro y alumnos.',
            imagen: IconRol
        },
        {
            nombre: 'Maestro',
            descripcion: 'Asigna test a los alumnos y crea su agenda de la semana.',
            imagen: IconRol
        },
        {
            nombre: 'Alumno',
            descripcion: 'Realiza test semanales.',
            imagen: IconRol
        }
    ];

    // Función para manejar el clic en una tarjeta
    const navigate = useNavigate();
    const handleCardClick = (rol: string) => {
        localStorage.setItem('selectedRol', rol);
        navigate("/registrol");
    };

    const handleLogout = () => {
        // Limpiar tokens de acceso
        clearAccessTokens();

        // Redirigir al login
        navigate('/');
    }
    return (
        <>
            {/* <Navbar /> */}
            <Fade in timeout={800}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        py: 4,
                        position: 'relative',
                        bgcolor: '#f8f9fa'
                    }}>
                        
                    {/* Barra de navegación */}
                    <AppBar
                        position="fixed"
                        sx={{
                            backgroundColor: "white",
                            color: "black",
                            boxShadow: "none",
                            borderBottom: "1px solid #e0e0e0",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1100,
                        }}
                    >
                        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                            {/* Logo a la izquierda */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <img src={logo} alt="Logo" style={{ height: "28px", width: "auto" }} />
                            </Box>

                            {/* Botón de regresar a la derecha */}
                            <Button
                                color="info"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "medium",
                                    fontSize: "0.9rem",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <Box className="container-card"
                        sx={{
                            minHeight: { md: '70vh', xs: '60vh' },
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center', // Centra horizontalmente
                            alignItems: 'center', // Centra verticalmente
                            backgroundColor: 'rgba(13, 62, 237, 0)',
                            mt: {xs: 4, sm: 4}
                            // '& > *': { para estilizar cada tarjeta
                            //     border: '3px solid red',
                            // }
                        }}
                    >
                        {rolesConfig.map((rol, index) => (
                            <Card
                                key={index}
                                sx={{
                                    width: 300,
                                    height: 420,
                                    margin: '.8rem',
                                    borderRadius: '20px',
                                    border: 1,
                                    borderColor: '#e9edc9',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    background: 'white',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '6px',
                                        borderRadius: '20px 20px 0 0'
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    },
                                }}
                                onClick={() => handleCardClick(rol.nombre)}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        height: '100%',
                                        p: 3,
                                        pt: 5
                                    }}
                                >
                                    {/* Imagen */}
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={rol.imagen}
                                            alt={rol.nombre}
                                            style={{
                                                width: "180px",
                                                height: "180px",
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>


                                    {/* Título */}
                                    <Typography
                                        variant='button'
                                        sx={{
                                            fontSize: '1.3rem',
                                            fontWeight: 'bold',
                                            color: '#2c3e50',
                                            mb: 2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {rol.nombre}
                                    </Typography>
                                    
                                    {/* Descripción */}
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            textAlign: 'center',
                                            color: '#7f8c8d',
                                            mb: 3,
                                            lineHeight: 1.6,
                                            fontSize: '0.95rem',
                                            px: 1
                                        }}
                                    >
                                        {rol.descripcion}
                                    </Typography>

                                    {/* Botón */}
                                    <Button
                                        variant='outlined'
                                        color='success'
                                        fullWidth
                                        sx={{
                                            mt: 'auto',
                                            py: 1,
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            '&:hover': {
                                                filter: 'brightness(1.1)'
                                            }
                                        }}
                                    >
                                        Entrar
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Fade>
            <style>
                {`
                @media (max-width: 768px) {
                    .container-card {
                        flex-direction: column;
                    }
                }
                `}
            </style>
        </>
    )
}