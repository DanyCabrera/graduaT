import { Card, CardContent, Typography, Button, Fade, Box, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { clearAccessTokens } from '../../utils/authUtils';
// import Navbar from './navbar';

export default function PanelRol() {
    // Configuración de roles con estilo infográfico
    const rolesConfig = [
        {
            numero: '01',
            nombre: 'Supervisor',
            descripcion: 'Supervisa y gestiona todas las operaciones del sistema educativo con control total.',
            color: '#d90429',
            imagen: "https://cdn-icons-png.freepik.com/512/10992/10992894.png"
        },
        {
            numero: '02', 
            nombre: 'Director',
            descripcion: 'Administra la institución educativa y toma decisiones estratégicas importantes.',
            color: '#00b894',
            imagen: "https://cdn-icons-png.freepik.com/512/10992/10992894.png"
        },
        {
            numero: '03',
            nombre: 'Maestro', 
            descripcion: 'Evalúa estudiantes y gestiona el proceso de enseñanza-aprendizaje.',
            color: '#1b4965',
            imagen: "https://cdn-icons-png.freepik.com/512/10992/10992894.png"
        },
        {
            numero: '04',
            nombre: 'Alumno',
            descripcion: 'Accede a contenidos educativos, consulta calificaciones y participa en actividades.',
            color: '#3a86ff',
            imagen: "https://cdn-icons-png.freepik.com/512/10992/10992894.png"
        }
    ];

    // Función para manejar el clic en una tarjeta
    const navigate = useNavigate();
        const handleCardClick = (rol: string) => {
        localStorage.setItem('selectedRol', rol);
        navigate("/registrol");
    };

    const handleBackToPanel = () => {
        navigate('/');
    }

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
                        position: 'relative'
                    }}>
                    
                    {/* Botón de salir */}
                    <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                        <Tooltip title="Salir del panel">
                            <IconButton
                                onClick={handleLogout}
                                sx={{
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#dc2626',
                                    },
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography variant='h3' 
                        sx={{ 
                            fontWeight: 'bold',
                            fontSize: {md: '2.5rem', xs: '1.8rem'},
                            color: '#2c3e50',
                            textAlign: 'center',
                            mb: 2
                        }}>
                        Selecciona tu Rol
                    </Typography>
                    <Typography variant='h6' 
                        sx={{ 
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '600px',
                            fontSize: {md: '1.3rem', xs: '1.2rem'},
                        }}>
                        Elige el tipo de usuario que mejor describa tu función en el sistema educativo
                    </Typography>
                    <Box className="container-card" 
                        sx={{
                            minHeight: {md: '70vh', xs: '60vh'},
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center', // Centra horizontalmente
                            alignItems: 'center', // Centra verticalmente
                            backgroundColor: 'rgba(13, 62, 237, 0)',
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
                                    position: 'relative',
                                    cursor: 'pointer',
                                    background: 'white',
                                    border: `3px solid ${rol.color}20`,
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '6px',
                                        background: rol.color,
                                        borderRadius: '20px 20px 0 0'
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                        boxShadow: `0 20px 40px ${rol.color}30`,
                                        border: `3px solid ${rol.color}40`
                                    },
                                }}
                                onClick={() => handleCardClick(rol.nombre)}
                            >
                                {/* Número en la esquina */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20,
                                        width: 50,
                                        height: 50,
                                        borderRadius: '50%',
                                        background: rol.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 2,
                                        boxShadow: `0 4px 15px ${rol.color}40`
                                    }}
                                >
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        {rol.numero}
                                    </Typography>
                                </Box>

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
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            background: `${rol.color}10`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            border: `2px solid ${rol.color}30`,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={rol.imagen}
                                            alt={rol.nombre}
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>

                                    {/* Título */}
                                    <Typography 
                                        variant='h5'
                                        sx={{
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
                                        variant='contained'
                                        fullWidth
                                        sx={{
                                            mt: 'auto',
                                            py: 1.5,
                                            borderRadius: '12px',
                                            background: rol.color,
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            boxShadow: `0 4px 15px ${rol.color}40`,
                                            '&:hover': {
                                                background: rol.color,
                                                boxShadow: `0 6px 20px ${rol.color}50`,
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
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            gap: 2,
                        }}>
                            <Typography variant='body2'
                                sx={{
                                    color: '#7f8c8d',
                                    textAlign: 'center'
                                }}>
                                ¿Ya tienes una cuenta?
                            </Typography>
                            <Button 
                                onClick={handleBackToPanel}
                                sx={{
                                    borderColor: '#3498db',
                                    color: '#3498db',
                                    px: 2,
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                }}
                            >
                                Iniciar Sesión
                            </Button>
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