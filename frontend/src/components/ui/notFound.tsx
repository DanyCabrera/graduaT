import {
    Box,
    Button,
    Fade,
    Typography,
    Container,
    Paper,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import Tortu404 from "../../assets/Tortu404.png";
import logo from "../../assets/LogoColor1.png";
import Tortu404Cel from "../../assets/Tortu404cel.png";
import { useNavigate } from 'react-router-dom'


export default function NotFound() {
    const navigate = useNavigate()

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const handleToHome = () => {
        navigate('/')
    }

    return(
        <>
            <Fade in={true} timeout={800}>    
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        minWidth: '100vw',
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: '#ffffffff'
                    }}>

                        
                    <Box
                        component="img"
                        src= {logo}   
                        alt="Logo"
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            width: { xs: 110, sm: 120, md: 145 },
                        }}
                    />
                    
                    {/* Elementos decorativos de fondo */}
                    
                    <Container maxWidth={false} sx={{ mt: 2, mb: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                bgcolor: '#ffffffff'
                            }}
                        >
                            {/* Imagen personalizada con el 404 */}
                            <Box
                                component="img"
                                src={isMobile ? Tortu404Cel : Tortu404} 
                                alt="Página no encontrada"
                                sx={{
                                    width: '100%',
                                    maxWidth: '1050px',
                                    height: 'auto',
                                    display: 'block',
                                    mx: 'auto',
                                }}
                                
                            />

                        
                            {/* Número 404 grande 
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '8rem', md: '12rem' },
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #d90429, #d90429)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1,
                                    mb: 2,
                                    textShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%, 100%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.05)' }
                                    }
                                }}
                            >
                                404
                            </Typography>*/}

                            {/* Título *
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#fafaff',
                                    mb: 2,
                                    fontSize: { xs: '1.5rem', md: '2rem' }
                                }}
                            >
                                ¡Oops! Page NotFound
                            </Typography>/}

                            {/* Botones de acción 
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mt: 0.5 }}
                            >*/}

                                {/* Botón debajo de la imagen 
                            <Button
                                color="error"
                                variant="contained"
                                size="large"
                                onClick={handleToHome}
                                sx={{
                                    mt: { xs: 1,  md: 0.1 },
                                    ml: { xs: 0, sm: 0, md: 40 },
                                    borderRadius: 3,
                                    px: 8,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                REGRESAR
                            </Button> */}

                                {/*
                                <Button
                                    color='error'
                                    variant="outlined"
                                    size="large"
                                    onClick={handleToHome}
                                    sx={{
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        bgcolor: '#de4136',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        textTransform: 'none',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Regresar
                                </Button>
                            </Stack>*/} 
                        </Paper>
                    </Container>
                </Box>
            </Fade>
        </>
    )
}