import { API_BASE_URL } from "../../../constants";
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
    Modal,
    Backdrop,
    IconButton,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Public as PublicIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Add as AddIcon,
    TableView as TableViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ElegantAlert from '../../../components/ui/ElegantAlert';

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
    const [modalOpen, setModalOpen] = useState(false); // Estado para el modal
    const [alertState, setAlertState] = useState({
        open: false,
        severity: 'success' as 'success' | 'error' | 'warning' | 'info',
        title: '',
        message: ''
    });

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

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // Limpiar el formulario al cerrar
        setFormData({
            nombre: '',
            correo: '',
            direccion: '',
            telefono: '',
            departamento: '',
        });
        setCodigoInstitucion(null);
    };

    const handleVerClick = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar campos requeridos
        if (!formData.nombre || !formData.correo || !formData.direccion || !formData.telefono || !formData.departamento) {
            showAlert('warning', 'Campos Requeridos', 'Por favor, complete todos los campos requeridos');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            showAlert('error', 'Correo Inválido', 'Por favor, ingrese un correo electrónico válido');
            return;
        }

        try {
            const response = await fetch('${API_BASE_URL}/colegios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre_Completo: formData.nombre,
                    Correo: formData.correo,
                    Dirección: formData.direccion,
                    Teléfono: formData.telefono,
                    DEPARTAMENTO: formData.departamento
                }),
            });

            const result = await response.json();

            if (result.success) {
                setCodigoInstitucion(result.data.Código_Institución);
                showAlert('success', '¡Registro Exitoso!', 'Su institución ha sido registrada correctamente. Se ha enviado un email de confirmación con todos los códigos.');
                console.log('Institución registrada exitosamente:', result.data);
                // No cerrar el modal inmediatamente para mostrar el código
            } else {
                showAlert('error', 'Error de Registro', result.error || 'Error al registrar la institución');
            }
        } catch (error) {
            console.error('Error al registrar institución:', error);
            showAlert('error', 'Error de Conexión', 'Error al conectar con el servidor. Inténtelo de nuevo.');
        }
    };

    const handleBackToPanel = () => {
        handleCloseModal();
        navigate('/registro/formInst');
    };

    const handleVolverACodigo = () => {
        localStorage.removeItem('codigoValidado');
        navigate('/registro');
    };

    const cardCodigo = () => {
        return(
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100%',
                minHeight: '400px'
            }}>
                <Card 
                    sx={{
                        width: '100%',
                        maxWidth: 500,
                        borderRadius: 3,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        mx: 'auto'
                    }}>
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <Box sx={{ mb: 3 }}>
                            <CheckCircleIcon sx={{ fontSize: 48, color: "#10b981", mb: 2 }} />
                            <Typography variant="h5" fontWeight={700} sx={{ color: "#1e293b", mb: 1 }}>
                                ¡Registro Exitoso!
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#64748b" }}>
                                Tu código de institución ha sido generado
                            </Typography>
                        </Box>
                        
                        <Box
                            sx={{
                                p: 3,
                                backgroundColor: "#f0fdf4",
                                border: "3px solid #10b981",
                                borderRadius: 3,
                                mb: 3,
                                mx: 'auto',
                                maxWidth: 300,
                            }}
                        >
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{
                                    color: "#10b981",
                                    fontFamily: "monospace",
                                    letterSpacing: 3,
                                    textAlign: 'center'
                                }}
                            >
                                {codigoInstitucion}
                            </Typography>
                        </Box>
                        
                        <Alert 
                            severity="success" 
                            sx={{ 
                                backgroundColor: "#f0fdf4", 
                                border: "1px solid #10b981", 
                                py: 2,
                                mb: 3,
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 500, color: "#059669" }}>
                                ✅ Código generado exitosamente. Se ha enviado un email de confirmación con todos los códigos.
                            </Typography>
                        </Alert>
                        
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Button 
                                variant='outlined' 
                                fullWidth 
                                onClick={handleCloseModal}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    borderColor: "#64748b",
                                    color: "#64748b",
                                    "&:hover": {
                                        borderColor: "#374151",
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            >
                                Cerrar
                            </Button>
                            <Button 
                                variant='contained' 
                                fullWidth 
                                onClick={handleBackToPanel}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    backgroundColor: "#1976d2",
                                    "&:hover": {
                                        backgroundColor: "#1565c0",
                                    },
                                }}
                            >
                                Ver Registro de Institución
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
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
                            
                            {/* Botones de navegación */}
                            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
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
                                
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/registro/formInst')}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        textTransform: "none",
                                        fontWeight: 500,
                                        px: 3,
                                        py: 1,
                                        "&:hover": {
                                            backgroundColor: "#2563eb",
                                        },
                                    }}
                                >
                                    <TableViewIcon/> Consultar Institución
                                </Button>
                            </Box>
                        </Box>

                        {/* Botón principal para registrar institución */}
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleOpenModal}
                                startIcon={<AddIcon />}
                                sx={{
                                    py: 2,
                                    px: 4,
                                    borderRadius: 3,
                                    backgroundColor: "#1976d2",
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    boxShadow: "0 8px 32px rgba(25, 118, 210, 0.3)",
                                    "&:hover": {
                                        backgroundColor: "#1565c0",
                                        boxShadow: "0 12px 40px rgba(25, 118, 210, 0.4)",
                                        transform: "translateY(-2px)",
                                    },
                                    transition: "all 0.3s ease-in-out",
                                }}
                            >
                                Registrar Nueva Institución
                            </Button>
                        </Box>

                        {/* Información adicional */}
                        <Box sx={{ 
                            display: "grid", 
                            gridTemplateColumns: { 
                                xs: "1fr", 
                                md: "repeat(2, 1fr)" 
                            }, 
                            gap: 3,
                            maxWidth: 800,
                            mx: "auto"
                        }}>
                            <Card sx={{ 
                                borderRadius: 3,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                backgroundColor: "white",
                                border: "1px solid #e2e8f0",
                            }}>
                                <CardContent sx={{ p: 3, textAlign: "center" }}>
                                    <BusinessIcon sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        Registro de Instituciones
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Registra tu institución educativa para obtener códigos únicos de acceso para todos los roles.
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ 
                                borderRadius: 3,
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                                backgroundColor: "white",
                                border: "1px solid #e2e8f0",
                            }}>
                                <CardContent sx={{ p: 3, textAlign: "center" }}>
                                    <CheckCircleIcon sx={{ fontSize: 48, color: "#388e3c", mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        Códigos Generados
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Recibirás 5 códigos únicos: Institución, Alumno, Maestro, Director y Supervisor.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Fade>
            </Container>

            {/* Modal de Registro */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '95%', sm: '90%', md: '600px' },
                            maxWidth: 600,
                            maxHeight: '90vh',
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: 24,
                            p: 0,
                        }}
                    >
                        {/* Header del Modal */}
                        <Box
                            sx={{
                                p: 3,
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px 12px 0 0',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon sx={{ mr: 2, color: '#1976d2' }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    Registrar Institución
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={handleCloseModal}
                                sx={{
                                    color: '#64748b',
                                    '&:hover': {
                                        backgroundColor: '#e2e8f0',
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Contenido del Modal */}
                        <Box sx={{ p: 4 }}>
                            {!codigoInstitucion ? (
                                // Formulario de Registro
                                <form onSubmit={handleVerClick}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <Box>
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

                                            <Typography 
                                                variant='body2'
                                                sx={{
                                                    color: 'gray',
                                                    ml: 2
                                                }}>
                                                Escriaba el nombre en mayúscula y sin acento
                                            </Typography>
                                        </Box>
                                        
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
                                                label="Departamento"
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
                                        
                                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                onClick={handleCloseModal}
                                                fullWidth
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    borderColor: "#64748b",
                                                    color: "#64748b",
                                                    "&:hover": {
                                                        borderColor: "#374151",
                                                        backgroundColor: "#f9fafb",
                                                    },
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    backgroundColor: "#1976d2",
                                                    "&:hover": {
                                                        backgroundColor: "#1565c0",
                                                    },
                                                }}
                                            >
                                                Registrar Institución
                                            </Button>
                                        </Box>
                                    </Box>
                                </form>
                            ) : (
                                // Código Generado
                                <Box sx={{ textAlign: 'center' }}>
                                    {cardCodigo()}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Modal>

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
