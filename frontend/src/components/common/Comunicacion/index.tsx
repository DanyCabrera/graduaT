import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Card, 
    CardContent, 
    Button, 
    Chip, 
    CircularProgress, 
    Alert,
    Fade,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { 
    Assignment, 
    Quiz, 
    Schedule, 
    CheckCircle,
    PlayArrow
} from "@mui/icons-material";
import { testAssignmentService, type TestAssignment } from '../../../services/testAssignmentService';
import TestModal from './TestModal';
import StyledAlert from '../../ui/StyledAlert';

export default function Comunicacion() {
    const [assignedTests, setAssignedTests] = useState<TestAssignment[]>([]);
    const [filteredTests, setFilteredTests] = useState<TestAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTest, setSelectedTest] = useState<TestAssignment | null>(null);
    const [testModalOpen, setTestModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState<string>('all');
    const [testResults, setTestResults] = useState<{
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        earnedPoints: number;
        totalPoints: number;
        pointsPerQuestion: number;
        timeUsed?: string;
    } | null>(null);

    useEffect(() => {
        loadAssignedTests();
    }, []);

    // Filtrar tests por semana
    useEffect(() => {
        if (selectedWeek === 'all') {
            setFilteredTests(assignedTests);
        } else {
            const weekNumber = parseInt(selectedWeek);
            const filtered = assignedTests.filter(test => 
                test.test && test.test.semana === weekNumber
            );
            setFilteredTests(filtered);
        }
    }, [assignedTests, selectedWeek]);

    // Evitar recargas innecesarias
    const [lastLoadTime, setLastLoadTime] = useState<number>(0);

    // Obtener semanas disponibles
    const getAvailableWeeks = () => {
        const weeks = new Set<number>();
        assignedTests.forEach(test => {
            if (test.test && test.test.semana) {
                weeks.add(test.test.semana);
            }
        });
        return Array.from(weeks).sort((a, b) => a - b);
    };

    const loadAssignedTests = async () => {
        try {
            // Evitar recargas muy frecuentes (máximo cada 5 segundos)
            const now = Date.now();
            if (now - lastLoadTime < 5000) {
                console.log('⏭️ Saltando recarga de tests de comunicación - muy reciente');
                return;
            }
            
            setLoading(true);
            setError('');
            setLastLoadTime(now);
            
            // Obtener tests asignados y resultados en paralelo
            const [testsResponse, resultsResponse] = await Promise.all([
                testAssignmentService.getAssignedTests(),
                testAssignmentService.getStudentTestResults()
            ]);
            
            if (testsResponse.success) {
                // Filtrar solo tests de comunicación
                let commTests = testsResponse.data.filter(test => 
                    test.testType === 'comunicacion' && test.test
                );
                
                // Combinar con resultados si están disponibles
                if (resultsResponse.success && resultsResponse.data.length > 0) {
                    const resultsMap = new Map();
                    resultsResponse.data.forEach((result: any) => {
                        const key = `${result.testId}_${result.testType}`;
                        resultsMap.set(key, result);
                    });
                    
                    // Agregar resultados a los tests correspondientes
                    commTests = commTests.map(test => {
                        const resultKey = `${test.testId}_${test.testType}`;
                        const result = resultsMap.get(resultKey);
                        if (result) {
                            return {
                                ...test,
                                result: {
                                    score: result.score,
                                    correctAnswers: result.correctAnswers,
                                    totalQuestions: result.totalQuestions,
                                    earnedPoints: result.earnedPoints,
                                    totalPoints: result.totalPoints,
                                    pointsPerQuestion: result.pointsPerQuestion,
                                    timeSpent: result.timeSpent,
                                    completedAt: result.completedAt
                                }
                            };
                        }
                        return test;
                    });
                }
                
                setAssignedTests(commTests);
                console.log('✅ Tests de comunicación cargados:', commTests.length);
            } else {
                setError('Error al cargar los tests asignados');
            }
        } catch (error) {
            console.error('Error loading assigned tests:', error);
            setError('Error al cargar los tests. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = (test: TestAssignment) => {
        // Verificar si el test ya está completado
        if (test.estado === 'completado') {
            console.log('⚠️ Test ya completado, no se puede abrir nuevamente');
            return;
        }
        
        setSelectedTest(test);
        setTestModalOpen(true);
    };

    const handleCloseTestModal = () => {
        setTestModalOpen(false);
        setSelectedTest(null);
    };

    const handleTestCompleted = (results?: {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        earnedPoints: number;
        totalPoints: number;
        pointsPerQuestion: number;
        timeUsed?: string;
    }) => {
        if (results) {
            setTestResults(results);
            setResultModalOpen(true);
        }
        
        // No recargar automáticamente para evitar que se cierre el modal de resultados
        console.log('🎉 Test completado');
    };

    const handleCloseResultModal = () => {
        setResultModalOpen(false);
        setTestResults(null);
        
        // Recargar la lista de tests después de cerrar el modal de resultados
        console.log('🔄 Recargando lista de tests...');
        loadAssignedTests();
    };

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'asignado': return 'primary';
            case 'completado': return 'success';
            case 'vencido': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'asignado': return <PlayArrow />;
            case 'completado': return <CheckCircle />;
            case 'vencido': return <Schedule />;
            default: return <Assignment />;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 0 }}>
            <Box sx={{ 
                textAlign: 'center', 
                mb: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1, sm: 2 }
            }}>
                <Typography variant="h3" sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main', 
                    mb: 2,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}>
                    Comunicación y Lenguaje
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                    Tests Asignados por tu Maestro
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Filtro por semana */}
            {assignedTests.length > 0 && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 3,
                    px: { xs: 2, sm: 4 }
                }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="week-filter-label-comm">Filtrar por semana</InputLabel>
                        <Select
                            labelId="week-filter-label-comm"
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

            {assignedTests.length === 0 ? (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: { xs: 4, sm: 6, md: 8 },
                    px: { xs: 2, sm: 4 },
                }}>
                    <Assignment sx={{ 
                        fontSize: { xs: 48, sm: 56, md: 64 }, 
                        color: 'text.secondary', 
                        mb: 2 
                    }} />
                    <Typography variant="h6" color="text.secondary" sx={{ 
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        No hay tests asignados
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                        Tu maestro aún no ha asignado tests de comunicación
                    </Typography>
                </Box>
            ) : filteredTests.length === 0 ? (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: { xs: 4, sm: 6, md: 8 },
                    px: { xs: 2, sm: 4 }
                }}>
                    <Assignment sx={{ 
                        fontSize: { xs: 48, sm: 56, md: 64 }, 
                        color: 'text.secondary', 
                        mb: 2 
                    }} />
                    <Typography variant="h6" color="text.secondary" sx={{ 
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        No hay tests para la semana seleccionada
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}>
                        Selecciona otra semana o "Todas las semanas" para ver más tests
                    </Typography>
                </Box>
            ) : (
                <Fade in={true} timeout={800}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { 
                            xs: '1fr', 
                            sm: 'repeat(auto-fit, minmax(300px, 1fr))',
                            md: 'repeat(auto-fit, minmax(750px, 1fr))'
                        },
                        gap: { xs: 2, sm: 3 },
                        mt: { xs: 2, sm: 3, md: 4 },
                        px: { xs: 1, sm: 2 },
                        mb: { xs: 12, sm: 12, md: 4 }
                    }}>
                        {filteredTests.map((testAssignment) => (
                            <Card 
                                key={testAssignment._id}
                                sx={{ 
                                    borderRadius: 3,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    border: '1px solid #e2e8f0',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                                        boxShadow: { xs: '0 4px 6px rgba(0,0,0,0.1)', sm: '0 8px 25px rgba(0,0,0,0.15)' }
                                    }
                                }}
                            >
                                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: { xs: 1, sm: 2 }, 
                                        mb: 2 
                                    }}>
                                        <Quiz sx={{ 
                                            color: 'success.main', 
                                            fontSize: { xs: 24, sm: 32 } 
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 0.5,
                                                    textDecoration: testAssignment.estado === 'completado' ? 'line-through' : 'none',
                                                    opacity: testAssignment.estado === 'completado' ? 0.7 : 1,
                                                    color: testAssignment.estado === 'completado' ? 'text.secondary' : 'inherit',
                                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                                }}
                                            >
                                                {testAssignment.test?.titulo}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                            }}>
                                                {testAssignment.test?.descripcion}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Mostrar resultado si el test está completado */}
                                    {testAssignment.estado === 'completado' && testAssignment.result && (
                                        <Box sx={{ 
                                            mb: 2, 
                                            p: 2, 
                                            backgroundColor: '#f0f9ff', 
                                            borderRadius: 2, 
                                            border: '1px solid #0ea5e9' 
                                        }}>
                                            <Typography variant="subtitle2" sx={{ 
                                                fontWeight: 600, 
                                                color: '#0369a1', 
                                                mb: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                <CheckCircle sx={{ fontSize: 16 }} />
                                                Resultado del Test
                                            </Typography>
                                            <Typography variant="body2" sx={{ 
                                                color: '#0369a1',
                                                fontWeight: 500
                                            }}>
                                                Puntuación: {testAssignment.result.correctAnswers}/{testAssignment.result.totalQuestions} ({testAssignment.result.score}%)
                                            </Typography>
                                            <Typography variant="caption" sx={{ 
                                                color: '#0369a1',
                                                display: 'block',
                                                mt: 0.5
                                            }}>
                                                Puntos: {testAssignment.result.earnedPoints}/{testAssignment.result.totalPoints}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ 
                                        display: 'flex', 
                                        gap: { xs: 0.5, sm: 1 }, 
                                        mb: { xs: 2, sm: 3 }, 
                                        flexWrap: 'wrap' 
                                    }}>
                                        <Chip 
                                            icon={<Schedule sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />}
                                            label={`Semana ${testAssignment.test?.semana}`}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                        />
                                        <Chip 
                                            label={`${testAssignment.test?.preguntas.length} preguntas`}
                                            color="secondary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                        />
                                        <Chip 
                                            label={`${testAssignment.test?.duracion} min`}
                                            color="info"
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                        />
                                        <Chip 
                                            icon={getStatusIcon(testAssignment.estado)}
                                            label={testAssignment.estado.charAt(0).toUpperCase() + testAssignment.estado.slice(1)}
                                            color={getStatusColor(testAssignment.estado)}
                                            variant="filled"
                                            size="small"
                                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                        />
                                    </Box>

                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: { xs: 1, sm: 0 }
                                    }}>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            textAlign: { xs: 'center', sm: 'left' }
                                        }}>
                                            Vence: {new Date(testAssignment.fechaVencimiento).toLocaleDateString()}
                                        </Typography>
                                        
                                        <Button
                                            variant={testAssignment.estado === 'asignado' ? 'contained' : 'outlined'}
                                            startIcon={getStatusIcon(testAssignment.estado)}
                                            onClick={() => handleStartTest(testAssignment)}
                                            disabled={testAssignment.estado === 'completado'}
                                            sx={{ 
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                backgroundColor: testAssignment.estado === 'asignado' ? '#10b981' : undefined,
                                                textDecoration: testAssignment.estado === 'completado' ? 'line-through' : 'none',
                                                opacity: testAssignment.estado === 'completado' ? 0.7 : 1,
                                                color: testAssignment.estado === 'completado' ? 'success.main' : 'inherit',
                                                borderColor: testAssignment.estado === 'completado' ? 'success.main' : 'inherit',
                                                cursor: testAssignment.estado === 'completado' ? 'not-allowed' : 'pointer',
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                px: { xs: 2, sm: 3 },
                                                py: { xs: 1, sm: 1.5 },
                                                '&:hover': {
                                                    backgroundColor: testAssignment.estado === 'asignado' ? '#059669' : undefined
                                                }
                                            }}
                                        >
                                            {testAssignment.estado === 'asignado' ? 'Comenzar Test' : 
                                             testAssignment.estado === 'completado' ? 'Test Finalizado' : 'Vencido'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Fade>
            )}

            {/* Modal para responder el test */}
            {selectedTest && (
                <TestModal
                    open={testModalOpen}
                    onClose={handleCloseTestModal}
                    testAssignment={selectedTest}
                    onTestCompleted={handleTestCompleted}
                />
            )}

            {/* Modal de resultados */}
            <StyledAlert
                open={resultModalOpen}
                onClose={handleCloseResultModal}
                type="success"
                title="¡Test Completado!"
                message={testResults ? `Has obtenido ${testResults.score}% de puntuación` : ''}
                details={testResults ? `📊 Resultados detallados:\n• Puntos obtenidos: ${testResults.earnedPoints}/${testResults.totalPoints}\n• Respuestas correctas: ${testResults.correctAnswers}/${testResults.totalQuestions}\n• Puntos por pregunta: ${testResults.pointsPerQuestion}${testResults.timeUsed ? `\n• Tiempo utilizado: ${testResults.timeUsed}` : ''}` : ''}
                showDetails={!!testResults}
            />
        </Container>
    );
}
