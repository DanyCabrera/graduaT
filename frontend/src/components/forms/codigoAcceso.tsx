import { Box, TextField, Button, Container, Card, Typography} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodigoAcceso() {
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const codigoAcceso: string = "ASDFGH";

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toUpperCase().replace(/[^A-Z]/g, ''); 
        setCodigo(value);
        setError(false);
    };

    const handleOpen = () => {
        setOpen(true); // abre el backdrop
        if (codigo === codigoAcceso) {
            setTimeout(() => {
                setOpen(false); // cierra el backdrop antes de navegar
                navigate('/panelRol', { replace: true });
            }, 1000);
        } else {
            setError(true);
            setOpen(false); // lo cierra si es error
        }

        if (codigo === '') {
            setError(false);
            setOpen(false); // lo cierra si está vacío
        }
    };

    return (
        <>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    minHeight: '100vh',
                    minWidth: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                    bgcolor: "rgba(113, 161, 250, 0.1)",
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: { xs: '90%', sm: '70%', md: '50%' },
                        padding: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 5,
                        boxShadow: 20,
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', sm: '70%', md: '70%' },
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="button"
                            sx={{
                                fontSize: { xs: '1.22rem', sm: '1.5rem', md: '2rem' },
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>
                            Codigo de Acceso
                        </Typography>
                        <TextField
                            color='warning'
                            label="Digite código de acceso"
                            variant="standard"
                            fullWidth
                            value={codigo}
                            onChange={handleInputChange}
                            error={error}
                            helperText={error ? "Código incorrecto. Inténtalo de nuevo." : ""}
                        />
                        <Button
                            variant="outlined"
                            color="warning"
                            sx={{
                                width: '100%',
                                marginTop: 2,
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                transition: 'transform 0.5s all',
                                '&:hover': {
                                    bgcolor: 'rgba(252, 80, 0, 0.22)',
                                }
                            }}
                            onClick={handleOpen}
                        >
                            Entrar
                        </Button>
                    </Box>
                    <Box 
                        sx={{
                            width: '40%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            placeItems: 'center',
                            flexDirection: 'column',
                        }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/12466/12466012.png" width='200' height='200' alt="" />
                    </Box>
                </Card>
            </Container>

            {/* Backdrop con el círculo de carga */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="success" />
            </Backdrop>
        </>
    );
}
