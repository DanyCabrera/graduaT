import { useState, useEffect } from 'react';
import { MaestroPage } from './MaestroShell';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Button,
    Alert,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    CheckCircle,
    Quiz,
    School,
    ClearAll
} from '@mui/icons-material';
import { testAssignmentService, type Notification } from '../../../services/testAssignmentService';
import { getMaestroSession } from '../../../utils/sessionManager';

interface HistorialProps {
    refreshTrigger?: number; // Prop para forzar refresh
    onNotificationCountChange?: (count: number) => void; // Callback para actualizar contador
}

export default function Historial({ refreshTrigger, onNotificationCountChange }: HistorialProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clearingNotifications, setClearingNotifications] = useState(false);

    useEffect(() => {
        fetchNotifications();
        
        // Actualizar notificaciones cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Efecto para refrescar cuando se limpian los tests
    useEffect(() => {
        if (refreshTrigger && refreshTrigger > 0) {
            console.log('🔄 Historial: Refrescando notificaciones después de limpiar tests...');
            fetchNotifications();
        }
    }, [refreshTrigger]);

    const fetchNotifications = async () => {
        try {
            // Verificar la sesión aislada del maestro
            const maestroSession = getMaestroSession();
            const user = maestroSession.getCurrentUser();
            const token = maestroSession.getCurrentToken();
            
            console.log('🔍 Historial - Verificando sesión aislada:', {
                hasUser: !!user,
                hasToken: !!token,
                userRole: user?.Rol,
                userInstitution: user?.Código_Institución,
                sessionId: maestroSession.getSessionId()
            });
            
            const response = await testAssignmentService.getNotifications();
            if (response.success) {
                setNotifications(response.data);
                console.log('✅ Historial - Notificaciones cargadas:', response.data.length);
                // Actualizar el contador en el navbar
                if (onNotificationCountChange) {
                    onNotificationCountChange(response.data.length);
                }
            } else {
                if (response.message?.includes('Acceso denegado')) {
                    console.log('❌ Usuario no es maestro, no se cargarán notificaciones');
                    setNotifications([]);
                    if (onNotificationCountChange) {
                        onNotificationCountChange(0);
                    }
                } else {
                    setError(response.message || 'Error al cargar las notificaciones');
                }
            }
        } catch (error) {
            console.error('❌ Error fetching notifications:', error);
            setError('Error al cargar las notificaciones. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            // Eliminar la notificación completamente del backend
            const response = await testAssignmentService.deleteNotification(notificationId);
            
            if (response.success) {
                // Actualizar la lista de notificaciones
                setNotifications(prev => {
                    const newNotifications = prev.filter(n => n._id !== notificationId);
                    // Actualizar el contador en el navbar
                    if (onNotificationCountChange) {
                        onNotificationCountChange(newNotifications.length);
                    }
                    return newNotifications;
                });
                console.log('✅ Notificación eliminada exitosamente');
            } else {
                console.error('❌ Error al eliminar notificación:', response.message);
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            setClearingNotifications(true);
            console.log('🧹 Eliminando todas las notificaciones...');
            
            // Eliminar todas las notificaciones del backend
            const response = await testAssignmentService.deleteAllNotifications();
            
            if (response.success) {
                // Limpiar la lista local
                setNotifications([]);
                
                // Actualizar el contador en el navbar
                if (onNotificationCountChange) {
                    onNotificationCountChange(0);
                }
                
                console.log('✅ Todas las notificaciones han sido eliminadas:', response.data?.deletedCount || 0);
            } else {
                console.error('❌ Error al eliminar notificaciones:', response.message);
            }
        } catch (error) {
            console.error('❌ Error al eliminar notificaciones:', error);
        } finally {
            setClearingNotifications(false);
        }
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
                kicker="ACTIVIDAD"
                title="Historial"
                description="Cada vez que un alumno termina una evaluación, el aviso queda aquí para que lo revises."
            >
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            </MaestroPage>
        );
    }

    return (
        <MaestroPage
            kicker="ACTIVIDAD"
            title="Historial"
            description="Cada vez que un alumno termina una evaluación, el aviso queda aquí para que lo revises."
            meta={notifications.length === 0 ? 'Bandeja en cero' : `${notifications.length} pendientes`}
            actions={notifications.length > 0 ? (
                <Button
                    variant="outlined"
                    startIcon={<ClearAll />}
                    onClick={clearAllNotifications}
                    disabled={clearingNotifications}
                    sx={{ textTransform: 'none', borderColor: '#D9D4F8', color: '#1B1B3A', borderRadius: '999px' }}
                >
                    {clearingNotifications ? 'Limpiando...' : 'Marcar todo'}
                </Button>
            ) : undefined}
        >

            {notifications.length === 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                    <Box sx={{ bgcolor: '#ffffff', border: '1px solid #EEF0F6', borderRadius: '24px', p: 2.5 }}>
                        <Typography sx={{ fontWeight: 600, color: '#1B1B3A' }}>Nada nuevo por ahora</Typography>
                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 0.75, lineHeight: 1.55 }}>
                            La bandeja se llena sola. No hace falta recargar el aula: cuando haya un resultado, el contador del menú también cambia.
                        </Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#ffffff', border: '1px solid #E6E0FB', borderRadius: '24px', overflow: 'hidden' }}>
                        {['Asignas una evaluación', 'El alumno la responde', 'El resultado llega a esta lista'].map((step, index) => (
                            <Box key={step} sx={{ px: 2.5, py: 1.75, display: 'flex', gap: 1.5, borderTop: index === 0 ? 0 : '1px solid #F3F4F8' }}>
                                <Typography sx={{ color: '#6D5EF6', fontSize: 13, fontWeight: 700, width: 16 }}>{index + 1}</Typography>
                                <Typography sx={{ color: '#1B1B3A', fontSize: 14 }}>{step}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ) : (
                <Card sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid #EEF0F6', bgcolor: '#ffffff' }}>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #EEF0F6' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1B1B3A' }}>
                                Notificaciones Recientes
                            </Typography>
                        </Box>
                        
                        <List sx={{ p: 0 }}>
                            {notifications.map((notification, index) => (
                                <Box key={notification._id}>
                                    <ListItem sx={{ py: 3, px: 3 }}>
                                        <ListItemIcon>
                                            <CheckCircle sx={{ color: '#10b981' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {notification.title}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${notification.score}%`}
                                                        color={getScoreColor(notification.score)}
                                                        size="small"
                                                    />
                                                    <Chip 
                                                        label={getScoreLabel(notification.score)}
                                                        color={getScoreColor(notification.score)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {notification.message}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <School sx={{ fontSize: 16, color: '#6b7280' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Estudiante: {notification.studentId}
                                                        </Typography>
                                                        {notification.studentInstitution && (
                                                            <>
                                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                                    • Institución: {notification.studentInstitution}
                                                                </Typography>
                                                            </>
                                                        )}
                                                        <Quiz sx={{ fontSize: 16, color: '#6b7280', ml: 2 }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Test: {notification.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => markNotificationAsRead(notification._id)}
                                            sx={{ ml: 2 }}
                                        >
                                            Marcar como leída
                                        </Button>
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </MaestroPage>
    );
}