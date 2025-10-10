import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Collapse
} from '@mui/material';
import {
    BugReport,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import sessionManager from '../../utils/sessionManager';

interface SessionDebuggerProps {
    show?: boolean;
}

export default function SessionDebugger({ show = false }: SessionDebuggerProps) {
    const [sessions, setSessions] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const updateSessions = () => {
            const activeSessions = sessionManager.getActiveSessions();
            setSessions(activeSessions);
        };

        updateSessions();
        
        // Actualizar cada 5 segundos
        const interval = setInterval(updateSessions, 5000);
        
        return () => clearInterval(interval);
    }, []);

    if (!show) return null;

    return (
        <Card sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16, 
            zIndex: 1000,
            maxWidth: 400,
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6'
        }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BugReport sx={{ fontSize: 20, color: '#6c757d' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Sesiones Activas ({sessions.length})
                    </Typography>
                    <Button
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </Button>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {sessions.map((session, index) => (
                            <Box key={index} sx={{ 
                                p: 1, 
                                backgroundColor: 'white', 
                                borderRadius: 1,
                                border: '1px solid #e9ecef'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Chip 
                                        label={session.role} 
                                        size="small" 
                                        color={session.role === 'Maestro' ? 'primary' : 
                                               session.role === 'Director' ? 'secondary' : 'default'}
                                    />
                                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                                        {session.user?.Nombre} {session.user?.Apellido}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#6c757d', fontFamily: 'monospace' }}>
                                    Tab: {session.tabId.substring(0, 8)}...
                                </Typography>
                            </Box>
                        ))}
                        
                        {sessions.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                No hay sesiones activas
                            </Typography>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}
