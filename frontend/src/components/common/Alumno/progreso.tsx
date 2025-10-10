import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar
} from '@mui/material';
import {
    Quiz,
    CheckCircle,
    Schedule,
    School,
    EmojiEvents,
    Assessment
} from '@mui/icons-material';
import { testAssignmentService, type TestAssignment } from '../../../services/testAssignmentService';


export default function Progreso() {
    const [assignedTests, setAssignedTests] = useState<TestAssignment[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProgressData();
    }, []);

    // Evitar recargas innecesarias
    const [lastLoadTime, setLastLoadTime] = useState<number>(0);

    const loadProgressData = async () => {
        try {
            // Evitar recargas muy frecuentes (máximo cada 5 segundos)
            const now = Date.now();
            if (now - lastLoadTime < 5000) {
                console.log('⏭️ Saltando recarga - muy reciente');
                return;
            }
            
            setLoading(true);
            setError('');
            setLastLoadTime(now);
            console.log('🔄 Cargando datos de progreso...');
            
            // Cargar tests asignados
            console.log('📋 Cargando tests asignados...');
            const assignmentsResponse = await testAssignmentService.getAssignedTests();
            console.log('📋 Respuesta de tests asignados:', assignmentsResponse);
            if (assignmentsResponse.success) {
                setAssignedTests(assignmentsResponse.data);
            }

            // Cargar resultados de tests
            console.log('📊 Cargando resultados de tests...');
            const resultsResponse = await testAssignmentService.getStudentTestResults();
            console.log('📊 Respuesta de resultados:', resultsResponse);
            if (resultsResponse.success) {
                setTestResults(resultsResponse.data);
            }
            
        } catch (error) {
            console.error('❌ Error loading progress data:', error);
            setError('Error al cargar los datos de progreso');
        } finally {
            setLoading(false);
        }
    };

    // Calcular estadísticas
    const totalTests = assignedTests.length;
    const completedTests = testResults.length; // Tests con resultados = tests completados
    const pendingTests = totalTests - completedTests;
    const completionRate = totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;
    
    // Calcular promedio de puntuación (cada pregunta vale 2 puntos)
    const averageScore = testResults.length > 0 
        ? Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
        : 0;
    
    // Calcular promedio por materia
    const mathResults = testResults.filter(result => result.testType === 'matematicas');
    const commResults = testResults.filter(result => result.testType === 'comunicacion');
    
    const mathAverage = mathResults.length > 0 
        ? Math.round(mathResults.reduce((sum, result) => sum + result.score, 0) / mathResults.length)
        : 0;
    
    const commAverage = commResults.length > 0 
        ? Math.round(commResults.reduce((sum, result) => sum + result.score, 0) / commResults.length)
        : 0;

    // Obtener tests por materia
    const mathTests = assignedTests.filter(test => test.testType === 'matematicas');
    const commTests = assignedTests.filter(test => test.testType === 'comunicacion');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Cargando progreso...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 2 } }}>
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                    fontWeight: 'bold', 
                    color: '#1e293b',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}>
                    Progreso
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                    Aquí puedes ver tu progreso en los tests asignados
                </Typography>
            </Box>

            {/* Estadísticas Generales */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: { xs: 2, sm: 3 },
                mb: { xs: 3, sm: 4 },
            }}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                        <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            mx: 'auto', 
                            mb: 2,
                            width: { xs: 40, sm: 56 },
                            height: { xs: 40, sm: 56 }
                        }}>
                            <Quiz sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                        </Avatar>
                        <Typography variant="h4" component="div" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}>
                            {totalTests}
                        </Typography>
                        <Typography color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Tests Asignados
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                        <Avatar sx={{ 
                            bgcolor: 'success.main', 
                            mx: 'auto', 
                            mb: 2,
                            width: { xs: 40, sm: 56 },
                            height: { xs: 40, sm: 56 }
                        }}>
                            <CheckCircle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                        </Avatar>
                        <Typography variant="h4" component="div" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}>
                            {completedTests}
                        </Typography>
                        <Typography color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Tests Completados
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                        <Avatar sx={{ 
                            bgcolor: 'warning.main', 
                            mx: 'auto', 
                            mb: 2,
                            width: { xs: 40, sm: 56 },
                            height: { xs: 40, sm: 56 }
                        }}>
                            <Schedule sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                        </Avatar>
                        <Typography variant="h4" component="div" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}>
                            {pendingTests}
                        </Typography>
                        <Typography color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Tests Pendientes
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                        <Avatar sx={{ 
                            bgcolor: 'success.main', 
                            mx: 'auto', 
                            mb: 2,
                            width: { xs: 40, sm: 56 },
                            height: { xs: 40, sm: 56 }
                        }}>
                            <EmojiEvents sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                        </Avatar>
                        <Typography variant="h4" component="div" sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}>
                            {averageScore}%
                        </Typography>
                        <Typography color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                            Puntaje Promedio
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Barra de Progreso General */}
            <Card sx={{ mb: { xs: 3, sm: 4 } }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                        <Assessment sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                        Progreso General
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 1, sm: 2 }, 
                        mb: 1 
                    }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={completionRate} 
                            sx={{ 
                                flexGrow: 1, 
                                height: { xs: 6, sm: 8 }, 
                                borderRadius: 4 
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            minWidth: 'fit-content'
                        }}>
                            {completedTests}/{totalTests}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                        Has completado {completedTests} de {totalTests} tests asignados
                    </Typography>
                </CardContent>
            </Card>

            {/* Progreso por Materia */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: { xs: 2, sm: 3 },
                mb: { xs: 3, sm: 4 } 
            }}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                            <School sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                            Matemáticas
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Progreso
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    {mathTests.filter(t => t.estado === 'completado').length}/{mathTests.length}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={mathTests.length > 0 ? (mathTests.filter(t => t.estado === 'completado').length / mathTests.length) * 100 : 0}
                                sx={{ height: { xs: 4, sm: 6 }, borderRadius: 3 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Promedio:
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    fontWeight: 600, 
                                    color: mathAverage >= 80 ? 'success.main' : mathAverage >= 60 ? 'warning.main' : 'error.main',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}>
                                    {mathAverage}%
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {mathTests.map((test, index) => (
                                <Chip
                                    key={index}
                                    label={`Semana ${test.test?.semana || 'N/A'}`}
                                    size="small"
                                    color={test.estado === 'completado' ? 'success' : 'default'}
                                    variant={test.estado === 'completado' ? 'filled' : 'outlined'}
                                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}>
                            <School sx={{ color: 'secondary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                            Comunicación
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Progreso
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    {commTests.filter(t => t.estado === 'completado').length}/{commTests.length}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={commTests.length > 0 ? (commTests.filter(t => t.estado === 'completado').length / commTests.length) * 100 : 0}
                                sx={{ height: { xs: 4, sm: 6 }, borderRadius: 3 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Promedio:
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    fontWeight: 600, 
                                    color: commAverage >= 80 ? 'success.main' : commAverage >= 60 ? 'warning.main' : 'error.main',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}>
                                    {commAverage}%
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {commTests.map((test, index) => (
                                <Chip
                                    key={index}
                                    label={`Semana ${test.test?.semana || 'N/A'}`}
                                    size="small"
                                    color={test.estado === 'completado' ? 'success' : 'default'}
                                    variant={test.estado === 'completado' ? 'filled' : 'outlined'}
                                    sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Lista de Tests */}
            <Card
                sx={{
                    mb: { xs: 10, sm: 10, md: 4 }
                }}
            >
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEvents />
                        Historial de Tests
                    </Typography>
                    
                    {assignedTests.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <School sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No hay tests asignados
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tu maestro aún no te ha asignado ningún test.
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {assignedTests.map((test, index) => {
                                // Buscar el resultado de este test
                                const testResult = testResults.find(result => 
                                    result.testId === test.testId && result.testType === test.testType
                                );

                                return (
                                    <div key={index}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Avatar sx={{ 
                                                    bgcolor: test.testType === 'matematicas' ? 'primary.main' : 'secondary.main',
                                                    width: 40,
                                                    height: 40
                                                }}>
                                                    <Quiz />
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle1">
                                                            {test.test?.titulo || 'Test sin título'}
                                                        </Typography>
                                                        <Chip
                                                            label={test.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación'}
                                                            size="small"
                                                            color={test.testType === 'matematicas' ? 'primary' : 'secondary'}
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {test.test?.preguntas?.length || 0} preguntas
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                            <Chip
                                                                icon={testResult ? <CheckCircle /> : <Schedule />}
                                                                label={testResult ? 'Completado' : 'Pendiente'}
                                                                size="small"
                                                                color={testResult ? 'success' : 'warning'}
                                                                variant="filled"
                                                            />
                                                            {testResult && (
                                                                <Chip
                                                                    label={`${testResult.score}%`}
                                                                    size="small"
                                                                    color={testResult.score >= 80 ? 'success' : testResult.score >= 60 ? 'warning' : 'error'}
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < assignedTests.length - 1 && <Divider />}
                                    </div>
                                );
                            })}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}