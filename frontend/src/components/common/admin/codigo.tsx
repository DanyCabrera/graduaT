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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    ContentCopy as CopyIcon,
    Refresh as RefreshIcon,
    Add as AddIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { codigoAccesoService, type CodigoAcceso } from '../../../services/codigoAccesoService';

export default function Codigo() {
    const [codigosDB, setCodigosDB] = useState<CodigoAcceso[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [, setCopiedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [nuevoCodigo, setNuevoCodigo] = useState({
        codigo: '',
        tipo: 'INSTITUCION',
        descripcion: ''
    });

    // Cargar códigos existentes al inicializar
    useEffect(() => {
        cargarCodigos();
    }, []);

    const cargarCodigos = async () => {
        try {
            setLoading(true);
            const response = await codigoAccesoService.obtenerCodigos();
            if (response.success && response.data) {
                setCodigosDB(response.data);
            }
        } catch (error) {
            console.error('Error al cargar códigos:', error);
            mostrarSnackbar('Error al cargar códigos desde la base de datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const mostrarSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const generarCodigoAleatorio = () => {
        // Generar un código aleatorio de 10 caracteres alfanuméricos
        const codigo = Array(10)
            .fill(0)
            .map(() => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return chars.charAt(Math.floor(Math.random() * chars.length));
            })
            .join('');
        
        setNuevoCodigo(prev => ({
            ...prev,
            codigo: codigo
        }));
    };

    const crearCodigoEnDB = async () => {
        try {
            setLoading(true);
            const response = await codigoAccesoService.crearCodigo(nuevoCodigo);
            
            if (response.success) {
                mostrarSnackbar('Código creado exitosamente en la base de datos', 'success');
                setDialogOpen(false);
                setNuevoCodigo({ codigo: '', tipo: 'INSTITUCION', descripcion: '' });
                cargarCodigos(); // Recargar la lista
            } else {
                mostrarSnackbar(response.message || 'Error al crear el código', 'error');
            }
        } catch (error: any) {
            console.error('Error al crear código:', error);
            const errorMessage = error.message || 'Error al crear el código en la base de datos';
            mostrarSnackbar(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const registrarCodigoEspecial = async () => {
        try {
            setLoading(true);
            const codigoEspecial = {
                codigo: 'RGTBMLQWXO',
                tipo: 'INSTITUCION',
                descripcion: 'Código especial para registro de instituciones'
            };
            
            const response = await codigoAccesoService.crearCodigo(codigoEspecial);
            
            if (response.success) {
                mostrarSnackbar('Código especial RGTBMLQWXO registrado exitosamente', 'success');
                cargarCodigos(); // Recargar la lista
            } else {
                mostrarSnackbar(response.message || 'Error al registrar el código especial', 'error');
            }
        } catch (error: any) {
            console.error('Error al registrar código especial:', error);
            const errorMessage = error.message || 'Error al registrar el código especial';
            mostrarSnackbar(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const copiarCodigo = (codigo: string) => {
        navigator.clipboard.writeText(codigo);
        setCopiedCode(codigo);
        mostrarSnackbar(`Código ${codigo} copiado al portapapeles`, 'success');
    };

    const abrirDialogCrear = () => {
        setNuevoCodigo({ codigo: '', tipo: 'INSTITUCION', descripcion: '' });
        setDialogOpen(true);
    };

    const cerrarDialog = () => {
        setDialogOpen(false);
        setNuevoCodigo({ codigo: '', tipo: 'INSTITUCION', descripcion: '' });
    };

    return (
        <Box
            sx={{
                backgroundColor: "#ffffffff",
                padding: 2,
                minHeight: '100vh'
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
                                Gestiona códigos de acceso para el registro de instituciones
                            </Typography>
                        </Box>

                        {/* Botones de acción */}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                onClick={abrirDialogCrear}
                                startIcon={<AddIcon />}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "#10b981",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": {
                                        backgroundColor: "#059669",
                                    },
                                }}
                            >
                                Crear Nuevo Código
                            </Button>
                            
                            <Button
                                variant="contained"
                                onClick={registrarCodigoEspecial}
                                startIcon={<SaveIcon />}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "#3b82f6",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": {
                                        backgroundColor: "#2563eb",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : 'Registrar RGTBMLQWXO'}
                            </Button>
                            
                            <Button
                                variant="outlined"
                                onClick={cargarCodigos}
                                startIcon={<RefreshIcon />}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    borderColor: "#6b7280",
                                    color: "#6b7280",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    px: 4,
                                    py: 1.5,
                                    "&:hover": {
                                        borderColor: "#374151",
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Actualizar Lista'}
                            </Button>
                        </Box>

                        {/* Códigos de la base de datos */}
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
                                    🔑 Códigos de Acceso en Base de Datos
                                </Typography>
                                
                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : codigosDB.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                        {codigosDB.map((codigo, index) => (
                                            <Box key={codigo._id || index} sx={{ width: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(33.333% - 11px)" } }}>
                                                <Card
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: codigo.activo ? "#f0fdf4" : "#fef2f2",
                                                        border: `2px solid ${codigo.activo ? "#10b981" : "#ef4444"}`,
                                                        borderRadius: 2,
                                                        textAlign: "center",
                                                        position: "relative",
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h5"
                                                        sx={{
                                                            color: codigo.activo ? "#10b981" : "#ef4444",
                                                            fontFamily: "monospace",
                                                            letterSpacing: 1,
                                                            fontWeight: "bold",
                                                            mb: 1,
                                                            wordBreak: 'break-all'
                                                        }}
                                                    >
                                                        {codigo.codigo}
                                                    </Typography>
                                                    
                                                    <IconButton
                                                        onClick={() => copiarCodigo(codigo.codigo)}
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
                                                    
                                                    <Box sx={{ mt: 1 }}>
                                                        <Chip
                                                            label={codigo.tipo}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: codigo.activo ? "#dcfce7" : "#fecaca",
                                                                color: codigo.activo ? "#16a34a" : "#dc2626",
                                                                fontWeight: 500,
                                                                mb: 1
                                                            }}
                                                        />
                                                        {codigo.descripcion && (
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    display: 'block',
                                                                    color: "#6b7280",
                                                                    mt: 1
                                                                }}
                                                            >
                                                                {codigo.descripcion}
                                                            </Typography>
                                                        )}
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                display: 'block',
                                                                color: "#9ca3af",
                                                                mt: 1
                                                            }}
                                                        >
                                                            {new Date(codigo.fechaCreacion).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Card>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "#64748b",
                                                fontWeight: 400,
                                            }}
                                        >
                                            No hay códigos en la base de datos
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#9ca3af",
                                                mt: 1,
                                            }}
                                        >
                                            Haz clic en "Crear Nuevo Código" para agregar tu primer código
                                        </Typography>
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
                                💡 <strong>Para Administradores:</strong> Los códigos de acceso permiten el registro de instituciones en el sistema.
                                El código especial "RGTBMLQWXO" está predefinido para uso inmediato.
                            </Typography>
                        </Alert>
                    </Box>
                </Fade>
            </Container>

            {/* Dialog para crear nuevo código */}
            <Dialog open={dialogOpen} onClose={cerrarDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon />
                        Crear Nuevo Código de Acceso
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Código"
                            value={nuevoCodigo.codigo}
                            onChange={(e) => setNuevoCodigo(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                            sx={{ mb: 2 }}
                            helperText="Ingresa un código único o genera uno aleatorio"
                        />
                        
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={generarCodigoAleatorio}
                                startIcon={<RefreshIcon />}
                                sx={{ mb: 2 }}
                            >
                                Generar Código Aleatorio
                            </Button>
                        </Box>
                        
                        <TextField
                            fullWidth
                            select
                            label="Tipo de Código"
                            value={nuevoCodigo.tipo}
                            onChange={(e) => setNuevoCodigo(prev => ({ ...prev, tipo: e.target.value }))}
                            SelectProps={{ native: true }}
                            sx={{ mb: 2 }}
                        >
                            <option value="INSTITUCION">INSTITUCION</option>
                            <option value="ROL">ROL</option>
                            <option value="ADMIN">ADMIN</option>
                        </TextField>
                        
                        <TextField
                            fullWidth
                            label="Descripción (opcional)"
                            value={nuevoCodigo.descripcion}
                            onChange={(e) => setNuevoCodigo(prev => ({ ...prev, descripcion: e.target.value }))}
                            multiline
                            rows={2}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialog} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={crearCodigoEnDB}
                        variant="contained"
                        disabled={loading || !nuevoCodigo.codigo.trim()}
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                        {loading ? 'Creando...' : 'Crear Código'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
