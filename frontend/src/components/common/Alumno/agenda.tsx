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
    Tabs,
    Tab,
    Divider,
    Avatar
} from '@mui/material';
import {
    Assignment,
    Quiz,
    Schedule,
    CheckCircle,
    PlayArrow,
    CalendarToday,
    School,
    Timer
} from '@mui/icons-material';
import { testAssignmentService, type TestAssignment } from '../../../services/testAssignmentService';
import TestModal from '../Matematica/TestModal';

export default function Agenda() {
    const [assignedTests, setAssignedTests] = useState<TestAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTest, setSelectedTest] = useState<TestAssignment | null>(null);
    const [testModalOpen, setTestModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        loadAssignedTests();
    }, []);

    const loadAssignedTests = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Cargando tests asignados para el estudiante...');
            const response = await testAssignmentService.getAssignedTests();
            
            console.log('📋 Respuesta del servicio:', response);
            
            if (response.success) {
                console.log('✅ Tests asignados cargados:', response.data);
                setAssignedTests(response.data);
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
        setSelectedTest(test);
        setTestModalOpen(true);
    };

    const handleCloseTestModal = () => {
        setTestModalOpen(false);
        setSelectedTest(null);
        // Recargar tests después de completar uno
        loadAssignedTests();
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
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

    const getStatusText = (estado: string) => {
        switch (estado) {
            case 'asignado': return 'Pendiente';
            case 'completado': return 'Test Finalizado';
            case 'vencido': return 'Vencido';
            default: return 'Desconocido';
        }
    };

    const getSubjectIcon = (testType: string) => {
        return testType === 'matematicas' ? <School sx={{ color: '#3b82f6' }} /> : <Quiz sx={{ color: '#10b981' }} />;
    };

    const getSubjectColor = (testType: string) => {
        return testType === 'matematicas' ? '#3b82f6' : '#10b981';
    };

    const getSubjectName = (testType: string) => {
        return testType === 'matematicas' ? 'Matemáticas' : 'Comunicación';
    };

    // Filtrar tests por estado
    const pendingTests = assignedTests.filter(test => test.estado === 'asignado');
    const completedTests = assignedTests.filter(test => test.estado === 'completado');
    const allTests = assignedTests;

    const getCurrentTests = () => {
        switch (activeTab) {
            case 0: return allTests;
            case 1: return pendingTests;
            case 2: return completedTests;
            default: return allTests;
        }
    };

    const getTabLabel = (index: number) => {
        switch (index) {
            case 0: return `Todos (${allTests.length})`;
            case 1: return `Pendientes (${pendingTests.length})`;
            case 2: return `Finalizados (${completedTests.length})`;
            default: return 'Todos';
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
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    Mi Agenda de Tests
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Gestiona tus evaluaciones asignadas
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Estadísticas rápidas */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 3, 
                mb: 4 
            }}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                    <CardContent>
                        <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {allTests.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tests Asignados
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                    <CardContent>
                        <PlayArrow sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                            {pendingTests.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pendientes
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                    <CardContent>
                        <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {completedTests.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Completados
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Tabs para filtrar */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label={getTabLabel(0)} />
                    <Tab label={getTabLabel(1)} />
                    <Tab label={getTabLabel(2)} />
                </Tabs>
            </Box>

            {getCurrentTests().length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        {activeTab === 0 ? 'No hay tests asignados' : 
                         activeTab === 1 ? 'No hay tests pendientes' : 'No hay tests completados'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {activeTab === 0 ? 'Tu maestro aún no ha asignado tests' :
                         activeTab === 1 ? '¡Excelente! Has completado todos los tests pendientes' :
                         'Completa algunos tests para verlos aquí'}
                    </Typography>
                </Box>
            ) : (
                <Fade in={true} timeout={800}>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                        gap: 3 
                    }}>
                        {getCurrentTests().map((testAssignment) => (
                            <Card 
                                key={testAssignment._id}
                                sx={{ 
                                    borderRadius: 3,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    border: '1px solid #e2e8f0',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                    }
                                }}
                            >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ 
                                                bgcolor: getSubjectColor(testAssignment.testType),
                                                width: 48,
                                                height: 48
                                            }}>
                                                {getSubjectIcon(testAssignment.testType)}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {testAssignment.test?.titulo}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {getSubjectName(testAssignment.testType)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                            <Chip 
                                                icon={<Schedule />}
                                                label={`Semana ${testAssignment.test?.semana}`}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                            <Chip 
                                                icon={<Quiz />}
                                                label={`${testAssignment.test?.preguntas.length} preguntas`}
                                                color="secondary"
                                                variant="outlined"
                                                size="small"
                                            />
                                            <Chip 
                                                icon={<Timer />}
                                                label={`${testAssignment.test?.duracion} min`}
                                                color="info"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Vence: {new Date(testAssignment.fechaVencimiento).toLocaleDateString()}
                                            </Typography>
                                            <Chip 
                                                icon={getStatusIcon(testAssignment.estado)}
                                                label={getStatusText(testAssignment.estado)}
                                                color={getStatusColor(testAssignment.estado)}
                                                variant="filled"
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Button
                                            variant={testAssignment.estado === 'asignado' ? 'contained' : 'outlined'}
                                            startIcon={getStatusIcon(testAssignment.estado)}
                                            onClick={() => handleStartTest(testAssignment)}
                                            disabled={testAssignment.estado === 'completado'}
                                            fullWidth
                                            sx={{ 
                                                textTransform: 'none',
                                                borderRadius: 2,
                                                backgroundColor: testAssignment.estado === 'asignado' ? getSubjectColor(testAssignment.testType) : undefined,
                                                '&:hover': {
                                                    backgroundColor: testAssignment.estado === 'asignado' ? 
                                                        testAssignment.testType === 'matematicas' ? '#2563eb' : '#059669' : undefined
                                                }
                                            }}
                                        >
                                            {testAssignment.estado === 'asignado' ? 'Comenzar Test' : 
                                             testAssignment.estado === 'completado' ? 'Test Finalizado' : 'Vencido'}
                                        </Button>
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
                />
            )}
        </Container>
    );
}
