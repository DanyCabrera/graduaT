import { 
    Box, 
    TextField, 
    Button, 
    Container, 
    Card, 
    CardContent,
    Typography,
    Fade,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Key as KeyIcon,
    Login as LoginIcon,
    Error as ErrorIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodigoAcceso() {
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toUpperCase().replace(/[^A-Z]/g, ''); 
        setCodigo(value);
        setError(false);
        setErrorMessage('');
    };

    const handleBackToPanel = () => {
        navigate('/');
    }

    const verificarCodigo = async () => {
        if (!codigo.trim()) {
            setError(true);
            setErrorMessage('Por favor ingresa un código');
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMessage('');

        try {
            // Primero verificar en localStorage (códigos generados)
            const codigosValidos = JSON.parse(localStorage.getItem('codigosValidos') || '[]');
            const codigoEncontrado = codigosValidos.find((c: any) => 
                c.codigo === codigo.trim() && c.activo === true
            );

            if (codigoEncontrado) {
                // Código encontrado en localStorage
                setTimeout(() => {
                    setLoading(false);
                    if (codigoEncontrado.tipo === 'ROL') {
                        navigate('/panelRol', { replace: true });
                    } else {
                        navigate('/registro', { replace: true });
                    }
                }, 1000);
                return;
            }

            // Si no se encuentra en localStorage, intentar con la API (códigos del backend)
            const response = await fetch('http://localhost:5000/api/codigos-acceso/verificar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo: codigo.trim() }),
            });

            const result = await response.json();
            
            if (result.success) {
                // Verificar si es un código de rol
                if (result.data.tipo === 'ROL') {
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/panelRol', { replace: true });
                    }, 1000);
                } else {
                    // Si es código de institución, redirigir a otra página
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/registro', { replace: true });
                    }, 1000);
                }
            } else {
                setError(true);
                setErrorMessage(result.message || 'Código de acceso inválido');
                setLoading(false);
            }

        } catch (error) {
            setError(true);
            setErrorMessage('Código de acceso inválido. Verifica que el código sea correcto.');
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={800}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    backgroundColor: "#e2e8f0",
                                    mb: 2,
                                }}
                            >
                                <KeyIcon sx={{ fontSize: 40, color: "#64748b" }} />
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#1e293b",
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                Código de Acceso
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#64748b",
                                    fontWeight: 400,
                                }}
                            >
                                Ingresa tu código para acceder al sistema
                            </Typography>
                        </Box>

                        {/* Formulario */}
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                backgroundColor: "white",
                                border: "1px solid #e2e8f0",
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <TextField
                                        label="Código de Acceso"
                                        value={codigo}
                                        onChange={handleInputChange}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                verificarCodigo();
                                            }
                                        }}
                                        fullWidth
                                        placeholder="Ej: ABC123"
                                        InputProps={{
                                            startAdornment: (
                                                <KeyIcon sx={{ mr: 1, color: "#64748b" }} />
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                backgroundColor: "white",
                                            },
                                        }}
                                        disabled={loading}
                                    />

                                    {error && (
                                        <Alert 
                                            severity="error" 
                                            icon={<ErrorIcon />}
                                            sx={{ 
                                                backgroundColor: "#fef2f2", 
                                                border: "1px solid #fecaca",
                                                borderRadius: 2,
                                            }}
                                        >
                                            {errorMessage}
                                        </Alert>
                                    )}

                                    <Button
                                        onClick={verificarCodigo}
                                        variant="contained"
                                        fullWidth
                                        disabled={loading || !codigo.trim()}
                                        startIcon={loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : <LoginIcon />}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: "#374151",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                                backgroundColor: "#1f2937",
                                            },
                                            "&:disabled": {
                                                backgroundColor: "#9ca3af",
                                            },
                                        }}
                                    >
                                        {loading ? "Verificando..." : "Acceder"}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Instrucciones */}
                        <Alert 
                            severity="info" 
                            sx={{ 
                                mt: 4,
                                backgroundColor: "#eff6ff", 
                                border: "1px solid #bfdbfe",
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                💡 <strong>Información:</strong> El código de acceso debe ser proporcionado por el Director. 
                                Ingresa el código exacto para acceder al sistema.
                            </Typography>
                        </Alert>
                        <Button onClick={handleBackToPanel} fullWidth sx={{mt: 2}}>
                            <ArrowBackIcon />
                            Volver
                        </Button>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
}
