import { API_BASE_URL } from "../../../constants";
import { useState, useEffect } from 'react';
import {
    Box,
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
    Chip,
    Tabs,
    Tab,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { testAssignmentService } from '../../../services/testAssignmentService';
import { getSessionToken } from '../../../utils/authUtils';
import { MaestroPage } from './MaestroShell';

interface Alumno {
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Código_Institución?: string;
    Nombre_Institución?: string;
}

interface TestResult {
    _id: string;
    studentId: string;
    testId: string;
    testType: 'matematicas' | 'comunicacion';
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    earnedPoints: number;
    totalPoints: number;
    pointsPerQuestion: number;
    submittedAt: string;
    fechaAsignacion: string;
    fechaVencimiento: string;
    studentInfo: {
        nombre: string;
        apellido: string;
        usuario: string;
    };
    testInfo: {
        titulo: string;
        semana: number;
    };
}

export default function Alumnos() {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [filteredTestResults, setFilteredTestResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingTestResults, setLoadingTestResults] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState<string>('all');

    useEffect(() => {
        fetchAlumnos();
        // Solo cargar resultados de tests cuando se necesite
        if (activeTab === 1) {
            fetchTestResults();
        }
    }, [activeTab]);

    // Filtrar resultados de tests por semana
    useEffect(() => {
        if (selectedWeek === 'all') {
            setFilteredTestResults(testResults);
        } else {
            const weekNumber = parseInt(selectedWeek);
            const filtered = testResults.filter(result => 
                result.testInfo && result.testInfo.semana === weekNumber
            );
            setFilteredTestResults(filtered);
        }
    }, [testResults, selectedWeek]);

    const fetchAlumnos = async () => {
        try {
            const token = getSessionToken() || localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            // Primero obtener la información del maestro autenticado
            const userResponse = await fetch(`${API_BASE_URL}/auth/verify-with-role-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error(`Error al obtener información del usuario: ${userResponse.status} - ${errorText}`);
            }

            const userData = await userResponse.json();

            const codigoInstitucion = userData.user.Código_Institución;

            if (!codigoInstitucion) {
                throw new Error('No se encontró el código de institución del maestro');
            }

            // Obtener alumnos de la misma institución
            const response = await fetch(`${API_BASE_URL}/alumnos/institucion/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener los alumnos de la institución: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setAlumnos(data.data || []);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const fetchTestResults = async () => {
        try {
            setLoadingTestResults(true);
            setError(null); // Limpiar errores previos
            
            const response = await testAssignmentService.getTeacherStudentTestResults();
            if (response.success) {
                setTestResults(response.data);
            } else {
                // Si hay un error de acceso denegado, mostrar mensaje apropiado
                if (response.message?.includes('Acceso denegado')) {
                    setError('No tienes permisos para acceder a esta función. Solo los maestros pueden ver los resultados de tests.');
                } else {
                    setError(response.message || 'Error al cargar los resultados de tests');
                }
            }
        } catch (error) {
            console.error('Error fetching test results:', error);
            setError('Error al cargar los resultados de tests. Verifica tu conexión.');
        } finally {
            setLoadingTestResults(false);
        }
    };


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        // Si se cambia a la pestaña de resultados de tests y no hay datos, cargarlos
        if (newValue === 1 && testResults.length === 0) {
            fetchTestResults();
        }
    };

    // Obtener semanas disponibles de los resultados de tests
    const getAvailableWeeks = () => {
        const weeks = new Set<number>();
        testResults.forEach(result => {
            if (result.testInfo && result.testInfo.semana) {
                weeks.add(result.testInfo.semana);
            }
        });
        return Array.from(weeks).sort((a, b) => a - b);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Excelente';
        if (score >= 80) return 'Bueno';
        if (score >= 70) return 'Satisfactorio';
        if (score >= 60) return 'Aceptable';
        return 'Necesita mejorar';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No disponible';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida' + error;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <MaestroPage
                kicker="GRUPO"
                title="Alumnos"
                description="Quienes están en tu institución y cómo les fue en cada evaluación."
            >
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            </MaestroPage>
        );
    }

    return (
        <MaestroPage
            kicker="GRUPO"
            title="Alumnos"
            description="Quienes están en tu institución y cómo les fue en cada evaluación."
            meta={activeTab === 0 ? `${alumnos.length} en lista` : `${testResults.length} resultados`}
            actions={activeTab === 1 ? (
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchTestResults}
                        disabled={loadingTestResults}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 1
                        }}
                    >
                        {loadingTestResults ? 'Actualizando...' : 'Actualizar'}
                    </Button>
            ) : undefined}
        >

            <Box sx={{ borderBottom: '1px solid #EEF0F6', mb: 2.5 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Lista de Alumnos" />
                    <Tab label="Resultados de Tests" />
                </Tabs>
            </Box>

            {activeTab === 0 ? (
                // Tab de Lista de Alumnos
                <TableContainer
                    component={Paper}
                    sx={{
                        boxShadow: 'none',
                        overflow: 'auto',
                        border: '1px solid #EEF0F6',
                        borderRadius: '24px',
                        bgcolor: '#ffffff'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        color: '#8E93A8',
                                        borderBottom: '1px solid #EEF0F6',
                                        backgroundColor: '#F7F6FB',
                                        py: 2.5
                                    }}
                                >
                                    No.
                                </TableCell>
                                {['Nombre', 'Apellido', 'Correo', 'Teléfono'].map((header) => (
                                    <TableCell
                                        key={header}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: '#8E93A8',
                                            borderBottom: '1px solid #EEF0F6',
                                            backgroundColor: '#F7F6FB',
                                            py: 2.5
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alumnos.length > 0 ? (
                                alumnos.map((alumno, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(109,94,246,0.05)',
                                                '& td': {
                                                    color: '#1B1B3A'
                                                }
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <TableCell sx={{
                                            color: '#3D4158',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{
                                            color: '#3D4158',
                                            fontSize: '0.875rem',
                                            py: 2.5
                                        }}>
                                            {alumno.Nombre}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {alumno.Apellido}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {alumno.Correo}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {alumno.Teléfono}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ py: 5, px: 3 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#1B1B3A' }}>El grupo todavía no aparece aquí</Typography>
                                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 0.5, maxWidth: 460 }}>
                                            Los alumnos se listan cuando pertenecen a tu misma institución. Nombre, apellido, correo y teléfono quedan en esta tabla.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                // Tab de Resultados de Tests
                <Box>
                    {loadingTestResults ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                Cargando resultados de tests...
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {/* Filtro por semana para resultados de tests */}
                            {testResults.length > 0 && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mb: 3,
                                    px: { xs: 2, sm: 4 }
                                }}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="week-filter-label-teacher">Filtrar por semana</InputLabel>
                                        <Select
                                            labelId="week-filter-label-teacher"
                                            value={selectedWeek}
                                            label="Filtrar por semana"
                                            onChange={(e) => setSelectedWeek(e.target.value)}
                                            sx={{
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.dark',
                                                },
                                            }}
                                        >
                                            <MenuItem value="all">Todas las semanas</MenuItem>
                                            {getAvailableWeeks().map((week) => (
                                                <MenuItem key={week} value={week.toString()}>
                                                    Semana {week}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}

                            <TableContainer
                                component={Paper}
                                sx={{
                                    boxShadow: 'none',
                                    overflow: 'auto',
                                    border: '1px solid #EEF0F6',
                                    borderRadius: '24px',
                                    bgcolor: '#ffffff'
                                }}
                            >
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Estudiante', 'Test asignado', 'Semana', 'Puntuación', 'Calificación', 'Respuestas', 'Fecha Asignación', 'Fecha Finalización', 'Fecha Vencimiento'].map((header) => (
                                    <TableCell
                                        key={header}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: '#8E93A8',
                                            borderBottom: '1px solid #EEF0F6',
                                            backgroundColor: '#F7F6FB',
                                            py: 2.5
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTestResults.length > 0 ? (
                                filteredTestResults.map((result, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(109,94,246,0.05)',
                                                '& td': {
                                                    color: '#1B1B3A'
                                                }
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <TableCell sx={{ color: '#3D4158', py: 2.5 }}>
                                            {result.studentInfo.nombre} {result.studentInfo.apellido}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            <Chip 
                                                label={result.testInfo.titulo}
                                                color={result.testType === 'matematicas' ? 'primary' : 'success'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            Semana {result.testInfo.semana}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            <Chip 
                                                label={`${result.score}%`}
                                                color={getScoreColor(result.score)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            <Chip 
                                                label={getScoreLabel(result.score)}
                                                color={getScoreColor(result.score)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {result.correctAnswers}/{result.totalQuestions}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {formatDate(result.fechaAsignacion)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {formatDate(result.submittedAt)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#3D4158' }}>
                                            {formatDate(result.fechaVencimiento)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : testResults.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ py: 5, px: 3 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#1B1B3A' }}>Aún no hay resultados</Typography>
                                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 0.5, maxWidth: 480 }}>
                                            Cuando asignes una evaluación y un alumno la envíe, la nota, la semana y las fechas quedan en esta tabla.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        sx={{
                                            textAlign: 'center',
                                            py: 8,
                                            color: '#3D4158'
                                        }}
                                    >
                                        No hay resultados de tests para la semana seleccionada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                        </Box>
                    )}
                </Box>
            )}

        </MaestroPage>
    );
}