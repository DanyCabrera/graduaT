import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Fade,
    Alert,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Public as PublicIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function LoginInstituciones() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        direccion: '',
        telefono: '',
        departamento: '',
    });

    const [codigoInstitucion, setCodigoInstitucion] = useState<string | null>(null); // Estado para el código generado

    // Verificar si hay un código validado al cargar el componente
    useEffect(() => {
        const codigoValidado = localStorage.getItem('codigoValidado');
        if (!codigoValidado) {
            // Si no hay código validado, redirigir al panel de código de acceso
            navigate('/registro');
        }
    }, [navigate]);

    const departamentos = [
        'Alta Verapaz',
        'Baja Verapaz',
        'Chimaltenango',
        'Chiquimula',
        'El Progreso',
        'Escuintla',
        'Guatemala',
        'Huehuetenango',
        'Izabal',
        'Jalapa',
        'Jutiapa',
        'Petén',
        'Quetzaltenango',
        'Quiché',
        'Retalhuleu',
        'Sacatepéquez',
        'San Marcos',
        'Santa Rosa',
        'Sololá',
        'Suchitepéquez',
        'Totonicapán',
        'Zacapa',
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }
    ) => {
        const { name, value } = e.target;
        if (name) {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleVerClick= (e: React.FormEvent) => {
        e.preventDefault();

        // Generar un código aleatorio de 6 caracteres en mayúsculas
        const codigo = Array(6)
            .fill(0)
            .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras de A-Z
            .join('');

        setCodigoInstitucion(codigo); // Guardar el código en el estado
        console.log('Formulario enviado:', formData, 'Código de Institución:', codigo);
    };

    const handleBackToPanel = () => {
        navigate('/registro/formInst');
    };

    const handleVolverACodigo = () => {
        localStorage.removeItem('codigoValidado');
        navigate('/registro');
    };

    const cardCodigo = () => {
        return(
            <Card 
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 2,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                }}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>
                        <CheckCircleIcon sx={{ fontSize: 36, color: "#10b981", mb: 1 }} />
                        <Typography variant="h6" fontWeight={600} sx={{ color: "#1e293b", mb: 0.5 }}>
                            ¡Registro Exitoso!
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Tu código de institución
                        </Typography>
                    </Box>
                    
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: "#f0fdf4",
                            border: "2px solid #10b981",
                            borderRadius: 2,
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                color: "#10b981",
                                fontFamily: "monospace",
                                letterSpacing: 2,
                            }}
                        >
                            {codigoInstitucion}
                        </Typography>
                    </Box>
                    
                    <Alert severity="info" sx={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Guarda este código
                        </Typography>
                    </Alert>
                    <Button variant='outlined' fullWidth sx={{mt: 2}} onClick={handleBackToPanel}>
                        Ver registro de institución
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                overflow: "hidden",
            }}
        >
            <Container maxWidth="lg" sx={{ minHeight: "100vh" }}>
                <Fade in timeout={800}>
                    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        {/* Header */}
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    backgroundColor: "#e2e8f0",
                                    mb: 2,
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 30, color: "#64748b" }} />
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: "#1e293b",
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                Registro de Instituciones
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#64748b",
                                    fontWeight: 400,
                                    mb: 2,
                                }}
                            >
                                Completa el formulario para registrar tu institución
                            </Typography>
                            
                            {/* Botón para volver al código de acceso */}
                            <Button
                                variant="outlined"
                                onClick={handleVolverACodigo}
                                sx={{
                                    borderRadius: 2,
                                    borderColor: "#64748b",
                                    color: "#64748b",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    "&:hover": {
                                        borderColor: "#374151",
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            >
                                ← Volver al Código de Acceso
                            </Button>
                        </Box>

                        <Box 
                            sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                gap: 4, 
                                minWidth: "100%",
                                flexDirection: { xs: "column", md: "row" },
                            }}>
                            {/* Formulario */}
                            <Card
                                sx={{
                                    width: { xs: "100%", md: codigoInstitucion ? "400px" : "500px" },
                                    maxWidth: 500,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                    backgroundColor: "white",
                                    border: "1px solid #e2e8f0",
                                    transition: "width 0.5s ease-in-out",
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <form onSubmit={handleVerClick}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                            <TextField
                                                label="Nombre de la Institución"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, '');
                                                    setFormData({ ...formData, nombre: value });
                                                }}
                                                fullWidth
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
                                            />
                                            
                                            <TextField
                                                label="Correo Electrónico"
                                                name="correo"
                                                value={formData.correo}
                                                onChange={handleChange}
                                                fullWidth
                                                type="email"
                                                InputProps={{
                                                    startAdornment: (
                                                        <EmailIcon sx={{ mr: 1, color: "#64748b" }} />
                                                    ),
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        backgroundColor: "white",
                                                    },
                                                }}
                                            />
                                            
                                            <TextField
                                                label="Dirección"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <LocationIcon sx={{ mr: 1, color: "#64748b" }} />
                                                    ),
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        backgroundColor: "white",
                                                    },
                                                }}
                                            />
                                            
                                            <TextField
                                                label="Teléfono"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                fullWidth
                                                type="tel"
                                                InputProps={{
                                                    startAdornment: (
                                                        <PhoneIcon sx={{ mr: 1, color: "#64748b" }} />
                                                    ),
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        backgroundColor: "white",
                                                    },
                                                }}
                                            />
                                            
                                            <FormControl fullWidth>
                                                <InputLabel id="departamento-label">Departamento</InputLabel>
                                                <Select
                                                    labelId="departamento-label"
                                                    name="departamento"
                                                    value={formData.departamento}
                                                    onChange={handleChange}
                                                    startAdornment={<PublicIcon sx={{ mr: 1, color: "#64748b" }} />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        backgroundColor: "white",
                                                    }}
                                                >
                                                    {departamentos.map((dep, index) => (
                                                        <MenuItem key={index} value={dep}>
                                                            {dep}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    backgroundColor: "#374151",
                                                    "&:hover": {
                                                        backgroundColor: "#1f2937",
                                                    },
                                                }}
                                            >
                                                Registrar Institución
                                            </Button>
                                        </Box>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Código Generado */}
                            <Box sx={{ 
                                width: { xs: "100%", md: "400px" },
                                maxWidth: 400,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: codigoInstitucion ? 1 : 0,
                                transform: codigoInstitucion ? "scale(1)" : "scale(0.8)",
                                transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                                transitionDelay: codigoInstitucion ? "0.3s" : "0s"
                            }}>
                                {cardCodigo()}
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
}
