import { API_BASE_URL } from "../../../constants";
import { useState, useEffect, useCallback } from 'react';
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
    IconButton,
    Tooltip,
    LinearProgress
} from '@mui/material';
import {
    People,
    School,
    TrendingUp,
    Group,
    Refresh,
    AccessTime
} from '@mui/icons-material';
import { getSessionToken } from '../../../utils/authUtils';

interface DashboardStats {
    totalAlumnos: number;
    totalMaestros: number;
    totalCursos: number;
    alumnosActivos: number;
}


interface Alumno {
    _id: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Usuario: string;
    Código_Institución: string;
}

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

interface DashboardProps {
    userData: any;
}

export default function Dashboard({ userData }: DashboardProps) {
    const [stats, setStats] = useState<DashboardStats>({
        totalAlumnos: 0,
        totalMaestros: 0,
        totalCursos: 0,
        alumnosActivos: 0
    });
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [maestros, setMaestros] = useState<Maestro[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        if (userData?.Código_Institución) {
            fetchInstitutionData();
            
            // Configurar actualización automática cada 30 segundos
            const interval = setInterval(() => {
                fetchInstitutionData(true);
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [userData]);

    const fetchInstitutionData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const token = getSessionToken() || localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const codigoInstitucion = userData.Código_Institución;
            console.log('🔍 Fetching data for institution:', codigoInstitucion);
            console.log('🔑 Token available:', !!token);

            // Obtener alumnos, maestros y resultados en paralelo
            const [alumnosResponse, maestrosResponse, resultadosResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/alumnos/institucion/${codigoInstitucion}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch(`${API_BASE_URL}/maestros/institucion/${codigoInstitucion}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch(`${API_BASE_URL}/resultados/colegio/${codigoInstitucion}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            let alumnosData = [];
            let maestrosData = [];
            let resultadosData = [];

            if (alumnosResponse.ok) {
                const data = await alumnosResponse.json();
                alumnosData = data.data || [];
                setAlumnos(alumnosData);
                console.log('✅ Alumnos obtenidos:', alumnosData.length);
            } else {
                console.error('Error al obtener alumnos:', alumnosResponse.status, await alumnosResponse.text());
            }

            if (maestrosResponse.ok) {
                const data = await maestrosResponse.json();
                maestrosData = data.data || [];
                setMaestros(maestrosData);
                console.log('✅ Maestros obtenidos:', maestrosData.length);
            } else {
                console.error('Error al obtener maestros:', maestrosResponse.status, await maestrosResponse.text());
            }

            if (resultadosResponse.ok) {
                const data = await resultadosResponse.json();
                resultadosData = data.data || [];
                console.log('✅ Resultados obtenidos:', resultadosData.length);
            } else {
                console.error('Error al obtener resultados:', resultadosResponse.status, await resultadosResponse.text());
            }

            // Calcular estadísticas reales
            const cursosUnicos = new Set<string>();
            maestrosData.forEach((maestro: Maestro) => {
                if (maestro.CURSO && Array.isArray(maestro.CURSO)) {
                    maestro.CURSO.forEach(curso => cursosUnicos.add(curso));
                }
            });

            // Calcular estudiantes que realizaron tests
            const estudiantesConTests = new Set();
            resultadosData.forEach((resultado: any) => {
                if (resultado.codigoAlumno) {
                    estudiantesConTests.add(resultado.codigoAlumno);
                }
            });

            // Calcular promedio de calificaciones
            const calificaciones = resultadosData.map((r: any) => r.calificacion || 0).filter((c: number) => c > 0);
            const promedioCalificaciones = calificaciones.length > 0 
                ? (calificaciones.reduce((sum: number, cal: number) => sum + cal, 0) / calificaciones.length).toFixed(1)
                : 0;

            setStats({
                totalAlumnos: alumnosData.length,
                totalMaestros: maestrosData.length,
                totalCursos: cursosUnicos.size,
                alumnosActivos: estudiantesConTests.size
            });

            console.log('📊 Estadísticas calculadas:', {
                totalAlumnos: alumnosData.length,
                totalMaestros: maestrosData.length,
                totalCursos: cursosUnicos.size,
                alumnosConTests: estudiantesConTests.size,
                totalResultados: resultadosData.length,
                promedioCalificaciones
            });


            setLastUpdate(new Date());
            setError(null);

        } catch (error) {
            console.error('Error al obtener datos de la institución:', error);
            setError('Error al cargar los datos de la institución');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userData]);

    const StatCard = ({ title, value, icon, color, subtitle, trend }: {
        title: string;
        value: number | string;
        icon: React.ReactNode;
        color: string;
        subtitle?: string;
        trend?: { value: number; isPositive: boolean };
    }) => (
        <Card sx={{ 
            flex: '1 1 250px',
            minWidth: '250px',
            maxWidth: '300px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: color }}>
                            {value}
                        </Typography>
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <TrendingUp sx={{ 
                                    fontSize: 16, 
                                    color: trend.isPositive ? '#10b981' : '#ef4444',
                                    transform: trend.isPositive ? 'none' : 'rotate(180deg)'
                                }} />
                                <Typography variant="body2" sx={{ 
                                    color: trend.isPositive ? '#10b981' : '#ef4444',
                                    fontWeight: 500
                                }}>
                                    {trend.value}% Since last month
                                </Typography>
                            </Box>
                        )}
                        {subtitle && !trend && (
                            <Box sx={{ mt: 1 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={75.5} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: color,
                                            borderRadius: 4
                                        }
                                    }} 
                                />
                            </Box>
                        )}
                    </Box>
                    <Avatar sx={{ 
                        bgcolor: `${color}20`, 
                        color: color,
                        width: 56,
                        height: 56,
                        ml: 2
                    }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );



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
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                color: 'white',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                            Institución
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                            {userData?.Nombre_Institución || 'Institución'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                            <AccessTime sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                                Última actualización: {lastUpdate.toLocaleTimeString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Actualizar datos">
                        <IconButton 
                            onClick={() => fetchInstitutionData(true)}
                            disabled={refreshing}
                            sx={{ 
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.2)'
                                }
                            }}
                        >
                            <Refresh sx={{ 
                                animation: refreshing ? 'spin 1s linear infinite' : 'none',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Estadísticas */}
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 3, 
                mb: 4,
                justifyContent: { xs: 'center', sm: 'center' }
            }}>
                <StatCard
                    title="TOTAL ALUMNOS"
                    value={stats.totalAlumnos}
                    icon={<School />}
                    color="#3b82f6"
                    subtitle="Estudiantes registrados"
                />
                <StatCard
                    title="TOTAL MAESTROS"
                    value={stats.totalMaestros}
                    icon={<People />}
                    color="#10b981"
                    subtitle="Docentes activos"
                />
                <StatCard
                    title="CURSOS ACTIVOS"
                    value={stats.totalCursos}
                    icon={<TrendingUp />}
                    color="#8b5cf6"
                    subtitle="Materias impartidas"
                />
            </Box>

            {/* Lista de Maestros */}
            <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{ bgcolor: '#10b98120', color: '#10b981' }}>
                            <Group />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Maestros de la Institución
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {maestros.length} docentes registrados
                            </Typography>
                        </Box>
                    </Box>

                    {maestros.length > 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 2,
                            justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                            {maestros.map((maestro, index) => (
                                <Paper key={index} sx={{ 
                                    flex: '1 1 300px',
                                    minWidth: '300px',
                                    maxWidth: '400px',
                                    p: 2, 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: '#f8fafc'
                                    }
                                }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                        {maestro.Nombre} {maestro.Apellido}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {maestro.Correo}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {maestro.CURSO && Array.isArray(maestro.CURSO) ? (
                                            maestro.CURSO.map((curso, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={curso}
                                                    size="small"
                                                    variant="outlined"
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
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No hay maestros registrados en esta institución
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Lista de Alumnos */}
            <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{ bgcolor: '#3b82f620', color: '#3b82f6' }}>
                            <School />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Alumnos de la Institución
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {alumnos.length} estudiantes registrados
                            </Typography>
                        </Box>
                    </Box>

                    {alumnos.length > 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 2,
                            justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                            {alumnos.slice(0, 12).map((alumno, index) => (
                                <Paper key={index} sx={{ 
                                    flex: '1 1 300px',
                                    minWidth: '300px',
                                    maxWidth: '400px',
                                    p: 2, 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: '#f8fafc'
                                    }
                                }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                        {alumno.Nombre} {alumno.Apellido}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {alumno.Correo}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Usuario: {alumno.Usuario}
                                    </Typography>
                                </Paper>
                            ))}
                            {alumnos.length > 12 && (
                                <Box sx={{ 
                                    flex: '1 1 100%', 
                                    textAlign: 'center', 
                                    py: 2 
                                }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Y {alumnos.length - 12} alumnos más...
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            No hay alumnos registrados en esta institución
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
