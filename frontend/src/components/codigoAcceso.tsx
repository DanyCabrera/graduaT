import { Box, TextField, Button, Container, Card, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

export default function CodigoAcceso() {
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState(false); // Estado para manejar errores
    const [success, setSuccess] = useState(false); // Estado para manejar éxito
    const navigate = useNavigate();

    const codigoAcceso = "ASDFGH"; // Código de acceso válido

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toUpperCase().replace(/[^A-Z]/g, ''); // Solo letras mayúsculas
        setCodigo(value);
        setError(false); // Reinicia el error al cambiar el texto
    };

    const handleSubmit = () => {
        if (codigo === codigoAcceso) {
            setSuccess(true); // Muestra el mensaje de éxito
            setTimeout(() => {
                navigate('/panelRol', { replace: true }); // Redirige al componente PanelRol y reemplaza la entrada en el historial
            }, 2000); // Espera 3 segundos antes de redirigir
        } else {
            setError(true); // Muestra un mensaje de error si el código es incorrecto
        }
    };

    // Evita que el usuario regrese al componente CódigoAcceso si ya está en PanelRol
    useEffect(() => {
        navigate('/', { replace: true }); // Reemplaza la entrada inicial en el historial
    }, [navigate]);

    return (
        <>
            <Navbar />
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    minHeight: '90vh',
                    minWidth: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: { xs: '90%', sm: '70%', md: '50%' }, // Ancho responsivo
                        padding: { xs: 3, sm: 4, md: 5 }, // Padding responsivo
                        borderRadius: 5,
                    }}
                >
                    <Box
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '2rem', // Tamaño de fuente responsivo
                                textAlign: 'center',
                            }}
                        >
                            Código de Acceso
                        </h1>
                        <p
                            style={{
                                fontSize: '1rem', // Tamaño de fuente responsivo
                                textAlign: 'center',
                                color: 'gray',
                            }}
                        >
                            Introduce el código de acceso para continuar
                        </p>
                        <TextField
                            label="Código de acceso"
                            variant="standard"
                            fullWidth
                            value={codigo}
                            onChange={handleInputChange} // Maneja el cambio de entrada
                            error={error} // Muestra el error en el campo
                            helperText={error ? "Código incorrecto. Inténtalo de nuevo." : ""}
                        />
                        <Button
                            variant="contained"
                            color="info"
                            sx={{
                                width: '100%',
                                marginTop: 2,
                                fontSize: { xs: '0.8rem', sm: '1rem' }, // Tamaño de fuente responsivo
                            }}
                            onClick={handleSubmit} // Valida el código al hacer clic
                        >
                            Entrar
                        </Button>
                        {error && (
                            <Alert severity="error" sx={{ marginTop: 2 }}>
                                Código incorrecto. Inténtalo de nuevo.
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ marginTop: 2 }}>
                                Código correcto. Redirigiendo al panel...
                            </Alert>
                        )}
                    </Box>
                </Card>
            </Container>
        </>
    );
}