import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    Tooltip,
    Snackbar,
    MenuItem
} from '@mui/material';
import {
    School,
    Refresh,
    CheckCircle,
    Cancel,
    Search,
    ContentCopy
} from '@mui/icons-material';

interface Institucion {
    _id: string;
    Nombre_Completo: string;
    Correo: string;
    Dirección: string;
    Teléfono: string;
    DEPARTAMENTO: string;
    Código_Institución: string;
    Código_Alumno: string;
    Código_Director: string;
    Código_Maestro: string;
    Código_Supervisor: string;
    fechaCreacion: string;
    emailVerificado: boolean;
    habilitado: boolean;
}

interface TablaCodigosProps {
    instituciones: Institucion[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
}

export default function TablaCodigos({ instituciones, loading, error, onRefresh }: TablaCodigosProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('todos');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setSnackbarMessage('Código copiado al portapapeles');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error al copiar:', error);
            setSnackbarMessage('Error al copiar el código');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Función para generar datos de códigos
    const getCodigosData = () => {
        const codigosData: Array<{
            id: string;
            institucion: string;
            rol: string;
            codigo: string;
            habilitado: boolean;
            departamento: string;
        }> = [];

        instituciones.forEach(inst => {
            const roles = [
                { nombre: 'Institución', codigo: inst.Código_Institución },
                { nombre: 'Supervisor', codigo: inst.Código_Supervisor },
                { nombre: 'Director', codigo: inst.Código_Director },
                { nombre: 'Maestro', codigo: inst.Código_Maestro },
                { nombre: 'Alumno', codigo: inst.Código_Alumno }
            ];

            roles.forEach(rol => {
                codigosData.push({
                    id: `${inst._id}-${rol.nombre}`,
                    institucion: inst.Nombre_Completo,
                    rol: rol.nombre,
                    codigo: rol.codigo,
                    habilitado: inst.habilitado,
                    departamento: inst.DEPARTAMENTO
                });
            });
        });

        return codigosData;
    };

    // Filtrar códigos
    const getFilteredCodigos = () => {
        let codigos = getCodigosData();

        // Filtrar por rol
        if (filterRole !== 'todos') {
            codigos = codigos.filter(c => c.rol.toLowerCase() === filterRole.toLowerCase());
        }

        // Filtrar por término de búsqueda
        if (searchTerm) {
            codigos = codigos.filter(c => 
                c.institucion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.departamento.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return codigos;
    };

    return (
        <Card
            sx={{
                borderRadius: 3
            }}
        >
            <CardContent
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Códigos de Instituciones
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        Actualizar
                    </Button>
                </Box>

                {/* Filtros y búsqueda */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Buscar por institución, código o departamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{ minWidth: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        select
                        label="Filtrar por rol"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="todos">Todos los roles</MenuItem>
                        <MenuItem value="institución">Institución</MenuItem>
                        <MenuItem value="supervisor">Supervisor</MenuItem>
                        <MenuItem value="director">Director</MenuItem>
                        <MenuItem value="maestro">Maestro</MenuItem>
                        <MenuItem value="alumno">Alumno</MenuItem>
                    </TextField>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : getFilteredCodigos().length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <School sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {searchTerm || filterRole !== 'todos' 
                                ? 'No se encontraron códigos con los filtros aplicados'
                                : 'No hay códigos disponibles'
                            }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchTerm || filterRole !== 'todos' 
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'Los códigos aparecerán aquí una vez que se registren instituciones'
                            }
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Institución</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getFilteredCodigos().map((codigo) => (
                                    <TableRow key={codigo.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {codigo.institucion}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={codigo.departamento} 
                                                size="small" 
                                                variant="outlined"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={codigo.rol}
                                                size="small"
                                                color={
                                                    codigo.rol === 'Institución' ? 'primary' :
                                                    codigo.rol === 'Supervisor' ? 'secondary' :
                                                    codigo.rol === 'Director' ? 'success' :
                                                    codigo.rol === 'Maestro' ? 'warning' : 'info'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontFamily: 'monospace', 
                                                    fontWeight: 'bold',
                                                    color: '#1976d2',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {codigo.codigo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={codigo.habilitado ? <CheckCircle /> : <Cancel />}
                                                label={codigo.habilitado ? "Habilitada" : "Deshabilitada"}
                                                color={codigo.habilitado ? "success" : "error"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Copiar código">
                                                <Button
                                                    size="small"
                                                    onClick={() => copyToClipboard(codigo.codigo)}
                                                    color="primary"
                                                    startIcon={<ContentCopy />}
                                                >
                                                    Copiar
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Información de resumen */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Total de códigos mostrados:</strong> {getFilteredCodigos().length} de {getCodigosData().length} códigos
                        {filterRole !== 'todos' && ` (filtrado por rol: ${filterRole})`}
                        {searchTerm && ` (búsqueda: "${searchTerm}")`}
                    </Typography>
                </Box>

                {/* Snackbar para notificaciones */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                />
            </CardContent>
        </Card>
    );
}
