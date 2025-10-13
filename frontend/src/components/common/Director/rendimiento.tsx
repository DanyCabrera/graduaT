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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    TrendingUp,
    School,
    Assessment,
    Refresh,
    AccessTime,
    CheckCircle,
    Warning,
    Error
} from '@mui/icons-material';
import { getSessionToken } from '../../../utils/authUtils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StudentPerformance {
    studentId: string;
    studentInfo: {
        nombre: string;
        apellido: string;
        correo: string;
        institucion: string;
    };
    totalTests: number;
    averageScore: number;
    minScore: number;
    maxScore: number;
    performance: 'excellent' | 'good' | 'average' | 'below_average' | 'poor' | 'unknown';
    testTypes: string[];
    lastTestDate: string;
    scores: number[];
    mathTests: number;
    mathAverage: number;
    mathScores: number[];
    communicationTests: number;
    communicationAverage: number;
    communicationScores: number[];
}

interface PerformanceSummary {
    totalStudents: number;
    studentsWithTests: number;
    overallAverage: number;
    performanceDistribution: {
        excellent: number;
        good: number;
        average: number;
        below_average: number;
        poor: number;
    };
}

interface PerformanceData {
    summary: PerformanceSummary;
    students: StudentPerformance[];
    totalResults: number;
}

interface RendimientoProps {
    userData: any;
}

