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
} from '@mui/material';
import { testAssignmentService } from '../../../services/testAssignmentService';
import { getSessionToken } from '../../../utils/authUtils';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchAlumnos();
        fetchTestResults();
        
        // Actualizar resultados de tests cada 10 segundos
        const testInterval = setInterval(fetchTestResults, 10000);
        
        return () => {
            clearInterval(testInterval);
        };
    }, []);

    const fetchAlumnos = async () => {
        try {
            const token = getSessionToken() || localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            // Primero obtener la información del maestro autenticado
            const userResponse = await fetch('http://localhost:3001/api/auth/verify-with-role-data', {
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
            const response = await fetch(`http://localhost:3001/api/alumnos/institucion/${codigoInstitucion}`, {
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
        }
    };


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
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
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: 4,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Gestión de Alumnos
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
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
                        borderRadius: 2,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        backgroundColor: '#fff',
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
                                            color: '#475569',
                                            borderBottom: '2px solid #e2e8f0',
                                            backgroundColor: '#fff',
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
                                            py: 2.5
                                        }}>
                                            {alumno.Nombre}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {alumno.Apellido}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {alumno.Correo}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {alumno.Teléfono}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        sx={{
                                            textAlign: 'center',
                                            py: 8,
                                            color: '#64748b'
                                        }}
                                    >
                                        No hay alumnos registrados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                // Tab de Resultados de Tests
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 2,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
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
                                            color: '#475569',
                                            borderBottom: '2px solid #e2e8f0',
                                            backgroundColor: '#fff',
                                            py: 2.5
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testResults.length > 0 ? (
                                testResults.map((result, index) => (
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
                                        <TableCell sx={{ color: '#64748b', py: 2.5 }}>
                                            {result.studentInfo.nombre} {result.studentInfo.apellido}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            <Chip 
                                                label={result.testInfo.titulo}
                                                color={result.testType === 'matematicas' ? 'primary' : 'success'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            Semana {result.testInfo.semana}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            <Chip 
                                                label={`${result.score}%`}
                                                color={getScoreColor(result.score)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            <Chip 
                                                label={getScoreLabel(result.score)}
                                                color={getScoreColor(result.score)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {result.correctAnswers}/{result.totalQuestions}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {formatDate(result.fechaAsignacion)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {formatDate(result.submittedAt)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>
                                            {formatDate(result.fechaVencimiento)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        sx={{
                                            textAlign: 'center',
                                            py: 8,
                                            color: '#64748b'
                                        }}
                                    >
                                        No hay resultados de tests disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

        </Box>
    );
}