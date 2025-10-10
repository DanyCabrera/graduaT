import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Divider
} from '@mui/material';
import {
    Book,
    Person,
    CheckCircle
} from '@mui/icons-material';

interface Maestro {
    _id: string;
    Nombre: string;
    Apellido: string;
    Usuario: string;
    CURSO: string[];
}

interface CursoInfo {
    nombre: string;
    maestros: Maestro[];
    totalMaestros: number;
}

interface CursosProps {
    userData: any;
}

export default function Cursos({ userData }: CursosProps) {
    const [cursos, setCursos] = useState<CursoInfo[]>([]);
    const [maestros, setMaestros] = useState<Maestro[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userData?.Código_Institución) {
            fetchCursosData();
        }
    }, [userData]);

    const fetchCursosData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const codigoInstitucion = userData.Código_Institución;

            // Obtener maestros
            const response = await fetch(`http://localhost:3001/api/maestros/institucion/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener los maestros: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const maestrosData = data.data || [];
            setMaestros(maestrosData);

            // Procesar cursos
            const cursosMap = new Map<string, Maestro[]>();
            
            maestrosData.forEach((maestro: Maestro) => {
                if (maestro.CURSO && Array.isArray(maestro.CURSO)) {
                    maestro.CURSO.forEach(curso => {
                        if (!cursosMap.has(curso)) {
                            cursosMap.set(curso, []);
                        }
                        cursosMap.get(curso)!.push(maestro);
                    });
                }
            });

            // Convertir a array y ordenar
            const cursosArray: CursoInfo[] = Array.from(cursosMap.entries()).map(([nombre, maestros]) => ({
                nombre,
                maestros,
                totalMaestros: maestros.length
            })).sort((a, b) => a.nombre.localeCompare(b.nombre));

            setCursos(cursosArray);

        } catch (error) {
            console.error('Error al obtener datos de cursos:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const getCursoIcon = (curso: string) => {
        const cursoLower = curso.toLowerCase();
        if (cursoLower.includes('matemática') || cursoLower.includes('matematica')) {
            return '🔢';
        } else if (cursoLower.includes('comunicación') || cursoLower.includes('comunicacion') || cursoLower.includes('lenguaje')) {
            return '📝';
        } else if (cursoLower.includes('ciencia') || cursoLower.includes('física') || cursoLower.includes('química')) {
            return '🔬';
        } else if (cursoLower.includes('historia') || cursoLower.includes('social')) {
            return '📚';
        } else if (cursoLower.includes('arte') || cursoLower.includes('música') || cursoLower.includes('dibujo')) {
            return '🎨';
        } else if (cursoLower.includes('educación física') || cursoLower.includes('deporte')) {
            return '⚽';
        } else {
            return '📖';
        }
    };

    const getCursoColor = (curso: string) => {
        const cursoLower = curso.toLowerCase();
        if (cursoLower.includes('matemática') || cursoLower.includes('matematica')) {
            return '#3b82f6';
        } else if (cursoLower.includes('comunicación') || cursoLower.includes('comunicacion') || cursoLower.includes('lenguaje')) {
            return '#10b981';
        } else if (cursoLower.includes('ciencia') || cursoLower.includes('física') || cursoLower.includes('química')) {
            return '#f59e0b';
        } else if (cursoLower.includes('historia') || cursoLower.includes('social')) {
            return '#8b5cf6';
        } else if (cursoLower.includes('arte') || cursoLower.includes('música') || cursoLower.includes('dibujo')) {
            return '#ec4899';
        } else if (cursoLower.includes('educación física') || cursoLower.includes('deporte')) {
            return '#ef4444';
        } else {
            return '#6b7280';
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                        <Book />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Cursos de la Institución
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {cursos.length} materias disponibles
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Estadísticas generales */}
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                alignItems: 'center',
                gap: 3, 
                mb: 4,
                justifyContent: { xs: 'center', sm: 'center' }
            }}>
                <Card sx={{ 
                    flex: '1 1 250px',
                    minWidth: '250px',
                    maxWidth: '300px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ 
                            bgcolor: '#f59e0b20', 
                            color: '#f59e0b',
                            width: 56,
                            height: 56,
                            mx: 'auto',
                            mb: 2
                        }}>
                            <Book />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#f59e0b', mb: 1 }}>
                            {cursos.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total de Cursos
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ 
                    flex: '1 1 250px',
                    minWidth: '250px',
                    maxWidth: '300px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ 
                            bgcolor: '#10b98120', 
                            color: '#10b981',
                            width: 56,
                            height: 56,
                            mx: 'auto',
                            mb: 2
                        }}>
                            <Person />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#10b981', mb: 1 }}>
                            {maestros.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Maestros Activos
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ 
                    flex: '1 1 250px',
                    minWidth: '250px',
                    maxWidth: '300px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Avatar sx={{ 
                            bgcolor: '#8b5cf620', 
                            color: '#8b5cf6',
                            width: 56,
                            height: 56,
                            mx: 'auto',
                            mb: 2
                        }}>
                            <CheckCircle />
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#8b5cf6', mb: 1 }}>
                            {cursos.filter(curso => curso.totalMaestros > 0).length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cursos Asignados
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Lista de cursos */}
            {cursos.length > 0 ? (
                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                    {cursos.map((curso, index) => (
                        <Card key={index} sx={{ 
                            flex: '1 1 400px',
                            minWidth: '400px',
                            maxWidth: '500px',
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
                                        bgcolor: `${getCursoColor(curso.nombre)}20`, 
                                        color: getCursoColor(curso.nombre),
                                        width: 48,
                                        height: 48,
                                        fontSize: '1.5rem'
                                    }}>
                                        {getCursoIcon(curso.nombre)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {curso.nombre}
                                        </Typography>
                                        <Chip
                                            label={`${curso.totalMaestros} maestro${curso.totalMaestros !== 1 ? 's' : ''}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ 
                                                color: getCursoColor(curso.nombre),
                                                borderColor: getCursoColor(curso.nombre)
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                                        Maestros asignados:
                                    </Typography>
                                    {curso.maestros.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {curso.maestros.map((maestro, idx) => (
                                                <Box key={idx} sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: '#f8fafc'
                                                }}>
                                                    <Person sx={{ fontSize: 16, color: '#64748b' }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {maestro.Nombre} {maestro.Apellido}
                                                    </Typography>
                                                    <Chip
                                                        label={maestro.Usuario}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ 
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.7rem',
                                                            ml: 'auto'
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            No hay maestros asignados a este curso
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Avatar sx={{ 
                            bgcolor: '#f59e0b20', 
                            color: '#f59e0b',
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 2
                        }}>
                            <Book />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No hay cursos registrados
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Los cursos aparecerán aquí una vez que los maestros tengan asignaciones
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
