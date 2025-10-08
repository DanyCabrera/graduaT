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
    Fade
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

export default function Matematica() {
    const [assignedTests, setAssignedTests] = useState<TestAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTest, setSelectedTest] = useState<TestAssignment | null>(null);
    const [testModalOpen, setTestModalOpen] = useState(false);

    useEffect(() => {
        loadAssignedTests();
    }, []);

    const loadAssignedTests = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await testAssignmentService.getAssignedTests();
            
            if (response.success) {
                // Filtrar solo tests de matemáticas
                const mathTests = response.data.filter(test => 
                    test.testType === 'matematicas' && test.test
                );
                setAssignedTests(mathTests);
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
        // Recargar tests después de completar uno
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
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    Matemáticas
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Tests Asignados por tu Maestro
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {assignedTests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No hay tests asignados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tu maestro aún no ha asignado tests de matemáticas
                    </Typography>
                </Box>
            ) : (
                <Fade in={true} timeout={800}>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                        gap: 3,
                        mt: 4 
                    }}>
                        {assignedTests.map((testAssignment) => (
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
                                        <Quiz sx={{ color: 'primary.main', fontSize: 32 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 0.5,
                                                    textDecoration: testAssignment.estado === 'completado' ? 'line-through' : 'none',
                                                    opacity: testAssignment.estado === 'completado' ? 0.7 : 1,
                                                    color: testAssignment.estado === 'completado' ? 'text.secondary' : 'inherit'
                                                }}
                                            >
                                                {testAssignment.test?.titulo}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {testAssignment.test?.descripcion}
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
                                            label={`${testAssignment.test?.preguntas.length} preguntas`}
                                            color="secondary"
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Chip 
                                            label={`${testAssignment.test?.duracion} min`}
                                            color="info"
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Chip 
                                            icon={getStatusIcon(testAssignment.estado)}
                                            label={testAssignment.estado.charAt(0).toUpperCase() + testAssignment.estado.slice(1)}
                                            color={getStatusColor(testAssignment.estado)}
                                            variant="filled"
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
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
                                                textDecoration: testAssignment.estado === 'completado' ? 'line-through' : 'none',
                                                opacity: testAssignment.estado === 'completado' ? 0.7 : 1,
                                                color: testAssignment.estado === 'completado' ? 'success.main' : 'inherit',
                                                borderColor: testAssignment.estado === 'completado' ? 'success.main' : 'inherit',
                                                cursor: testAssignment.estado === 'completado' ? 'not-allowed' : 'pointer'
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
                    onTestCompleted={() => {
                        console.log('🎉 Test completado, recargando lista...');
                        setTimeout(() => {
                            loadAssignedTests();
                        }, 1000); // Pequeño delay para asegurar que el backend haya procesado
                    }}
                />
            )}
        </Container>
    );
}
