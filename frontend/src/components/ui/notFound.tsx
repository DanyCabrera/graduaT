import {
    Box,
    Button,
    Fade,
    Typography,
    Container,
    Paper,
    Stack,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()
    
    const handleToHome = () => {
        navigate('/')
    }

    return(
        <>
            <Fade in={true} timeout={800}>    
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        minWidth: '100vw',
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: '#1c1c1c'
                    }}>
                    
                    {/* Elementos decorativos de fondo */}
                    <Box/>
                    <Container maxWidth="md">
                        <Paper
                            elevation={0}
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                bgcolor: '#1c1c1c'
                            }}
                        >
                            {/* Número 404 grande */}
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
                            </Typography>

                            {/* Título */}
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
                            </Typography>

                            {/* Botones de acción */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mt: 4 }}
                            >
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
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Regresar
                                </Button>
                            </Stack>
                        </Paper>
                    </Container>
                </Box>
            </Fade>
        </>
    )
}