export default function Rendimiento({ userData }: RendimientoProps) {
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const createError = (message: string): Error => {
        return new globalThis.Error(message);
    };

    useEffect(() => {
        console.log('🔍 [Rendimiento] Componente montado, userData:', userData);
        fetchPerformanceData();
        
        // Configurar actualización automática cada 30 segundos
        const interval = setInterval(() => {
            fetchPerformanceData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [userData]);

    const fetchPerformanceData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const token = getSessionToken() || localStorage.getItem('token');
            if (!token) {
                throw createError('No se encontró el token de autenticación');
            }

            console.log('🔍 Fetching performance data...');
            console.log('🔑 Token available:', !!token);

            const response = await fetch(`${API_BASE_URL}/test-assignments/director/performance`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Performance data obtained:', data);
                
                if (data.success && data.data) {
                    setPerformanceData(data.data);
                } else {
                    console.warn('⚠️ Response format unexpected:', data);
                    setPerformanceData(null);
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                if (response.status === 401) {
                    errorMessage = 'No autorizado. Verifique su sesión.';
                } else if (response.status === 403) {
                    errorMessage = 'Acceso denegado. Solo los directores pueden acceder a esta función.';
                } else if (response.status === 500) {
                    errorMessage = 'Error interno del servidor. Intente nuevamente.';
                }
                
                throw createError(errorMessage);
            }

            setLastUpdate(() => new Date());
            setError(null);

        } catch (error: any) {
            console.error('❌ Error al obtener datos de rendimiento:', error);
            const errorMessage = error?.message || String(error) || 'Error al cargar los datos de rendimiento estudiantil';
            setError(errorMessage);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userData]);

    const getPerformanceColor = (performance: string) => {
        switch (performance) {
            case 'excellent': return '#10b981';
            case 'good': return '#3b82f6';
            case 'average': return '#f59e0b';
            case 'below_average': return '#f97316';
            case 'poor': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getPerformanceLabel = (performance: string) => {
        switch (performance) {
            case 'excellent': return 'Excelente';
            case 'good': return 'Bueno';
            case 'average': return 'Promedio';
            case 'below_average': return 'Bajo Promedio';
            case 'poor': return 'Deficiente';
            default: return 'Sin datos';
        }
    };

    const getPerformanceIcon = (performance: string) => {
        switch (performance) {
            case 'excellent': return <CheckCircle />;
            case 'good': return <TrendingUp />;
            case 'average': return <Assessment />;
            case 'below_average': return <Warning />;
            case 'poor': return <Error />;
            default: return <School />;
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }: {
        title: string;
        value: number | string;
        icon: React.ReactNode;
        color: string;
        subtitle?: string;
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
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {subtitle}
                            </Typography>
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

    const PerformanceChart = ({ data }: { data: PerformanceSummary }) => {
        const chartData = [
            { name: 'Excelente', value: data.performanceDistribution.excellent, color: '#10b981' },
            { name: 'Bueno', value: data.performanceDistribution.good, color: '#3b82f6' },
            { name: 'Promedio', value: data.performanceDistribution.average, color: '#f59e0b' },
            { name: 'Bajo Promedio', value: data.performanceDistribution.below_average, color: '#f97316' },
            { name: 'Deficiente', value: data.performanceDistribution.poor, color: '#ef4444' }
        ];

        return (
            <Card sx={{ 
                flex: '1 1 400px',
                minWidth: '400px',
                maxWidth: '500px',
                borderRadius: 2,
                border: '1px solid #e2e8f0'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                        Rendimiento total
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ flex: 1, height: 200 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            {chartData.map((item, index) => (
                                <Box key={index} sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1, 
                                    mb: 2 
                                }}>
                                    <Box sx={{ 
                                        width: 12, 
                                        height: 12, 
                                        borderRadius: '50%', 
                                        backgroundColor: item.color 
                                    }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        ml: 'auto',
                                        color: item.color
                                    }}>
                                        {item.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
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

    if (!performanceData) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="info">No hay datos de rendimiento disponibles</Alert>
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
                            Rendimiento Estudiantil
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                            Análisis de Resultados de Tests
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
                            onClick={() => fetchPerformanceData(true)}
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

            {/* Estadísticas Generales */}
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3, 
                mb: 4,
                justifyContent: { xs: 'center', sm: 'center' }
            }}>
                <StatCard
                    title="TOTAL ESTUDIANTES"
                    value={performanceData.summary.totalStudents}
                    icon={<School />}
                    color="#3b82f6"
                    subtitle="Con resultados de tests"
                />
                <StatCard
                    title="PROMEDIO GENERAL"
                    value={`${performanceData.summary.overallAverage}%`}
                    icon={<Assessment />}
                    color="#10b981"
                    subtitle="Calificación promedio"
                />
                <StatCard
                    title="TESTS REALIZADOS"
                    value={performanceData.totalResults}
                    icon={<TrendingUp />}
                    color="#f59e0b"
                    subtitle="Total de evaluaciones"
                />
            </Box>

            {/* Gráfico de Distribución */}
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3, 
                mb: 4,
                justifyContent: { xs: 'center', sm: 'center' },
            }}>
                <PerformanceChart data={performanceData.summary} />
            </Box>

            {/* Tabla de Rendimiento por Estudiante */}
            <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar sx={{ bgcolor: '#3b82f620', color: '#3b82f6' }}>
                            <Assessment />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Rendimiento por Estudiante
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {performanceData.students.length} estudiantes evaluados
                            </Typography>
                        </Box>
                    </Box>

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
                                        Nombre
                                    </TableCell>
                                    <TableCell sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Apellido
                                    </TableCell>
                                    <TableCell align="center" sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Total Tests
                                    </TableCell>
                                    <TableCell align="center" sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Matemáticas
                                    </TableCell>
                                    <TableCell align="center" sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Comunicación
                                    </TableCell>
                                    <TableCell align="center" sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Promedio General
                                    </TableCell>
                                    <TableCell align="center" sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Rendimiento
                                    </TableCell>
                                    <TableCell align="center" sx={{ 
                                        fontWeight: 600, 
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        py: 2.5
                                    }}>
                                        Último Test
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {performanceData.students.map((student, index) => (
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
                                            py: 2.5,
                                            fontWeight: 500
                                        }}>
                                            {student.studentInfo.nombre}
                                        </TableCell>
                                        <TableCell sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5,
                                            fontWeight: 500
                                        }}>
                                            {student.studentInfo.apellido}
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5,
                                            fontWeight: 500
                                        }}>
                                            {student.totalTests}
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                                    {student.mathAverage}%
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ({student.mathTests} tests)
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                                                    {student.communicationAverage}%
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ({student.communicationTests} tests)
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: getPerformanceColor(student.performance) }}>
                                                {student.averageScore}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            <Chip
                                                icon={getPerformanceIcon(student.performance)}
                                                label={getPerformanceLabel(student.performance)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: `${getPerformanceColor(student.performance)}20`,
                                                    color: getPerformanceColor(student.performance),
                                                    border: `1px solid ${getPerformanceColor(student.performance)}40`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {student.lastTestDate ? new Date(student.lastTestDate).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}
