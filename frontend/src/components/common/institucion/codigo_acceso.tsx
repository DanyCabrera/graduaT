import { useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Fade,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Key as KeyIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function CodigoAcceso() {
    const navigate = useNavigate();
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validarCodigo = async () => {
        if (!codigo.trim()) {
            setError('Por favor ingresa un código de acceso');
            return;
        }

        if (codigo.length !== 6) {
            setError('El código debe tener exactamente 6 caracteres');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Obtener códigos válidos del localStorage (generados en el panel admin)
            const codigosValidos = JSON.parse(localStorage.getItem('codigosGenerados') || '[]');
            
            // Verificar si el código ingresado está en la lista
            const codigoEncontrado = codigosValidos.find((c: string) => c === codigo.toUpperCase());
            
            if (codigoEncontrado) {
                setSuccess(true);
                // Guardar el código validado para usar en el formulario
                localStorage.setItem('codigoValidado', codigo.toUpperCase());
                
                // Redirigir al formulario de institución después de un breve delay
                setTimeout(() => {
                    navigate('/registro/registro');
                }, 1500);
            } else {
                setError('Código de acceso inválido. Verifica con el administrador.');
            }
        } catch (err) {
            setError('Error al validar el código. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            validarCodigo();
        }
    };

    const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (value.length <= 6) {
            setCodigo(value);
            setError('');
            setSuccess(false);
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
                                Ingresa el código proporcionado por el administrador
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
                                {success ? (
                                    <Box sx={{ textAlign: "center", py: 2 }}>
                                        <CheckIcon sx={{ fontSize: 60, color: "#10b981", mb: 2 }} />
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color: "#10b981",
                                                fontWeight: 600,
                                                mb: 1,
                                            }}
                                        >
                                            ¡Código Válido!
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#64748b",
                                            }}
                                        >
                                            Redirigiendo al formulario de registro...
                                        </Typography>
                                        <CircularProgress sx={{ mt: 2, color: "#10b981" }} />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <TextField
                                            label="Código de Acceso"
                                            value={codigo}
                                            onChange={handleCodigoChange}
                                            onKeyPress={handleKeyPress}
                                            fullWidth
                                            placeholder="Ej: ABCDEF"
                                            InputProps={{
                                                startAdornment: (
                                                    <BusinessIcon sx={{ mr: 1, color: "#64748b" }} />
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
                                                {error}
                                            </Alert>
                                        )}

                                        <Button
                                            onClick={validarCodigo}
                                            variant="contained"
                                            fullWidth
                                            disabled={loading || !codigo.trim()}
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
                                            {loading ? (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <CircularProgress size={20} sx={{ color: "white" }} />
                                                    Validando...
                                                </Box>
                                            ) : (
                                                "Validar Código"
                                            )}
                                        </Button>
                                    </Box>
                                )}
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
                                💡 <strong>Información:</strong> El código de acceso debe ser proporcionado por el administrador. 
                                Debe contener exactamente 6 letras mayúsculas.
                            </Typography>
                        </Alert>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
}
