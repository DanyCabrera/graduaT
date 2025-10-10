import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Avatar,
    Chip,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Search,
    School,
    Email,
    Phone
} from '@mui/icons-material';

interface Alumno {
    _id: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Usuario: string;
    Código_Institución: string;
}

interface AlumnosProps {
    userData: any;
}

export default function Alumnos({ userData }: AlumnosProps) {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (userData?.Código_Institución) {
            fetchAlumnos();
        }
    }, [userData]);

    useEffect(() => {
        // Filtrar alumnos basado en el término de búsqueda
        const filtered = alumnos.filter(alumno =>
            alumno.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alumno.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alumno.Correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alumno.Usuario.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAlumnos(filtered);
    }, [alumnos, searchTerm]);

    const fetchAlumnos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const codigoInstitucion = userData.Código_Institución;

            const response = await fetch(`http://localhost:3001/api/alumnos/institucion/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener los alumnos: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setAlumnos(data.data || []);
        } catch (error) {
            console.error('Error al obtener alumnos:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper sx={{ 
                p: 3, 
                mb: 4,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                        <School />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Gestión de Alumnos
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {filteredAlumnos.length} de {alumnos.length} estudiantes
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Barra de búsqueda */}
            <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Buscar alumnos por nombre, apellido, correo o usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {/* Tabla de alumnos */}
            <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableCell sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        #
                                    </TableCell>
                                    {['Nombre', 'Apellido', 'Correo', 'Teléfono', 'Usuario'].map((header) => (
                                        <TableCell
                                            key={header}
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                color: '#475569',
                                                borderBottom: '2px solid #e2e8f0',
                                                py: 2.5
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAlumnos.length > 0 ? (
                                    filteredAlumnos.map((alumno, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#f8fafc',
                                                    '& td': {
                                                        color: '#1e293b'
                                                    }
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            <TableCell sx={{
                                                color: '#64748b',
                                                fontSize: '0.875rem',
                                                py: 2.5
                                            }}>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell sx={{
                                                color: '#64748b',
                                                fontSize: '0.875rem',
                                                py: 2.5,
                                                fontWeight: 500
                                            }}>
                                                {alumno.Nombre}
                                            </TableCell>
                                            <TableCell sx={{ 
                                                color: '#64748b',
                                                fontSize: '0.875rem',
                                                py: 2.5,
                                                fontWeight: 500
                                            }}>
                                                {alumno.Apellido}
                                            </TableCell>
                                            <TableCell sx={{ 
                                                color: '#64748b',
                                                fontSize: '0.875rem',
                                                py: 2.5
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Email sx={{ fontSize: 16, color: '#64748b' }} />
                                                    {alumno.Correo}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ 
                                                color: '#64748b',
                                                fontSize: '0.875rem',
                                                py: 2.5
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Phone sx={{ fontSize: 16, color: '#64748b' }} />
                                                    {alumno.Teléfono}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ 
                                                color: '#64748b',
                                                fontSize: '0.875rem',
                                                py: 2.5
                                            }}>
                                                <Chip
                                                    label={alumno.Usuario}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ 
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            sx={{
                                                textAlign: 'center',
                                                py: 8,
                                                color: '#64748b'
                                            }}
                                        >
                                            {searchTerm ? 
                                                `No se encontraron alumnos que coincidan con "${searchTerm}"` :
                                                'No hay alumnos registrados en esta institución'
                                            }
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}
