import { API_BASE_URL } from "../../../constants";
import { MaestroPage } from './MaestroShell';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Checkbox,
    Button,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    TextField
} from '@mui/material';
import {
    Calculate,
    Chat,
    Visibility,
    Assignment,
    School,
    Close,
    Delete,
    Warning,
    Refresh
} from "@mui/icons-material";
import { testService, type Test, type TestsByCourse } from '../../../services/testService';
import { testAssignmentService } from '../../../services/testAssignmentService';
import StyledAlert from '../../ui/StyledAlert';
import { getMaestroSession } from '../../../utils/sessionManager';


interface TestProps {
    onTestsCleared?: () => void; // Callback para notificar cuando se limpian los tests
}

export default function Test({ onTestsCleared }: TestProps) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [testsByCourse, setTestsByCourse] = useState<TestsByCourse>({ matematicas: [], comunicacion: [] });
    const [selectedTests, setSelectedTests] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewDialog, setPreviewDialog] = useState(false);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [assignDialog, setAssignDialog] = useState(false);
    const [reassigning, setReassigning] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [maestroCursos, setMaestroCursos] = useState<string[]>([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertData, setAlertData] = useState({
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
        title: '',
        message: '',
        details: ''
    });
    const [clearDialog, setClearDialog] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [assignedTests, setAssignedTests] = useState<Set<string>>(new Set());

    // Cargar datos del maestro al montar el componente
    useEffect(() => {
        loadMaestroData();
        loadAssignedTests();
    }, []);

    // Cargar tests asignados
    const loadAssignedTests = async () => {
        try {
            console.log('🔄 Cargando tests asignados para el maestro...');
            const response = await testAssignmentService.getAssignedTestsForTeacher();
            console.log('📋 Respuesta del servicio de asignaciones:', response);

            if (response.success && response.data) {
                const assignedTestIds = new Set(response.data.map((assignment: any) => assignment.testId));
                console.log('✅ Tests asignados encontrados:', Array.from(assignedTestIds));
                setAssignedTests(assignedTestIds);
            } else {
                console.log('ℹ️ No hay tests asignados o error en la respuesta');
                setAssignedTests(new Set());
            }
        } catch (error) {
            console.error('❌ Error loading assigned tests:', error);
            setAssignedTests(new Set());
        }
    };

    // Cargar tests cuando se actualicen los cursos del maestro
    useEffect(() => {
        if (maestroCursos.length > 0) {
            loadTests();
        }
    }, [maestroCursos]);

    const loadMaestroData = () => {
        try {
            // Usar la sesión aislada del maestro en lugar de localStorage
            const maestroSession = getMaestroSession();
            const user = maestroSession.getCurrentUser();

            if (user) {
                // Verificar que el usuario sea un maestro
                if (user.Rol !== 'Maestro') {
                    setError('Acceso denegado. Solo los maestros pueden acceder a esta función.');
                    setLoading(false);
                    return;
                }

                const cursos = user.CURSO || [];
                setMaestroCursos(cursos);
                if (cursos.length === 0) {
                    setLoading(false);
                }
            } else {
                setError('No se encontraron datos de usuario. Por favor, inicia sesión nuevamente.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading maestro data:', error);
            setError('Error al cargar los datos del maestro.');
            setLoading(false);
        }
    };

    const loadTests = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await testService.getTestsByCourse();

            if (response.success) {
                // Función para ordenar tests por semana y luego por título
                const sortTests = (tests: Test[]) => {
                    return tests.sort((a, b) => {
                        // Primero ordenar por semana (ascendente)
                        if (a.semana !== b.semana) {
                            return a.semana - b.semana;
                        }
                        // Si tienen la misma semana, ordenar por título (alfabético)
                        return a.titulo.localeCompare(b.titulo);
                    });
                };

                // Filtrar y ordenar tests según los cursos del maestro
                const filteredData = {
                    matematicas: maestroCursos.includes('Matemáticas') ? sortTests(response.data.matematicas) : [],
                    comunicacion: maestroCursos.includes('Comunicación y lenguaje') ? sortTests(response.data.comunicacion) : []
                };
                setTestsByCourse(filteredData);
                console.log('✅ Tests cargados y ordenados correctamente:', filteredData);
            } else {
                setError('Error al cargar los tests');
            }
        } catch (error) {
            console.error('Error loading tests:', error);
            setError('Error al cargar los tests. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleTestSelect = (testId: string) => {
        setSelectedTests(prev => ({
            ...prev,
            [testId]: !prev[testId]
        }));
    };

    const handlePreviewTest = async (test: Test) => {
        try {
            // Usar directamente el test que ya tenemos en memoria
            setSelectedTest(test);
            setPreviewDialog(true);
        } catch (error) {
            console.error('Error loading test details:', error);
            setError('Error al cargar los detalles del test');
        }
    };

    const handleAssignTests = () => {
        setAssignDialog(true);
    };

    const handleReassignTests = async () => {
        try {
            setReassigning(true);
            
            // Obtener datos del maestro desde la sesión aislada
            const maestroSession = getMaestroSession();
            const user = maestroSession.getCurrentUser();
            const token = maestroSession.getCurrentToken();
            
            if (!user || !token) {
                throw new Error('No se encontraron datos de usuario en la sesión');
            }

            const codigoInstitucion = user.Código_Institución;
            if (!codigoInstitucion) {
                throw new Error('No se encontró el código de institución del maestro');
            }

            // Primero verificar si hay tests asignados en la institución
            const debugResponse = await fetch(`${API_BASE_URL}/tests/debug-assignments/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!debugResponse.ok) {
                throw new Error('Error al verificar tests asignados en la institución');
            }

            const debugData = await debugResponse.json();
            const totalAssignments = debugData.data.totalAssignments;

            if (totalAssignments === 0) {
                setAlertData({
                    type: 'warning',
                    title: 'Sin Tests Asignados',
                    message: 'No tienes tests asignados en tu institución. Primero asigna tests a tus estudiantes.',
                    details: ''
                });
                setAlertOpen(true);
                return;
            }

            // Obtener alumnos de la misma institución
            const alumnosResponse = await fetch(`${API_BASE_URL}/alumnos/institucion/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!alumnosResponse.ok) {
                throw new Error('Error al obtener los alumnos de la institución');
            }

            const alumnosData = await alumnosResponse.json();
            const alumnos = alumnosData.data || [];

            if (alumnos.length === 0) {
                setAlertData({
                    type: 'warning',
                    title: 'Sin Alumnos',
                    message: 'No hay alumnos registrados en tu institución para reasignar tests.',
                    details: ''
                });
                setAlertOpen(true);
                return;
            }

            // Verificar cuáles alumnos son nuevos (no tienen tests asignados)
            const newStudents = [];
            const existingStudents = [];

            for (const alumno of alumnos) {
                // Verificar si el alumno tiene tests asignados
                const hasAssignments = debugData.data.allAssignments.some((assignment: any) => 
                    assignment.studentIds && assignment.studentIds.includes(alumno.Usuario)
                );

                if (hasAssignments) {
                    existingStudents.push(alumno);
                } else {
                    newStudents.push(alumno);
                }
            }

            if (newStudents.length === 0) {
                setAlertData({
                    type: 'info',
                    title: 'Sin Estudiantes Nuevos',
                    message: `Todos los ${alumnos.length} estudiantes ya tienen tests asignados. No hay estudiantes nuevos para reasignar tests.`,
                    details: ''
                });
                setAlertOpen(true);
                return;
            }

            // Reasignar tests solo a los estudiantes nuevos
            let totalReassigned = 0;
            let successfulReassignments = 0;

            for (const alumno of newStudents) {
                try {
                    const reassignResponse = await fetch(`${API_BASE_URL}/tests/reassign-to-new-student`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            studentUsuario: alumno.Usuario,
                            studentInstitution: codigoInstitucion
                        })
                    });

                    if (reassignResponse.ok) {
                        const result = await reassignResponse.json();
                        if (result.data.newAssignments > 0) {
                            totalReassigned += result.data.newAssignments;
                            successfulReassignments++;
                        }
                    }
                } catch (error) {
                    console.error(`Error al reasignar tests al alumno ${alumno.Usuario}:`, error);
                }
            }

            setAlertData({
                type: 'success',
                title: 'Reasignación Completada',
                message: `Se reasignaron ${totalReassigned} tests a ${successfulReassignments} estudiantes nuevos de tu institución.`,
                details: `Estudiantes nuevos: ${newStudents.length}, Estudiantes con tests existentes: ${existingStudents.length}`
            });
            setAlertOpen(true);

        } catch (error) {
            console.error('Error al reasignar tests:', error);
            setAlertData({
                type: 'error',
                title: 'Error al Reasignar Tests',
                message: error instanceof Error ? error.message : 'Error desconocido al reasignar tests.',
                details: ''
            });
            setAlertOpen(true);
        } finally {
            setReassigning(false);
        }
    };

    const handleClosePreview = () => {
        setPreviewDialog(false);
        setSelectedTest(null);
    };

    const handleCloseAssign = () => {
        setAssignDialog(false);
    };

    const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, details?: string) => {
        setAlertData({ type, title, message, details: details || '' });
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleClearAllTests = () => {
        setClearDialog(true);
    };

    const handleCloseClearDialog = () => {
        setClearDialog(false);
    };

    const confirmClearAllTests = async () => {
        try {
            setClearing(true);

            const response = await testAssignmentService.clearAllTestAssignments();

            if (response.success) {
                // Limpiar el estado de tests asignados
                setAssignedTests(new Set());

                // Recargar los tests asignados para asegurar sincronización
                await loadAssignedTests();

                showAlert(
                    'success',
                    '¡Tests Eliminados Exitosamente!',
                    response.message || 'Los tests asignados han sido eliminados del sistema.',
                    `Se eliminaron:\n• ${response.data?.assignmentsDeleted || 0} asignaciones\n• ${response.data?.resultsDeleted || 0} resultados\n• ${response.data?.notificationsDeleted || 0} notificaciones\n• Cursos: ${response.data?.coursesCleaned || 'N/A'}`
                );
                
                // Notificar al componente padre para refrescar el historial
                if (onTestsCleared) {
                    console.log('🔄 Notificando que se limpiaron los tests...');
                    onTestsCleared();
                }
                
                handleCloseClearDialog();
            } else {
                showAlert(
                    'error',
                    'Error al Eliminar Tests',
                    'No se pudieron eliminar los tests. Por favor, inténtalo de nuevo.',
                    response.message || 'Error desconocido'
                );
            }
        } catch (error) {
            console.error('Error clearing tests:', error);
            showAlert(
                'error',
                'Error de Conexión',
                'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                error instanceof Error ? error.message : 'Error desconocido'
            );
        } finally {
            setClearing(false);
        }
    };

    const getSelectedTestsList = (): Test[] => {
        // Determinar qué curso mostrar basado en los cursos del maestro
        const availableCourses: string[] = [];
        if (maestroCursos.includes('Matemáticas')) availableCourses.push('matematicas');
        if (maestroCursos.includes('Comunicación y lenguaje')) availableCourses.push('comunicacion');

        const currentCourse = availableCourses[selectedTab] || 'matematicas';
        const currentTests = testsByCourse[currentCourse as keyof TestsByCourse];
        return currentTests.filter((test: Test) => selectedTests[test._id]);
    };

    const getSelectedCount = (): number => {
        return Object.values(selectedTests).filter(Boolean).length;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
                <MaestroPage
                    kicker="EVALUACIÓN"
                    title="Tests"
                    description="Marca las pruebas de la semana y asígnalas al grupo. Las que ya están asignadas se quedan visibles para no repetirlas."
                    meta={getSelectedCount() > 0 ? `${getSelectedCount()} seleccionadas` : 'Ninguna seleccionada'}
                    actions={
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                variant="text"
                                startIcon={<Delete />}
                                onClick={handleClearAllTests}
                                sx={{ textTransform: 'none', color: '#6D5EF6', borderRadius: '12px' }}
                            >
                                Quitar asignaciones
                            </Button>
                            <Button
                                variant="contained"
                                disableElevation
                                disabled={getSelectedCount() === 0}
                                onClick={handleAssignTests}
                                startIcon={<Assignment />}
                                sx={{
                                    textTransform: 'none',
                                    bgcolor: '#6D5EF6',
                                    color: '#ffffff',
                                    borderRadius: '12px',
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#5B4DE0' },
                                }}
                            >
                                {getSelectedCount() > 0 ? `Asignar ${getSelectedCount()}` : 'Asignar'}
                            </Button>
                        </Box>
                    }
                >


                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {!error && maestroCursos.length === 0 && (
                        <Box sx={{ bgcolor: '#ffffff', border: '1px solid #EEF0F6', borderRadius: '24px', p: 2.5 }}>
                            <Typography sx={{ fontWeight: 600, color: '#1B1B3A' }}>Todavía no hay cursos en esta cuenta</Typography>
                            <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 0.75, maxWidth: 520 }}>
                                Cuando dirección te asigne Matemáticas o Comunicación, las pruebas de cada semana aparecen aquí para marcarlas y enviarlas al grupo.
                            </Typography>
                        </Box>
                    )}

                    {maestroCursos.length > 0 && (
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                                {maestroCursos.includes('Matemáticas') && (
                                    <Tab
                                        icon={<Calculate />}
                                        label="Matemáticas"
                                        iconPosition="start"
                                        sx={{ textTransform: 'none', fontWeight: 500 }}
                                    />
                                )}
                                {maestroCursos.includes('Comunicación y lenguaje') && (
                                    <Tab
                                        icon={<Chat />}
                                        label="Comunicación"
                                        iconPosition="start"
                                        sx={{ textTransform: 'none', fontWeight: 500 }}
                                    />
                                )}
                            </Tabs>
                        </Box>
                    )}

                    {maestroCursos.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {(() => {
                            // Determinar qué curso mostrar basado en los cursos del maestro
                            const availableCourses: string[] = [];
                            if (maestroCursos.includes('Matemáticas')) availableCourses.push('matematicas');
                            if (maestroCursos.includes('Comunicación y lenguaje')) availableCourses.push('comunicacion');

                            const currentCourse = availableCourses[selectedTab] || 'matematicas';
                            const currentTests = testsByCourse[currentCourse as keyof TestsByCourse];

                            if (currentTests.length === 0) {
                                return (
                                    <Box sx={{ bgcolor: '#ffffff', border: '1px solid #EEF0F6', borderRadius: '24px', p: 2.5 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#1B1B3A' }}>
                                            No hay pruebas de {currentCourse === 'matematicas' ? 'Matemáticas' : 'Comunicación'} en esta cuenta
                                        </Typography>
                                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 0.75, maxWidth: 520 }}>
                                            Si el curso está asignado, las evaluaciones de cada semana aparecen en esta lista para marcarlas y enviarlas al grupo.
                                        </Typography>
                                    </Box>
                                );
                            }

                            return currentTests.map((test: Test) => (
                                <Card
                                    key={test._id}
                                    sx={{
                                        display: 'flex',
                                        border: '1px solid #EEF0F6',
                                        borderRadius: '22px',
                                        bgcolor: '#ffffff',
                                        boxShadow: 'none',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 2,
                                            color: currentCourse === 'matematicas' ? '#6D5EF6' : '#7A62F0'
                                        }}
                                    >
                                        <Box sx={{ fontSize: '2rem' }}>
                                            {currentCourse === 'matematicas' ? <Calculate /> : <Chat />}
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: assignedTests.has(test._id) ? '#8E93A8' : '#1B1B3A',
                                                    mb: 0.5,
                                                    textDecoration: assignedTests.has(test._id) ? 'line-through' : 'none',
                                                    opacity: assignedTests.has(test._id) ? 0.7 : 1
                                                }}
                                            >
                                                {test.titulo}
                                                {assignedTests.has(test._id) && (
                                                    <Chip
                                                        label="Asignado"
                                                        size="small"
                                                        color="success"
                                                        variant="filled"
                                                        sx={{ ml: 1, fontSize: '0.75rem' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 2,
                                                    color: '#8E93A8',
                                                    fontSize: '0.875rem',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <span>📝 {test.preguntas.length} preguntas</span>
                                                <Chip
                                                    label={`Semana ${test.semana}`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={`${test.duracion} min`}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={test.dificultad}
                                                    size="small"
                                                    color={test.dificultad === 'facil' ? 'success' : test.dificultad === 'media' ? 'warning' : 'error'}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => handlePreviewTest(test)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Ver
                                            </Button>
                                        </Box>
                                    </CardContent>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            pr: 2
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedTests[test._id] || false}
                                            onChange={() => handleTestSelect(test._id)}
                                            disabled={assignedTests.has(test._id)}
                                            sx={{
                                                color: '#C9C4F0',
                                                '&.Mui-checked': {
                                                    color: '#6D5EF6'
                                                },
                                                '&.Mui-disabled': {
                                                    color: 'rgba(142,147,168,0.45)'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Card>
                            ));
                        })()}
                    </Box>
                    )}


                </MaestroPage>

            {/* Dialog para vista previa del test */}
            <Dialog
                open={previewDialog}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <School />
                        <Box>
                            <Typography variant="h6">{selectedTest?.titulo}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedTest?.descripcion}
                            </Typography>
                        </Box>
                    </Box>
                    <Button onClick={handleClosePreview} sx={{ minWidth: 'auto', p: 1 }}>
                        <Close />
                    </Button>
                </DialogTitle>

                <DialogContent>
                    {selectedTest && (
                        <Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Chip label={`${selectedTest.preguntas.length} preguntas`} color="primary" />
                                <Chip label={`${selectedTest.duracion} minutos`} color="secondary" />
                                <Chip label={`Semana ${selectedTest.semana}`} variant="outlined" />
                            </Box>

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Preguntas del Test:
                            </Typography>

                            <List>
                                {selectedTest.preguntas.map((pregunta, index) => (
                                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                                            {index + 1}. {pregunta.nombre}
                                        </Typography>
                                        <Box sx={{ ml: 2, mb: 2 }}>
                                            {/* Mostrar la imagen de la pregunta */}
                                            <Box sx={{ mb: 2 }}>
                                                <img
                                                    src={pregunta.url}
                                                    alt={`Pregunta ${index + 1}`}
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        border: '1px solid #e0e0e0'
                                                    }}
                                                    onError={(e) => {
                                                        console.error('Error cargando imagen:', pregunta.url);
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </Box>

                                            {/* Mostrar la respuesta correcta */}
                                            <Typography
                                                variant="body2"
                                                color="primary"
                                                sx={{
                                                    fontWeight: 600,
                                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                Respuesta correcta: {pregunta.respuesta}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClosePreview}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para asignar tests */}
            <Dialog
                open={assignDialog}
                onClose={handleCloseAssign}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Assignment />
                        <Typography variant="h6">Asignar Evaluaciones</Typography>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                        Tests seleccionados:
                    </Typography>
                    <List sx={{ mb: 3 }}>
                        {getSelectedTestsList().map((test) => (
                            <ListItem key={test._id} sx={{ py: 1 }}>
                                <ListItemIcon>
                                    {test.curso === 'matematicas' ? <Calculate /> : <Chat />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={test.titulo}
                                    secondary={`${test.preguntas.length} preguntas - ${test.duracion} min - Semana ${test.semana}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            Los tests se asignarán automáticamente a todos los estudiantes de tu institución.
                        </Typography>
                    </Alert>

                    <Box sx={{ mt: 3 }}>
                        <InputLabel>Fecha de vencimiento</InputLabel>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                type="date"
                                defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: new Date().toISOString().split('T')[0] // No permitir fechas pasadas
                                }}
                                helperText="Los estudiantes tendrán hasta esta fecha para completar los tests"
                            />
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseAssign}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            try {
                                setAssigning(true);

                                // Obtener estudiantes de la misma institución del maestro
                                const maestroSession = getMaestroSession();
                                const token = maestroSession.getCurrentToken();
                                if (!token) {
                                    showAlert(
                                        'error',
                                        'Error de Autenticación',
                                        'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.',
                                        ''
                                    );
                                    return;
                                }

                                // Obtener información del maestro autenticado desde la sesión aislada
                                const user = maestroSession.getCurrentUser();
                                if (!user) {
                                    throw new Error('No se encontraron datos de usuario en la sesión');
                                }

                                const codigoInstitucion = user.Código_Institución;

                                if (!codigoInstitucion) {
                                    showAlert(
                                        'error',
                                        'Error de Institución',
                                        'No se encontró el código de institución del maestro.',
                                        ''
                                    );
                                    return;
                                }

                                // Obtener alumnos de la misma institución
                                const alumnosResponse = await fetch(`${API_BASE_URL}/alumnos/institucion/${codigoInstitucion}`, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (!alumnosResponse.ok) {
                                    throw new Error('Error al obtener los alumnos de la institución');
                                }

                                const alumnosData = await alumnosResponse.json();
                                console.log('📋 Datos de alumnos recibidos:', alumnosData);
                                const studentIds = alumnosData.data.map((alumno: any) => alumno.Usuario || alumno.usuario);
                                console.log('👥 Student IDs extraídos:', studentIds);

                                if (studentIds.length === 0) {
                                    showAlert(
                                        'warning',
                                        'Sin Estudiantes',
                                        'No hay estudiantes registrados en tu institución para asignar tests.',
                                        ''
                                    );
                                    return;
                                }

                                const selectedTests = getSelectedTestsList();
                                const testIds = selectedTests.map(test => test._id);

                                // Determinar el tipo de test basado en el curso actual
                                const availableCourses: string[] = [];
                                if (maestroCursos.includes('Matemáticas')) availableCourses.push('matematicas');
                                if (maestroCursos.includes('Comunicación y lenguaje')) availableCourses.push('comunicacion');

                                const currentCourse = availableCourses[selectedTab] || 'matematicas';
                                const testType = currentCourse as 'matematicas' | 'comunicacion';

                                // Obtener fecha de vencimiento del input
                                const dueDateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                                const dueDate = dueDateInput?.value || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                                // Validar que la fecha no sea en el pasado
                                const [year, month, day] = dueDate.split('-').map(Number);
                                const selectedDate = new Date(year, month - 1, day);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                if (selectedDate < today) {
                                    showAlert(
                                        'error',
                                        'Fecha Inválida',
                                        'La fecha de vencimiento no puede ser anterior a hoy.',
                                        ''
                                    );
                                    return;
                                }

                                // Asignar tests
                                // Crear fecha sin problemas de zona horaria (usar las mismas variables ya declaradas)
                                const fechaVencimiento = new Date(year, month - 1, day, 23, 59, 59); // Final del día
                                
                                const response = await testService.assignTestToStudents({
                                    testIds,
                                    testType,
                                    studentIds,
                                    fechaVencimiento: fechaVencimiento
                                });

                                if (response.success) {
                                    // Actualizar el estado de tests asignados
                                    const newAssignedTests = new Set(assignedTests);
                                    testIds.forEach(testId => newAssignedTests.add(testId));
                                    setAssignedTests(newAssignedTests);

                                    showAlert(
                                        'success',
                                        '¡Tests Asignados Exitosamente!',
                                        `Se han asignado ${testIds.length} test(s) a ${studentIds.length} estudiante(s) de tu institución`,
                                        `Tests asignados: ${selectedTests.map(test => test.titulo).join(', ')}\nEstudiantes: ${studentIds.length} estudiantes\nFecha de vencimiento: ${fechaVencimiento.toLocaleDateString()}`
                                    );
                                    handleCloseAssign();
                                    // Limpiar selección
                                    setSelectedTests({});
                                } else {
                                    showAlert(
                                        'error',
                                        'Error al Asignar Tests',
                                        'No se pudieron asignar los tests. Por favor, inténtalo de nuevo.',
                                        response.message || 'Error desconocido'
                                    );
                                }
                            } catch (error) {
                                console.error('Error assigning tests:', error);
                                showAlert(
                                    'error',
                                    'Error de Conexión',
                                    'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                                    error instanceof Error ? error.message : 'Error desconocido'
                                );
                            } finally {
                                setAssigning(false);
                            }
                        }}
                        disabled={assigning}
                    >
                        {assigning ? <CircularProgress size={20} /> : 'Asignar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de confirmación para limpiar tests */}
            <Dialog
                open={clearDialog}
                onClose={handleCloseClearDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Warning sx={{ color: 'error.main', fontSize: 32 }} />
                        <Typography variant="h6">Confirmar Eliminación</Typography>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        ¿Estás seguro de que quieres eliminar TODOS los tests asignados?
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            Esta acción eliminará:
                        </Typography>
                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                            <li>Todos los tests asignados a estudiantes</li>
                            <li>Todos los resultados de tests completados</li>
                            <li>Todas las notificaciones</li>
                        </ul>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Esta acción NO se puede deshacer.
                        </Typography>
                    </Alert>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseClearDialog}
                        disabled={clearing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={clearing ? <CircularProgress size={20} /> : <Delete />}
                        onClick={confirmClearAllTests}
                        disabled={clearing}
                    >
                        {clearing ? 'Eliminando...' : 'Eliminar Todo'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alerta estilizada */}
            <StyledAlert
                open={alertOpen}
                onClose={handleCloseAlert}
                type={alertData.type}
                title={alertData.title}
                message={alertData.message}
                details={alertData.details}
                showDetails={!!alertData.details}
            />
        </>
    );
}