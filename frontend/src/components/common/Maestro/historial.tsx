import { useState, useEffect } from 'react';
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
    IconButton,
    Button,
    Alert,
    CircularProgress,
    Divider,
    Badge,
    Tooltip
} from '@mui/material';
import {
    Notifications,
    NotificationsActive,
    CheckCircle,
    Quiz,
    School
} from '@mui/icons-material';
import { testAssignmentService, type Notification } from '../../../services/testAssignmentService';

export default function Historial() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
        
        // Actualizar notificaciones cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await testAssignmentService.getNotifications();
            if (response.success) {
                setNotifications(response.data);
            } else {
                if (response.message?.includes('Acceso denegado')) {
                    console.log('Usuario no es maestro, no se cargarán notificaciones');
                    setNotifications([]);
                } else {
                    setError(response.message || 'Error al cargar las notificaciones');
                }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Error al cargar las notificaciones. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await testAssignmentService.markNotificationAsRead(notificationId);
            // Actualizar la lista de notificaciones
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error('Error marking notification as read:', error);
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
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Historial y Notificaciones
                </Typography>
                
                <Tooltip title="Notificaciones">
                    <IconButton 
                        sx={{ 
                            color: notifications.length > 0 ? '#f59e0b' : '#6b7280',
                            '&:hover': {
                                backgroundColor: 'rgba(245, 158, 11, 0.1)'
                            }
                        }}
                    >
                        <Badge badgeContent={notifications.length} color="error">
                            {notifications.length > 0 ? <NotificationsActive /> : <Notifications />}
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Box>

            {notifications.length === 0 ? (
                <Card sx={{ textAlign: 'center', py: 6 }}>
                    <CardContent>
                        <Notifications sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No hay notificaciones nuevas
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Te notificaremos cuando los estudiantes completen sus tests
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
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
        </Box>
    );
}