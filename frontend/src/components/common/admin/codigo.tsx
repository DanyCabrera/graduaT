import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Fade,
    Alert,
    Chip,
    IconButton,
    Snackbar,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    ContentCopy as CopyIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';

export default function Codigo() {
    const [codigosGenerados, setCodigosGenerados] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState('');

    // Cargar códigos existentes al inicializar
    useEffect(() => {
        const codigosGuardados = localStorage.getItem('codigosGenerados');
        if (codigosGuardados) {
            setCodigosGenerados(JSON.parse(codigosGuardados));
        }
    }, []);

    const generarCodigoAleatorio = () => {
        // Generar un código aleatorio de 6 caracteres en mayúsculas y solo letras
        const codigo = Array(6)
            .fill(0)
            .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras de A-Z
            .join('');
        
        const nuevosCodigos = [codigo, ...codigosGenerados];
        setCodigosGenerados(nuevosCodigos);
        
        // Guardar en localStorage para validación
        localStorage.setItem('codigosGenerados', JSON.stringify(nuevosCodigos));
        
        // También guardar en el formato de códigos válidos para el sistema de acceso
        const codigosValidos = JSON.parse(localStorage.getItem('codigosValidos') || '[]');
        const nuevoCodigoValido = {
            codigo: codigo,
            tipo: 'ROL',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            generadoPor: 'admin'
        };
        
        const nuevosCodigosValidos = [nuevoCodigoValido, ...codigosValidos];
        localStorage.setItem('codigosValidos', JSON.stringify(nuevosCodigosValidos));
        
        console.log('Código generado:', codigo);
        console.log('Código guardado en sistema de acceso:', nuevoCodigoValido);
    };

    const copiarCodigo = (codigo: string) => {
        navigator.clipboard.writeText(codigo);
        setCopiedCode(codigo);
        setSnackbarOpen(true);
    };

    const limpiarCodigos = () => {
        setCodigosGenerados([]);
        localStorage.removeItem('codigosGenerados');
        
        // También limpiar los códigos válidos del sistema de acceso
        const codigosValidos = JSON.parse(localStorage.getItem('codigosValidos') || '[]');
        const codigosFiltrados = codigosValidos.filter((codigo: any) => codigo.tipo !== 'ROL');
        localStorage.setItem('codigosValidos', JSON.stringify(codigosFiltrados));
    };

    return (
        <Box
            sx={{
                backgroundColor: "#ffffffff",
                padding: 2,
            }}
        >
            <Container maxWidth="lg">
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
                                <AdminIcon sx={{ fontSize: 40, color: "#64748b" }} />
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#1e293b",
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                Panel de Administración
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#64748b",
                                    fontWeight: 400,
                                }}
                            >
                                Genera y gestiona códigos de acceso para el panel de roles
                            </Typography>
                        </Box>

                        {/* Botones de acción */}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
                            <Button
                                variant="contained"
                                onClick={generarCodigoAleatorio}
                                startIcon={<RefreshIcon />}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "#374151",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": {
                                        backgroundColor: "#1f2937",
                                    },
                                }}
                            >
                                Generar Código Aleatorio
                            </Button>
                            
                            {codigosGenerados.length > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={limpiarCodigos}
                                    sx={{
                                        borderRadius: 2,
                                        borderColor: "#ef4444",
                                        color: "#ef4444",
                                        textTransform: "none",
                                        fontWeight: 500,
                                        px: 4,
                                        py: 1.5,
                                        "&:hover": {
                                            borderColor: "#dc2626",
                                            backgroundColor: "#fef2f2",
                                        },
                                    }}
                                >
                                    Limpiar Códigos
                                </Button>
                            )}
                        </Box>

                        {/* Códigos generados */}
                        {codigosGenerados.length > 0 ? (
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                    backgroundColor: "white",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: "#1e293b",
                                            fontWeight: 600,
                                            mb: 3,
                                            textAlign: "center",
                                        }}
                                    >
                                        🔑 Códigos Generados
                                    </Typography>
                                    
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                                        {codigosGenerados.map((codigo, index) => (
                                            <Box key={index} sx={{ width: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(33.333% - 11px)" } }}>
                                                <Card
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: "#f0fdf4",
                                                        border: "2px solid #10b981",
                                                        borderRadius: 2,
                                                        textAlign: "center",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            color: "#10b981",
                                                            fontFamily: "monospace",
                                                            letterSpacing: 2,
                                                            fontWeight: "bold",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        {codigo}
                                                    </Typography>
                                                    
                                                    <IconButton
                                                        onClick={() => copiarCodigo(codigo)}
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            right: 8,
                                                            backgroundColor: "white",
                                                            "&:hover": {
                                                                backgroundColor: "#f9fafb",
                                                            },
                                                        }}
                                                    >
                                                        <CopyIcon sx={{ fontSize: 20, color: "#64748b" }} />
                                                    </IconButton>
                                                    
                                                    <Chip
                                                        label={`Código ${index + 1}`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: "#dcfce7",
                                                            color: "#16a34a",
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                </Card>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                    backgroundColor: "white",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: "center" }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "#64748b",
                                            fontWeight: 400,
                                        }}
                                    >
                                        No hay códigos generados aún
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#9ca3af",
                                            mt: 1,
                                        }}
                                    >
                                        Haz clic en "Generar Código Aleatorio" para crear tu primer código
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

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
                                💡 <strong>Para Administradores:</strong> Los códigos generados son de 6 letras mayúsculas y permiten el acceso
                                al panel de registro de institucion, solo es compartido con los Directores de las instituciones.
                            </Typography>
                        </Alert>
                    </Box>
                </Fade>
            </Container>

            {/* Snackbar para confirmar copia */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={`Código ${copiedCode} copiado al portapapeles`}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
}
