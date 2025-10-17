import {
    Box,
    Typography,
    Button,
    Container,
    Divider,
    Paper,
    CircularProgress,
    Alert,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar
} from "@mui/material";
import { getMaestroSession } from '../../../utils/sessionManager';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Masonry from '@mui/lab/Masonry';
import { useState, useEffect } from 'react';
import { agendaService, type AgendaSemana, type EstructuraTema } from '../../../services/agendaService';

export default function Agenda() {
    const [agenda, setAgenda] = useState<AgendaSemana[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [generating, setGenerating] = useState<boolean>(false);
    const [siguienteSemana, setSiguienteSemana] = useState<number>(1);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedWeek, setSelectedWeek] = useState<AgendaSemana | null>(null);
    const [limiteAlcanzado, setLimiteAlcanzado] = useState<boolean>(false);
    
    // Estados para el modal de estructura de tema
    const [estructuraModalOpen, setEstructuraModalOpen] = useState<boolean>(false);
    const [selectedTema, setSelectedTema] = useState<{ titulo: string; materia: string } | null>(null);
    const [estructuraTema, setEstructuraTema] = useState<EstructuraTema | null>(null);
    const [generandoEstructura, setGenerandoEstructura] = useState<boolean>(false);
    const [errorEstructura, setErrorEstructura] = useState<string>('');

    // Cargar agenda inicial desde localStorage o vacía
    useEffect(() => {
        const loadSavedAgenda = () => {
            try {
                // Obtener datos del usuario desde la sesión aislada
                const maestroSession = getMaestroSession();
                const user = maestroSession.getCurrentUser();
                if (!user) {
                    setLoading(false);
                    return;
                }

                const userKey = user.Usuario || user.email || 'unknown';


                const savedAgenda = localStorage.getItem(`maestro_agenda_${userKey}`);
                const savedSiguienteSemana = localStorage.getItem(`maestro_siguiente_semana_${userKey}`);

                if (savedAgenda && savedSiguienteSemana) {
                    setAgenda(JSON.parse(savedAgenda));
                    setSiguienteSemana(parseInt(savedSiguienteSemana));
                } else {
                    console.log('📂 No hay agenda guardada para el usuario:', userKey, '- Usuario nuevo o primera vez');
                }
            } catch (error) {
                console.error('Error loading saved agenda:', error);
            }
        };

        loadSavedAgenda();
        setLoading(false);
    }, []);

    // Función para guardar la agenda en localStorage
    const saveAgendaToStorage = (agendaData: AgendaSemana[], siguienteSemanaData: number) => {
        try {
            // Obtener datos del usuario desde la sesión aislada
            const maestroSession = getMaestroSession();
            const user = maestroSession.getCurrentUser();
            if (!user) {
                return;
            }

            const userKey = user.Usuario || user.email || 'unknown';

            localStorage.setItem(`maestro_agenda_${userKey}`, JSON.stringify(agendaData));
            localStorage.setItem(`maestro_siguiente_semana_${userKey}`, siguienteSemanaData.toString());
        } catch (error) {
            console.error('Error saving agenda to localStorage:', error);
        }
    };

    const handleGenerarNuevaAgenda = async () => {
        try {
            setGenerating(true);
            setError('');

            const response = await agendaService.generarNuevaAgenda(siguienteSemana);

            if (response.success && response.data.agenda) {
                const nuevaAgenda = [...agenda, response.data.agenda];
                setAgenda(nuevaAgenda);
                setSiguienteSemana(siguienteSemana + 1);

                // Guardar en localStorage
                saveAgendaToStorage(nuevaAgenda, siguienteSemana + 1);

            } else {
                setError('Error al generar nueva agenda');
            }
        } catch (error: any) {
            console.error('Error generating agenda:', error);
            
            // Verificar si es un error específico de límite de agenda
            if (error.message && error.message.includes('No hay agenda disponible')) {
                setError('¡Has alcanzado el límite de agenda disponible! No hay más semanas para generar.');
                setLimiteAlcanzado(true);
            } else if (error.status === 404) {
                setError('¡Has alcanzado el límite de agenda disponible! No hay más semanas para generar.');
                setLimiteAlcanzado(true);
            } else {
                setError('Error al generar nueva agenda. Verifica tu conexión.');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleVerDetalles = (semana: AgendaSemana) => {
        setSelectedWeek(semana);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedWeek(null);
    };

    const handleOpenUrl = (url: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleGenerarEstructura = async (tema: string, materia: string) => {
        try {
            setGenerandoEstructura(true);
            setErrorEstructura('');
            setSelectedTema({ titulo: tema, materia });
            setEstructuraModalOpen(true);

            console.log('🤖 Generando estructura para tema:', tema, 'materia:', materia);

            const response = await agendaService.generarEstructuraTema(tema, materia);

                if (response.success) {
                    // Parsear la estructura si viene como string JSON
                    let estructuraData = response.data;
                    if (estructuraData.estructura && estructuraData.estructura.contenido) {
                        try {
                            // Extraer el JSON del contenido (remover ```json y ```)
                            const jsonContent = estructuraData.estructura.contenido
                                .replace(/```json\n?/g, '')
                                .replace(/\n?```/g, '');
                            
                            const parsedEstructura = JSON.parse(jsonContent);
                            estructuraData = {
                                ...estructuraData,
                                estructura: parsedEstructura
                            };
                            console.log('✅ Estructura parseada correctamente');
                        } catch (parseError) {
                            console.error('❌ Error al parsear estructura:', parseError);
                            // Mantener la estructura original si no se puede parsear
                        }
                    }
                    setEstructuraTema(estructuraData);
                    console.log('✅ Estructura generada exitosamente');
                } else {
                    setErrorEstructura('Error al generar la estructura del tema');
                }
        } catch (error: any) {
            console.error('❌ Error al generar estructura:', error);
            setErrorEstructura('Error al conectar con el servidor. Inténtalo de nuevo.');
        } finally {
            setGenerandoEstructura(false);
        }
    };

    const handleCloseEstructuraModal = () => {
        setEstructuraModalOpen(false);
        setSelectedTema(null);
        setEstructuraTema(null);
        setErrorEstructura('');
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Fade in={true} timeout={800}>
            <Container maxWidth="xl" sx={{ py: 2, minHeight: '100vh' }}>
                {/* Header Section */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 300, mb: 3, color: 'text.primary' }}>
                        Agenda Semanal
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            startIcon={generating ? <CircularProgress size={20} /> : <CalendarTodayIcon />}
                            onClick={handleGenerarNuevaAgenda}
                            disabled={generating || limiteAlcanzado}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                px: 4,
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            {generating ? 'Generando...' : 
                                limiteAlcanzado ? 'Límite alcanzado' :
                                agenda.length === 0 ? 'Comenzar Agenda' : 'Generar Agenda semanal'}
                        </Button>

                        {agenda.length > 0 && (
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    try {
                                        // Obtener datos del usuario desde la sesión aislada
                                        const maestroSession = getMaestroSession();
                                        const user = maestroSession.getCurrentUser();
                                        if (!user) {
                                            console.error('❌ No se encontraron datos del usuario para resetear agenda');
                                            return;
                                        }

                                        const userKey = user.Usuario || user.email || 'unknown';

                                        setAgenda([]);
                                        setSiguienteSemana(1);
                                        setError('');
                                        setLimiteAlcanzado(false);

                                        // Limpiar localStorage con claves únicas
                                        localStorage.removeItem(`maestro_agenda_${userKey}`);
                                        localStorage.removeItem(`maestro_siguiente_semana_${userKey}`);
                                        console.log('🗑️ Agenda reseteada y localStorage limpiado para usuario:', userKey);
                                    } catch (error) {
                                        console.error('Error resetting agenda:', error);
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 4,
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Resetear
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity={limiteAlcanzado ? "info" : "error"} 
                        sx={{ mb: 3, width: '100%', maxWidth: 600, mx: 'auto' }}
                    >
                        {error}
                        {limiteAlcanzado && (
                            <Box sx={{ mt: 1, fontSize: '0.9rem', opacity: 0.8 }}>
                                Puedes usar el botón "Resetear" para comenzar de nuevo con la agenda.
                            </Box>
                        )}
                    </Alert>
                )}

                {/* Grid con Masonry */}
                <Box sx={{ width: '100%' }}>
                    {agenda.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                Tu agenda está vacía
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Haz clic en "Comenzar Agenda" para agregar la primera semana
                            </Typography>
                        </Box>
                    ) : (
                        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
                            {agenda.map((semana, index) => (
                                <Paper
                                    key={semana.semana}
                                    elevation={0}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        p: 3,
                                        height: index % 2 === 0 ? '320px' : '310px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Box>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2
                                            }}>
                                                <Typography
                                                    variant="overline"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        letterSpacing: 1
                                                    }}
                                                >
                                                    Semana #{semana.semana}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {`${semana.temas.length} temas`}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 1
                                                }}
                                            >
                                                {semana.nombre}
                                            </Typography>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ maxHeight: '120px', overflow: 'hidden' }}>
                                                {semana.temas.slice(0, 2).map((tema, temaIndex) => (
                                                    <Typography
                                                        key={temaIndex}
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.4,
                                                            mb: 0.5,
                                                            display: 'block'
                                                        }}
                                                    >
                                                        Día {tema.dia}: {tema.titulo}
                                                    </Typography>
                                                ))}
                                                {semana.temas.length > 2 && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ fontStyle: 'italic' }}
                                                    >
                                                        ... y {semana.temas.length - 2} temas más
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>

                                        <Button
                                            fullWidth
                                            variant="text"
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={() => handleVerDetalles(semana)}
                                            sx={{
                                                mt: 2,
                                                justifyContent: 'space-between',
                                                textTransform: 'none',
                                                fontWeight: 500,
                                                borderRadius: 3,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        >
                                            Ver más
                                        </Button>
                                    </Box>
                                </Paper>
                            ))}
                        </Masonry>
                    )}
                </Box>

                {/* Modal para mostrar detalles de la semana */}
                <Dialog
                    open={modalOpen}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 1,
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <SchoolIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Semana #{selectedWeek?.semana}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedWeek?.nombre}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            onClick={handleCloseModal}
                            sx={{
                                minWidth: 'auto',
                                p: 1,
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                            }}
                        >
                            <CloseIcon />
                        </Button>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 500 }}>
                            Temas de la Semana
                        </Typography>

                        {selectedWeek && selectedWeek.temas.length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {selectedWeek.temas.map((tema, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            mb: 2,
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.02)',
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                            <ListItemIcon>
                                                <Avatar sx={{
                                                    bgcolor: 'primary.main',
                                                    width: 32,
                                                    height: 32,
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {tema.dia}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                        Día {tema.dia}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {tema.titulo}
                                                    </Typography>
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<OpenInNewIcon />}
                                                onClick={() => handleOpenUrl(tema.url)}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    py: 0.5,
                                                    '&:hover': {
                                                        backgroundColor: 'primary.main',
                                                        color: 'white',
                                                        borderColor: 'primary.main'
                                                    }
                                                }}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={generandoEstructura ? <CircularProgress size={16} /> : <SchoolIcon />}
                                                onClick={() => handleGenerarEstructura(tema.titulo, selectedWeek.nombre)}
                                                disabled={generandoEstructura}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    py: 0.5,
                                                    backgroundColor: 'secondary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'secondary.dark'
                                                    },
                                                    '&:disabled': {
                                                        backgroundColor: 'action.disabled',
                                                        color: 'action.disabled'
                                                    }
                                                }}
                                            >
                                                {generandoEstructura ? 'Generando...' : 'Estructurar'}
                                            </Button>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No hay temas disponibles para esta semana
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Modal para mostrar estructura de tema generada por Gemini */}
                <Dialog
                    open={estructuraModalOpen}
                    onClose={handleCloseEstructuraModal}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            maxHeight: '90vh'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 1,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: 'primary.main',
                        color: 'white'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                                <SchoolIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Estructura de Tema
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {selectedTema?.titulo}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            onClick={handleCloseEstructuraModal}
                            sx={{
                                minWidth: 'auto',
                                p: 1,
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <CloseIcon />
                        </Button>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3 }}>
                        {generandoEstructura ? (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                py: 8,
                                gap: 2
                            }}>
                                <CircularProgress size={60} />
                                <Typography variant="h6" color="text.secondary">
                                    Generando estructura con IA...
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Esto puede tomar unos segundos
                                </Typography>
                            </Box>
                        ) : errorEstructura ? (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorEstructura}
                            </Alert>
                        ) : estructuraTema ? (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Estructura de Clase: {estructuraTema.tema}
                                </Typography>
                                
                                <Box sx={{ 
                                    backgroundColor: '#f5f5f5', 
                                    p: 2, 
                                    borderRadius: 2, 
                                    mb: 3,
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Materia:</strong> {estructuraTema.materia} | 
                                        <strong> Duración:</strong> {estructuraTema.duracion} minutos | 
                                        <strong> Generado:</strong> {new Date(estructuraTema.fechaGeneracion).toLocaleString()}
                                    </Typography>
                                </Box>

                                {estructuraTema.estructura && typeof estructuraTema.estructura === 'object' ? (
                                    <Box>
                                        {estructuraTema.estructura.objetivos && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    🎯 Objetivos de Aprendizaje
                                                </Typography>
                                                <List>
                                                    {estructuraTema.estructura.objetivos.map((objetivo: string, index: number) => (
                                                        <ListItem key={index} sx={{ py: 0.5 }}>
                                                            <ListItemText 
                                                                primary={`${index + 1}. ${objetivo}`}
                                                                sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem' } }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}

                                        {estructuraTema.estructura.inicio && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    🚀 Actividades de Inicio ({estructuraTema.estructura.inicio.tiempo})
                                                </Typography>
                                                <Typography variant="body1" sx={{ pl: 2 }}>
                                                    {estructuraTema.estructura.inicio.actividad}
                                                </Typography>
                                            </Box>
                                        )}

                                        {estructuraTema.estructura.desarrollo && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    📚 Desarrollo de la Clase ({estructuraTema.estructura.desarrollo.tiempo})
                                                </Typography>
                                                {estructuraTema.estructura.desarrollo.actividades && (
                                                    <List>
                                                        {estructuraTema.estructura.desarrollo.actividades.map((actividad: any, index: number) => (
                                                            <ListItem key={index} sx={{ py: 0.5 }}>
                                                                <ListItemText 
                                                                    primary={`${actividad.tiempo}: ${actividad.descripcion}`}
                                                                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem' } }}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                )}
                                            </Box>
                                        )}

                                        {estructuraTema.estructura.cierre && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    ✅ Actividades de Cierre ({estructuraTema.estructura.cierre.tiempo})
                                                </Typography>
                                                <Typography variant="body1" sx={{ pl: 2 }}>
                                                    {estructuraTema.estructura.cierre.actividad}
                                                </Typography>
                                            </Box>
                                        )}

                                        {estructuraTema.estructura.recursos && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    📋 Recursos Necesarios
                                                </Typography>
                                                <List>
                                                    {estructuraTema.estructura.recursos.map((recurso: string, index: number) => (
                                                        <ListItem key={index} sx={{ py: 0.5 }}>
                                                            <ListItemText 
                                                                primary={`• ${recurso}`}
                                                                sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem' } }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}

                                        {estructuraTema.estructura.evaluacion && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    📊 Evaluación
                                                </Typography>
                                                <Typography variant="body1" sx={{ pl: 2 }}>
                                                    {estructuraTema.estructura.evaluacion}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Box sx={{ 
                                        backgroundColor: '#f9f9f9', 
                                        p: 3, 
                                        borderRadius: 2,
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {estructuraTema.estructura.contenido || estructuraTema.estructura}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ) : null}
                    </DialogContent>
                </Dialog>
            </Container>
        </Fade>
    );
}