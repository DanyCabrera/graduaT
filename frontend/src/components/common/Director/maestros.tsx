import { API_BASE_URL } from "../../../constants";
import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
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
    Person,
    Email,
    Phone,
    Book,
    Group
} from '@mui/icons-material';

interface Maestro {
    _id: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Usuario: string;
    CURSO: string[];
    Código_Institución: string;
}

interface MaestrosProps {
    userData: any;
}

export default function Maestros({ userData }: MaestrosProps) {
    const [maestros, setMaestros] = useState<Maestro[]>([]);
    const [filteredMaestros, setFilteredMaestros] = useState<Maestro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (userData?.Código_Institución) {
            fetchMaestros();
        }
    }, [userData]);

    useEffect(() => {
        // Filtrar maestros basado en el término de búsqueda
        const filtered = maestros.filter(maestro =>
            maestro.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            maestro.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            maestro.Correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            maestro.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (maestro.CURSO && maestro.CURSO.some(curso => 
                curso.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        );
        setFilteredMaestros(filtered);
    }, [maestros, searchTerm]);

    const fetchMaestros = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const codigoInstitucion = userData.Código_Institución;

            const response = await fetch(`${API_BASE_URL}/maestros/institucion/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener los maestros: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setMaestros(data.data || []);
        } catch (error) {
            console.error('Error al obtener maestros:', error);
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                        <Group />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Gestión de Maestros
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {filteredMaestros.length} de {maestros.length} docentes
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Barra de búsqueda */}
            <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Buscar maestros por nombre, apellido, correo, usuario o curso..."
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

            {/* Vista de tarjetas para maestros */}
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
                {filteredMaestros.length > 0 ? (
                    filteredMaestros.map((maestro, index) => (
                        <Card key={index} sx={{ 
                            flex: '1 1 350px',
                            minWidth: '350px',
                            maxWidth: '450px',
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ 
                                        bgcolor: '#10b98120', 
                                        color: '#10b981',
                                        width: 48,
                                        height: 48
                                    }}>
                                        <Person />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {maestro.Nombre} {maestro.Apellido}
                                        </Typography>
                                        <Chip
                                            label={maestro.Usuario}
                                            size="small"
                                            variant="outlined"
                                            sx={{ 
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Email sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {maestro.Correo}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {maestro.Teléfono}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Book sx={{ fontSize: 16, color: '#64748b' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Cursos asignados:
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {maestro.CURSO && Array.isArray(maestro.CURSO) && maestro.CURSO.length > 0 ? (
                                            maestro.CURSO.map((curso, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={curso}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ fontSize: '0.75rem' }}
                                                />
                                            ))
                                        ) : (
                                            <Chip
                                                label="Sin cursos asignados"
                                                size="small"
                                                variant="outlined"
                                                color="default"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Box sx={{ 
                        flex: '1 1 100%', 
                        display: 'flex', 
                        justifyContent: 'center' 
                    }}>
                        <Card sx={{ 
                            borderRadius: 2, 
                            border: '1px solid #e2e8f0',
                            maxWidth: '600px',
                            width: '100%'
                        }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    {searchTerm ? 
                                        `No se encontraron maestros que coincidan con "${searchTerm}"` :
                                        'No hay maestros registrados en esta institución'
                                    }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {searchTerm ? 
                                        'Intenta con otros términos de búsqueda' :
                                        'Los maestros aparecerán aquí una vez que se registren'
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
