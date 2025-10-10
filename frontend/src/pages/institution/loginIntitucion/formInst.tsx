import { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Chip,
    Fade,
    Slide,
    IconButton,
    InputAdornment,
} from "@mui/material";
import {
    Search as SearchIcon,
    School as SchoolIcon,
    LocationOn as LocationIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Refresh as RefreshIcon,
    Visibility as VisibilityIcon,
    AppRegistration as AppRegistrationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ElegantAlert from "../../../components/ui/ElegantAlert";

interface InstitucionData {
    nombre: string;
    direccion: string;
    departamento: string;
    correo: string;
    telefono: string;
    codigos: {
        institucion: string;
        supervisor: string;
        director: string;
        maestro: string;
        alumno: string;
    };
}

export default function FormInst() {
    const navigate = useNavigate();
    const [codigo, setCodigo] = useState("");
    const [mostrarTablas, setMostrarTablas] = useState(false);
    const [loading, setLoading] = useState(false);
    const [institucionData, setInstitucionData] = useState<InstitucionData | null>(null);
    const [codigoGenerado, setCodigoGenerado] = useState<string>("");
    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'success' as 'success' | 'error' | 'warning' | 'info',
        title: '',
        message: ''
    });

    // Función para generar código aleatorio de 6 dígitos
    const generarCodigoAleatorio = (): string => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let codigo = '';
        for (let i = 0; i < 6; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigo;
    };

    // Función para guardar código igual que en el panel de admin
    const guardarCodigoComoAdmin = (codigo: string) => {
        // Guardar en localStorage para validación (igual que el admin)
        const codigosValidos = JSON.parse(localStorage.getItem('codigosValidos') || '[]');
        const nuevoCodigoValido = {
            codigo: codigo,
            tipo: 'ROL',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            generadoPor: 'formInst'
        };
        
        const nuevosCodigosValidos = [nuevoCodigoValido, ...codigosValidos];
        localStorage.setItem('codigosValidos', JSON.stringify(nuevosCodigosValidos));
        
        console.log('✅ Código guardado en sistema de acceso:', nuevoCodigoValido);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        setCodigo(value);
        if (mostrarTablas) {
            setMostrarTablas(false);
        }
    };

    const showAlert = (severity: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setAlertState({
            open: true,
            severity,
            title,
            message
        });
    };

    const handleCloseAlert = () => {
        setAlertState(prev => ({ ...prev, open: false }));
    };

    const handleVerClick = async () => {
        if (codigo.length !== 6) {
            showAlert('warning', 'Código Inválido', 'El código debe tener exactamente 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3001/api/colegios/codigo/${codigo}`);
            const result = await response.json();

            if (result.success) {
                setInstitucionData(result.data);

                // Generar código aleatorio de 6 dígitos para acceso al panel
                const nuevoCodigo = generarCodigoAleatorio();
                setCodigoGenerado(nuevoCodigo);

                // Guardar código igual que en el panel de admin
                guardarCodigoComoAdmin(nuevoCodigo);

                setMostrarTablas(true);
                showAlert('success', '¡Institución Encontrada!', `Se encontró la institución: ${result.data.nombre}`);
            } else {
                const errorMessage = result.error || "Institución no encontrada con el código proporcionado";
                showAlert('error', 'Institución No Encontrada', errorMessage);
            }
        } catch (err) {
            console.error('Error al buscar institución:', err);
            const errorMessage = "Error al conectar con el servidor. Inténtalo de nuevo.";
            showAlert('error', 'Error de Conexión', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToPanel = () => {
        navigate('/registro/registro');
    };

    const handleRefresh = () => {
        setCodigo("");
        setMostrarTablas(false);
        setInstitucionData(null);
        setCodigoGenerado("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleVerClick();
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
            <Container maxWidth="lg">
                <Fade in timeout={800}>
                    <Box>
                        <Box
                            sx={{
                                p: 2
                            }}>

                            {/* Header */}
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        color: "#1e293b",
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    Consulta de Institución
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#64748b",
                                        fontWeight: 400,
                                    }}
                                >
                                    Ingresa el código de 6 dígitos para ver la información
                                </Typography>
                            </Box>

                            {/* Formulario de búsqueda */}
                            <Card
                                sx={{
                                    maxWidth: 600,
                                    mx: "auto",
                                    mb: 4,
                                    borderRadius: 2,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                    backgroundColor: "white",
                                    border: "1px solid #e2e8f0",
                                }}
                            >

                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flexWrap: "wrap" }}>
                                        <TextField
                                            fullWidth
                                            label="Código de Institución"
                                            value={codigo}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            inputProps={{ maxLength: 6 }}
                                            placeholder="Ej: ABC123"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: "#64748b" }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    backgroundColor: "white",
                                                },
                                            }}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleVerClick}
                                            disabled={loading || codigo.length !== 6}
                                            startIcon={loading ? <CircularProgress size={20} /> : <VisibilityIcon />}
                                            sx={{
                                                minWidth: 120,
                                                height: 56,
                                                borderRadius: 2,
                                                backgroundColor: "#374151",
                                                "&:hover": {
                                                    backgroundColor: "#1f2937",
                                                },
                                            }}
                                        >
                                            {loading ? "Buscando..." : "Buscar"}
                                        </Button>

                                        <Box
                                            sx={{
                                                width: "100%",
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 2
                                            }}>
                                            {/* BTN para regresar al Formulario */}
                                            <Button 
                                                variant='outlined' 
                                                onClick={handleBackToPanel} 
                                                fullWidth 
                                                sx={{
                                                    borderRadius: 2
                                                }}>
                                                <AppRegistrationIcon/> Registro
                                            </Button>
                                            {mostrarTablas && (
                                                <IconButton
                                                    onClick={handleRefresh}
                                                    sx={{
                                                        backgroundColor: "#f1f5f9",
                                                        "&:hover": {
                                                            backgroundColor: "#e2e8f0",
                                                        },
                                                    }}
                                                >
                                                    <RefreshIcon sx={{ color: "#64748b" }} />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Resultados */}
                        <Slide direction="up" in={mostrarTablas} timeout={600}>
                            <Box>
                                {institucionData && (
                                    <>
                                        {/* Información General */}
                                        <Card
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                                backgroundColor: "white",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                                    <SchoolIcon sx={{ mr: 2, color: "#64748b" }} />
                                                    <Typography variant="h5" fontWeight={600} sx={{ color: "#1e293b" }}>
                                                        Información General
                                                    </Typography>
                                                </Box>

                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc" }}>Campo</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, backgroundColor: "#f8fafc" }}>Información</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 500, width: "30%" }}>
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <SchoolIcon sx={{ mr: 1, color: "#64748b", fontSize: 20 }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Nombre de la Institución
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight={500}>
                                                                        {institucionData.nombre}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 500 }}>
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <LocationIcon sx={{ mr: 1, color: "#64748b", fontSize: 20 }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Dirección
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1">
                                                                        {institucionData.direccion}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 500 }}>
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <LocationIcon sx={{ mr: 1, color: "#64748b", fontSize: 20 }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Departamento
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={institucionData.departamento}
                                                                        variant="outlined"
                                                                        sx={{
                                                                            borderColor: "#d1d5db",
                                                                            color: "#374151",
                                                                            backgroundColor: "#f9fafb",
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 500 }}>
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <EmailIcon sx={{ mr: 1, color: "#64748b", fontSize: 20 }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Correo Electrónico
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1">
                                                                        {institucionData.correo}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 500 }}>
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <PhoneIcon sx={{ mr: 1, color: "#64748b", fontSize: 20 }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Teléfono
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1">
                                                                        {institucionData.telefono}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>

                                        {/* Códigos de Acceso */}
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                                backgroundColor: "white",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h5" fontWeight={600} sx={{ mb: 3, color: "#1e293b" }}>
                                                    Códigos de Acceso
                                                </Typography>

                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                                                                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                                                                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Chip
                                                                        label="Institución"
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#dbeafe",
                                                                            color: "#1e40af",
                                                                            border: "1px solid #93c5fd",
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight={500} fontFamily="monospace" sx={{ color: "#1e293b" }}>
                                                                        {institucionData.codigos.institucion}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: "#64748b" }}>Código de institución</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Chip
                                                                        label="Supervisor"
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#f3e8ff",
                                                                            color: "#7c3aed",
                                                                            border: "1px solid #c4b5fd",
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight={500} fontFamily="monospace" sx={{ color: "#1e293b" }}>
                                                                        {institucionData.codigos.supervisor}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: "#64748b" }}>Código para supervisores</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Chip
                                                                        label="Director"
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#dcfce7",
                                                                            color: "#16a34a",
                                                                            border: "1px solid #86efac",
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight={500} fontFamily="monospace" sx={{ color: "#1e293b" }}>
                                                                        {institucionData.codigos.director}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: "#64748b" }}>Código para directores</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Chip
                                                                        label="Maestro"
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#fef3c7",
                                                                            color: "#d97706",
                                                                            border: "1px solid #fcd34d",
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight={500} fontFamily="monospace" sx={{ color: "#1e293b" }}>
                                                                        {institucionData.codigos.maestro}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: "#64748b" }}>Código para maestros</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Chip
                                                                        label="Alumno"
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#e0f2fe",
                                                                            color: "#0369a1",
                                                                            border: "1px solid #7dd3fc",
                                                                            fontWeight: 500
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight={500} fontFamily="monospace" sx={{ color: "#1e293b" }}>
                                                                        {institucionData.codigos.alumno}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: "#64748b" }}>Código para alumnos</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>

                                        {/* Código Generado para Acceso */}
                                        {codigoGenerado && (
                                            <Card
                                                sx={{
                                                    mt: 3,
                                                    borderRadius: 2,
                                                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                                    backgroundColor: "white",
                                                    border: "2px solid #10b981",
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{ textAlign: "center" }}>
                                                        <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: "#1e293b" }}>
                                                            🔑 Código de Acceso Generado
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ mb: 3, color: "#64748b" }}>
                                                            Usa este código en la página de registro para acceder al panel de roles
                                                        </Typography>

                                                        <Box
                                                            sx={{
                                                                display: "inline-block",
                                                                p: 3,
                                                                backgroundColor: "#f0fdf4",
                                                                border: "2px solid #10b981",
                                                                borderRadius: 2,
                                                                mb: 3,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h3"
                                                                fontWeight="bold"
                                                                sx={{
                                                                    color: "#10b981",
                                                                    fontFamily: "monospace",
                                                                    letterSpacing: 3,
                                                                }}
                                                            >
                                                                {codigoGenerado}
                                                            </Typography>
                                                        </Box>

                                                        <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                                                            Este código funciona igual que los generados en el panel de admin. Los estudiantes pueden usarlo en <strong>/codigo-acceso</strong> para acceder al panel de roles.
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Slide>
                    </Box>
                </Fade>
            </Container>

            {/* Elegant Alert */}
            <ElegantAlert
                open={alertState.open}
                onClose={handleCloseAlert}
                severity={alertState.severity}
                title={alertState.title}
                message={alertState.message}
                autoHideDuration={5000}
                position="top-center"
            />
        </Box>
    );
}