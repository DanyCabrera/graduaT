import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    LinearProgress
} from '@mui/material';
import {
    Close,
    NavigateNext,
    NavigateBefore,
    Send,
    Quiz,
    Timer
} from '@mui/icons-material';
import { testAssignmentService, type TestAssignment } from '../../../services/testAssignmentService';
import StyledAlert from '../../ui/StyledAlert';

interface TestModalProps {
    open: boolean;
    onClose: () => void;
    testAssignment: TestAssignment;
    onTestCompleted?: () => void;
}

function TestModal({ open, onClose, testAssignment, onTestCompleted }: TestModalProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [testStarted, setTestStarted] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertData, setAlertData] = useState({
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
        title: '',
        message: '',
        details: ''
    });

    const test = testAssignment.test;
    const totalQuestions = test?.preguntas.length || 0;

    useEffect(() => {
        if (open && test) {
            // Inicializar el timer con la duración del test en minutos
            setTimeLeft((test.duracion || 30) * 60);
            setTestStarted(true);
            setCurrentQuestion(0);
            setAnswers({});
            setError('');
        }
    }, [open, test]);

    useEffect(() => {
        let interval: number;
        
        if (testStarted && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        // Tiempo agotado, enviar automáticamente
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [testStarted, timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmitTest = async () => {
        try {
            setSubmitting(true);
            setError('');

            const response = await testAssignmentService.submitTest(
                testAssignment.testId,
                testAssignment.testType,
                answers
            );

            if (response.success) {
                // Mostrar resultado con puntuación detallada
                const { score, correctAnswers, totalQuestions, earnedPoints, totalPoints, pointsPerQuestion } = response.data;
                showAlert(
                    'success',
                    '¡Test Completado!',
                    `Has obtenido ${score}% de puntuación`,
                    `📊 Resultados detallados:\n• Puntos obtenidos: ${earnedPoints}/${totalPoints}\n• Respuestas correctas: ${correctAnswers}/${totalQuestions}\n• Puntos por pregunta: ${pointsPerQuestion}\n• Tiempo utilizado: ${formatTime((test?.duracion || 30) * 60 - timeLeft)}`
                );
                
                // Llamar al callback para notificar que el test se completó
                if (onTestCompleted) {
                    onTestCompleted();
                }
                
                // Cerrar el modal después de un breve delay para que se vea la alerta
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError('Error al enviar el test');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
            showAlert(
                'error',
                'Error al Enviar Test',
                'No se pudo enviar el test. Verifica tu conexión.',
                error instanceof Error ? error.message : 'Error desconocido'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const getAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    const isQuestionAnswered = (questionId: string) => {
        return answers[questionId] !== undefined;
    };

    const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, details?: string) => {
        setAlertData({ type, title, message, details: details || '' });
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    if (!test) return null;

    const currentQuestionData = test.preguntas[currentQuestion];
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, minHeight: '80vh' }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                pb: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Quiz sx={{ color: 'success.main' }} />
                    <Box>
                        <Typography variant="h6">{test.titulo}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {test.descripcion}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {/* Header con información del test */}
                <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Chip 
                                icon={<Timer />}
                                label={formatTime(timeLeft)}
                                color={timeLeft < 300 ? 'error' : 'success'} // Verde para comunicación
                                variant="filled"
                            />
                            <Chip 
                                label={`${getAnsweredCount()}/${totalQuestions} respondidas`}
                                color="secondary"
                                variant="outlined"
                            />
                        </Box>
                        <Typography variant="h6" color="success.main">
                            Pregunta {currentQuestion + 1} de {totalQuestions}
                        </Typography>
                    </Box>
                    
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                {/* Stepper para navegación */}
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Stepper activeStep={currentQuestion} alternativeLabel>
                        {test.preguntas.map((_, index) => (
                            <Step key={index}>
                                <StepLabel 
                                    sx={{ 
                                        cursor: 'pointer',
                                        '& .MuiStepLabel-label': {
                                            fontSize: '0.75rem'
                                        }
                                    }}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    {isQuestionAnswered(test.preguntas[index]._id) ? '✓' : index + 1}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Contenido de la pregunta */}
                <Box sx={{ p: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        {currentQuestion + 1}. {currentQuestionData.nombre}
                    </Typography>

                    {/* Imagen de la pregunta */}
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <img 
                            src={currentQuestionData.url} 
                            alt={`Pregunta ${currentQuestion + 1}`}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '400px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0'
                            }}
                            onError={(e) => {
                                console.error('Error cargando imagen:', currentQuestionData.url);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </Box>

                    {/* Opciones de respuesta */}
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                            Selecciona tu respuesta:
                        </FormLabel>
                        <RadioGroup
                            value={answers[currentQuestionData._id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestionData._id, e.target.value)}
                        >
                            {['A', 'B', 'C', 'D'].map((option) => (
                                <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            p: 1,
                                            borderRadius: 1,
                                            backgroundColor: answers[currentQuestionData._id] === option ? '#e8f5e8' : 'transparent',
                                            border: answers[currentQuestionData._id] === option ? '2px solid #10b981' : '2px solid transparent'
                                        }}>
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 600, 
                                                color: 'success.main',
                                                minWidth: '24px',
                                                textAlign: 'center'
                                            }}>
                                                {option}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ 
                                        mb: 1,
                                        '& .MuiFormControlLabel-label': {
                                            width: '100%'
                                        }
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions sx={{ 
                p: 3, 
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa',
                justifyContent: 'space-between'
            }}>
                <Button
                    startIcon={<NavigateBefore />}
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    variant="outlined"
                >
                    Anterior
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {currentQuestion === totalQuestions - 1 ? (
                        <Button
                            variant="contained"
                            startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                            onClick={handleSubmitTest}
                            disabled={submitting || getAnsweredCount() === 0}
                            sx={{ 
                                px: 4,
                                backgroundColor: '#10b981',
                                '&:hover': {
                                    backgroundColor: '#059669'
                                }
                            }}
                        >
                            {submitting ? 'Enviando...' : 'Finalizar Test'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            endIcon={<NavigateNext />}
                            onClick={handleNextQuestion}
                            sx={{ 
                                px: 4,
                                backgroundColor: '#10b981',
                                '&:hover': {
                                    backgroundColor: '#059669'
                                }
                            }}
                        >
                            Siguiente
                        </Button>
                    )}
                </Box>
            </DialogActions>

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
        </Dialog>
    );
}

export default TestModal;
