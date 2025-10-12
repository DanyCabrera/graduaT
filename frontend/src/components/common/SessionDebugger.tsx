// Componente para debuggear sesiones aisladas por pestaña

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Alert, Chip } from '@mui/material';
import { sessionManager, getCurrentToken, getCurrentUser, getCurrentRole, hasValidSession } from '../../utils/sessionManager';
import { apiService } from '../../services/api';

export const SessionDebugger: React.FC = () => {
    const [debugInfo, setDebugInfo] = useState<any>({});

    const updateDebugInfo = () => {
        const info = {
            sessionManager: sessionManager.getSessionInfo(),
            localSession: {
                token: sessionManager.getCurrentToken()?.substring(0, 20) + '...',
                user: sessionManager.getCurrentUser(),
                role: sessionManager.getCurrentRole(),
                isValid: sessionManager.hasValidSession()
            },
            localStorage: {
                token: localStorage.getItem('auth_token')?.substring(0, 20) + '...',
                user: localStorage.getItem('user_data'),
                role: localStorage.getItem('user_role')
            },
            tabTokenManager: apiService.getTabInfo(),
            timestamp: new Date().toLocaleString()
        };
        setDebugInfo(info);
    };

    useEffect(() => {
        updateDebugInfo();
        const interval = setInterval(updateDebugInfo, 2000);
        return () => clearInterval(interval);
    }, []);

    const forceUpdate = () => {
        sessionManager.forceSessionUpdate();
        updateDebugInfo();
    };

    const isIsolated = () => {
        const localToken = sessionManager.getCurrentToken();
        const storageToken = localStorage.getItem('auth_token');
        return localToken !== storageToken;
    };

    return (
        <Card sx={{ m: 2, maxWidth: 800 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🔍 Session Debugger - Aislamiento de Pestañas
                </Typography>
                
                <Alert 
                    severity={isIsolated() ? "success" : "warning"} 
                    sx={{ mb: 2 }}
                >
                    {isIsolated() 
                        ? "✅ Sesión aislada correctamente" 
                        : "⚠️ Sesión compartida con localStorage"
                    }
                </Alert>

                <Box sx={{ mb: 2 }}>
                    <Button variant="contained" onClick={updateDebugInfo} sx={{ mr: 1 }}>
                        Actualizar Info
                    </Button>
                    <Button variant="outlined" onClick={forceUpdate}>
                        Forzar Actualización
                    </Button>
                </Box>

                <Typography variant="h6" gutterBottom>
                    📊 Información de Sesión
                </Typography>
                
                <Box sx={{ 
                    backgroundColor: '#f5f5f5', 
                    p: 2, 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    maxHeight: '400px',
                    overflow: 'auto'
                }}>
                    <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Estado de Aislamiento:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                            label={`Token Local: ${debugInfo.localSession?.token || 'N/A'}`}
                            color={debugInfo.localSession?.token ? 'success' : 'error'}
                            size="small"
                        />
                        <Chip 
                            label={`Token Storage: ${debugInfo.localStorage?.token || 'N/A'}`}
                            color={debugInfo.localStorage?.token ? 'success' : 'error'}
                            size="small"
                        />
                        <Chip 
                            label={`Rol: ${debugInfo.localSession?.role || 'N/A'}`}
                            color={debugInfo.localSession?.role ? 'primary' : 'error'}
                            size="small"
                        />
                        <Chip 
                            label={`Rol Esperado: ${debugInfo.sessionManager?.expectedRole || 'N/A'}`}
                            color={debugInfo.sessionManager?.expectedRole ? 'info' : 'default'}
                            size="small"
                        />
                        <Chip 
                            label={`Rol Coincide: ${debugInfo.sessionManager?.expectedRole === debugInfo.localSession?.role ? 'Sí' : 'No'}`}
                            color={debugInfo.sessionManager?.expectedRole === debugInfo.localSession?.role ? 'success' : 'error'}
                            size="small"
                        />
                        <Chip 
                            label={`Tab ID: ${debugInfo.tabTokenManager?.tabId || 'N/A'}`}
                            color={debugInfo.tabTokenManager?.tabId ? 'info' : 'default'}
                            size="small"
                        />
                        <Chip 
                            label={`Token Aislado: ${debugInfo.tabTokenManager?.hasToken ? 'Sí' : 'No'}`}
                            color={debugInfo.tabTokenManager?.hasToken ? 'success' : 'error'}
                            size="small"
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};