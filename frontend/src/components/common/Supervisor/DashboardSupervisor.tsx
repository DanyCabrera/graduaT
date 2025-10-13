import { API_BASE_URL } from "../../../constants";
import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Button,
} from '@mui/material';
import {
    School,
    TrendingUp,
    TrendingDown,
    People,
    Assessment,
    Refresh,
    Business
} from '@mui/icons-material';

interface Institucion {
    _id: string;
    Nombre_Completo: string;
    Correo: string;
    Dirección: string;
    Teléfono: string;
    DEPARTAMENTO: string;
    Código_Institución: string;
    fechaCreacion: string;
    emailVerificado: boolean;
    habilitado: boolean;
}

interface RendimientoInstitucion {
    institucionId: string;
    nombreInstitucion: string;
    totalEstudiantes: number;
    totalMaestros: number;
    totalCursos: number;
    promedioRendimiento: number;
    tendencia: 'up' | 'down' | 'stable';
}

interface DashboardSupervisorProps {
    userData: any;
}

export default function DashboardSupervisor({ userData }: DashboardSupervisorProps) {
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [rendimiento, setRendimiento] = useState<RendimientoInstitucion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [promedioGeneralDepartamento, setPromedioGeneralDepartamento] = useState<number>(0);

    useEffect(() => {
        if (userData?.DEPARTAMENTO) {
            cargarInstitucionesDepartamento();
        }
    }, [userData]);

    const cargarInstitucionesDepartamento = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('📍 Departamento del supervisor:', userData.DEPARTAMENTO);
            console.log('👤 Datos completos del usuario:', userData);

            // Usar el nuevo endpoint de rendimiento (similar al Director)
            const response = await fetch(`${API_BASE_URL}/supervisor-stats/performance-stats/${encodeURIComponent(userData.DEPARTAMENTO)}`);
            const result = await response.json();

            if (result.success) {
                console.log('📊 Estadísticas obtenidas del backend:', result.data);
                console.log('📈 Resumen del departamento:', result.data.summary);

                // Extraer instituciones y rendimiento de la respuesta
                const institucionesData = result.data.instituciones.map((stat: any) => ({
                    _id: stat.institucionId,
                    Nombre_Completo: stat.nombreInstitucion,
                    Código_Institución: stat.codigoInstitucion,
                    DEPARTAMENTO: userData.DEPARTAMENTO
                }));

                const rendimientoData = result.data.instituciones.map((stat: any) => ({
                    institucionId: stat.institucionId,
                    nombreInstitucion: stat.nombreInstitucion,
                    totalEstudiantes: stat.totalEstudiantes,
                    totalMaestros: stat.totalMaestros,
                    totalCursos: stat.totalCursos,
                    promedioRendimiento: stat.promedioRendimiento,
                    tendencia: stat.tendencia,
                    totalResultados: stat.totalResultados
                }));

                console.log('🏫 Instituciones procesadas:', institucionesData);
                console.log('📈 Rendimiento procesado:', rendimientoData);

                setInstituciones(institucionesData);
                setRendimiento(rendimientoData);

                // Guardar el promedio general del departamento para mostrarlo en el dashboard
                if (result.data.summary.overallAverage !== undefined) {
                    setPromedioGeneralDepartamento(result.data.summary.overallAverage);
                    console.log('✅ Promedio general del departamento guardado:', result.data.summary.overallAverage);
                }
            } else {
                setError('Error al cargar las estadísticas de instituciones');
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            setError('Error de conexión al cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };


    const getTendenciaIcon = (tendencia: string) => {
        switch (tendencia) {
            case 'up':
                return <TrendingUp color="success" />;
            case 'down':
                return <TrendingDown color="error" />;
            default:
                return <Assessment color="info" />;
        }
    };

    const getTendenciaColor = (tendencia: string) => {
        switch (tendencia) {
            case 'up':
                return 'success';
            case 'down':
                return 'error';
            default:
                return 'info';
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
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        );
    }

    const totalInstituciones = instituciones.length;
    const totalEstudiantes = rendimiento.reduce((sum, inst) => sum + inst.totalEstudiantes, 0);
    const totalMaestros = rendimiento.reduce((sum, inst) => sum + inst.totalMaestros, 0);

    // Usar el promedio general del departamento calculado en el backend
    const promedioGeneral = promedioGeneralDepartamento > 0 ? promedioGeneralDepartamento :
        (rendimiento.length > 0
            ? rendimiento.reduce((sum, inst) => sum + inst.promedioRendimiento, 0) / rendimiento.length
            : 0);

    console.log('📊 Cálculos de totales:', {
        totalInstituciones,
        totalEstudiantes,
        totalMaestros,
        promedioGeneral,
        rendimientoLength: rendimiento.length
    });

    return (
        <Box>
            {/* Estadísticas Generales */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                    <Card sx={{
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                                        {totalInstituciones}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        Instituciones
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#f3f4f6', color: '#374151' }}>
                                    <School />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                    <Card sx={{
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                                        {totalEstudiantes}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        Estudiantes
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#f3f4f6', color: '#374151' }}>
                                    <People />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                    <Card sx={{
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                                        {totalMaestros}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        Maestros
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#f3f4f6', color: '#374151' }}>
                                    <Business />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                    <Card sx={{
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                                        {promedioGeneral.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        Promedio General
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#f3f4f6', color: '#374151' }}>
                                    <Assessment />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Información del Departamento */}
            <Card sx={{
                mb: 4,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: '#1f2937' }}>
                            <Business sx={{ color: '#6b7280' }} />
                            Departamento: {userData?.DEPARTAMENTO}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={cargarInstitucionesDepartamento}
                            disabled={loading}
                            sx={{
                                borderColor: '#d1d5db',
                                color: '#374151',
                                '&:hover': {
                                    borderColor: '#9ca3af',
                                    bgcolor: '#f9fafb'
                                }
                            }}
                        >
                            Actualizar
                        </Button>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Supervisando {totalInstituciones} instituciones en el departamento de {userData?.DEPARTAMENTO}
                    </Typography>
                </CardContent>
            </Card>

            {/* Tabla de Rendimiento en Tests por Institución */}
            <Card sx={{
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1f2937' }}>
                        Rendimiento en Tests por Institución
                    </Typography>

                    {rendimiento.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <School sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#6b7280' }}>
                                No hay datos de rendimiento en tests disponibles
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                                Los datos aparecerán aquí una vez que las instituciones tengan tests realizados
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ border: '1px solid #e5e7eb' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Institución</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Total Estudiantes</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Total Maestros</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Total Cursos</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Rendimiento en Tests</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Tendencia</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rendimiento.map((inst) => (
                                        <TableRow key={inst.institucionId} hover>
                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                    {inst.nombreInstitucion}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {inst.totalEstudiantes}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {inst.totalMaestros}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {inst.totalCursos}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: inst.promedioRendimiento >= 80 ? '#059669' :
                                                                inst.promedioRendimiento >= 70 ? '#d97706' :
                                                                    inst.promedioRendimiento >= 60 ? '#ca8a04' : '#dc2626'
                                                        }}
                                                    >
                                                        {inst.promedioRendimiento > 0 ? `${inst.promedioRendimiento.toFixed(1)}%` : 'Sin datos'}
                                                    </Typography>
                                                    {inst.promedioRendimiento > 0 && (
                                                        <Chip
                                                            label={inst.promedioRendimiento >= 80 ? 'Excelente' :
                                                                inst.promedioRendimiento >= 70 ? 'Bueno' :
                                                                    inst.promedioRendimiento >= 60 ? 'Regular' : 'Bajo'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: inst.promedioRendimiento >= 80 ? '#f0fdf4' :
                                                                    inst.promedioRendimiento >= 70 ? '#fffbeb' :
                                                                        inst.promedioRendimiento >= 60 ? '#fefce8' : '#fef2f2',
                                                                color: inst.promedioRendimiento >= 80 ? '#059669' :
                                                                    inst.promedioRendimiento >= 70 ? '#d97706' :
                                                                        inst.promedioRendimiento >= 60 ? '#ca8a04' : '#dc2626',
                                                                border: `1px solid ${inst.promedioRendimiento >= 80 ? '#bbf7d0' :
                                                                    inst.promedioRendimiento >= 70 ? '#fed7aa' :
                                                                        inst.promedioRendimiento >= 60 ? '#fde68a' : '#fecaca'}`
                                                            }}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getTendenciaIcon(inst.tendencia)}
                                                    <Chip
                                                        label={inst.tendencia === 'up' ? 'Mejorando' : inst.tendencia === 'down' ? 'Bajando' : 'Estable'}
                                                        color={getTendenciaColor(inst.tendencia)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
