import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Checkbox,
    Button,
    Fade,
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
    Warning
} from "@mui/icons-material";
import { testService, type Test, type TestsByCourse } from '../../../services/testService';
import { testAssignmentService } from '../../../services/testAssignmentService';
import StyledAlert from '../../ui/StyledAlert';


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
            const userData = localStorage.getItem('user_data');

            if (userData) {
                const user = JSON.parse(userData);

                // Verificar que el usuario sea un maestro
                if (user.Rol !== 'Maestro') {
                    setError('Acceso denegado. Solo los maestros pueden acceder a esta función.');
                    setLoading(false);
                    return;
                }

                // Obtener cursos del maestro desde los datos del usuario
                const cursos = user.CURSO || [];
                setMaestroCursos(cursos);
                console.log('✅ Cursos del maestro cargados:', cursos);
            } else {
                console.log('❌ No se encontraron datos de usuario en localStorage');
                setError('No se encontraron datos de usuario. Por favor, inicia sesión nuevamente.');
            }
        } catch (error) {
            console.error('Error loading maestro data:', error);
            setError('Error al cargar los datos del maestro.');
        }
    };

    const loadTests = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await testService.getTestsByCourse();

            if (response.success) {
                // Filtrar tests según los cursos del maestro
                const filteredData = {
                    matematicas: maestroCursos.includes('Matemáticas') ? response.data.matematicas : [],
                    comunicacion: maestroCursos.includes('Comunicación y lenguaje') ? response.data.comunicacion : []
                };
                setTestsByCourse(filteredData);
                console.log('✅ Tests cargados correctamente:', filteredData);
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
            <Fade in={true} timeout={800}>
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 500,
                                color: '#1e293b',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Asignar Evaluaciones
                        </Typography>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={handleClearAllTests}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                py: 1
                            }}
                        >
                            Limpiar Tests
                        </Button>
                    </Box>

                    {/* Botón de asignar */}
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            disabled={getSelectedCount() === 0}
                            onClick={handleAssignTests}
                            startIcon={<Assignment />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                backgroundColor: getSelectedCount() > 0 ? '#3b82f6' : '#cbd5e1',
                                '&:hover': {
                                    backgroundColor: getSelectedCount() > 0 ? '#2563eb' : '#cbd5e1'
                                },
                                '&:disabled': {
                                    backgroundColor: '#cbd5e1',
                                    color: '#94a3b8'
                                }
                            }}
                        >
                            {getSelectedCount() > 0
                                ? `Asignar ${getSelectedCount()} evaluaciones seleccionadas`
                                : 'Selecciona al menos una evaluación'
                            }
                        </Button>
                    </Box>


                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {maestroCursos.length === 0 && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            No tienes cursos asignados. Contacta al administrador para asignarte cursos.
                        </Alert>
                    )}

                    {/* Tabs para seleccionar curso */}
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

                    {/* Lista de tests */}
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
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No hay tests disponibles para {currentCourse === 'matematicas' ? 'Matemáticas' : 'Comunicación'}
                                        </Typography>
                                    </Box>
                                );
                            }

                            return currentTests.map((test: Test) => (
                                <Card
                                    key={test._id}
                                    sx={{
                                        display: 'flex',
                                        borderRadius: 2,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
                                            color: currentCourse === 'matematicas' ? '#3b82f6' : '#10b981'
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
                                                    color: assignedTests.has(test._id) ? '#94a3b8' : '#334155',
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
                                                    color: '#94a3b8',
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
                                                color: assignedTests.has(test._id) ? '#e2e8f0' : '#cbd5e1',
                                                '&.Mui-checked': {
                                                    color: '#3b82f6'
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#e2e8f0'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Card>
                            ));
                        })()}
                    </Box>


                </Box>
            </Fade>

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
                                const token = localStorage.getItem('token');
                                if (!token) {
                                    showAlert(
                                        'error',
                                        'Error de Autenticación',
                                        'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.',
                                        ''
                                    );
                                    return;
                                }

                                // Obtener información del maestro autenticado
                                const userResponse = await fetch('http://localhost:3001/api/auth/verify-with-role-data', {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (!userResponse.ok) {
                                    throw new Error('Error al obtener información del usuario');
                                }

                                const userData = await userResponse.json();
                                const codigoInstitucion = userData.user.Código_Institución;

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
                                const alumnosResponse = await fetch(`http://localhost:3001/api/alumnos/institucion/${codigoInstitucion}`, {
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