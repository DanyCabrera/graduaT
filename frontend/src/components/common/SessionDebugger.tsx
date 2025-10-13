// Componente para debuggear sesiones aisladas por pestaña

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Alert, Chip } from '@mui/material';
import { sessionManager } from '../../utils/sessionManager';
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
        const sessionKey = `session_${sessionManager.getSessionId()}`;
        const sessionData = sessionStorage.getItem(sessionKey);
        return localToken !== storageToken && !!sessionData;
    };

    const getRoleMatchStatus = () => {
        const currentRole = sessionManager.getCurrentRole();
        const currentUser = sessionManager.getCurrentUser();
        const expectedRole = currentUser?.Rol;
        
        if (!currentRole || !expectedRole) {
            return { matches: false, message: 'Rol no definido' };
        }
        
        if (currentRole === expectedRole) {
            return { matches: true, message: 'Rol coincide' };
        }
        
        return { matches: false, message: 'Conflicto de roles' };
    };

    const getCurrentPageRole = () => {
        const path = window.location.pathname;
        if (path.includes('/maestro')) return 'Maestro';
        if (path.includes('/alumno')) return 'Alumno';
        if (path.includes('/director')) return 'Director';
        if (path.includes('/supervisor')) return 'Supervisor';
        return 'Desconocido';
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
                        ? "✅ Sesión aislada correctamente - No hay conflictos entre pestañas" 
                        : "⚠️ Sesión compartida con localStorage - Posibles conflictos entre pestañas"
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
                            label={`Rol Esperado: ${debugInfo.localSession?.user?.Rol || 'N/A'}`}
                            color={debugInfo.localSession?.user?.Rol ? 'info' : 'default'}
                            size="small"
                        />
                        <Chip 
                            label={`Página Actual: ${getCurrentPageRole()}`}
                            color={getCurrentPageRole() !== 'Desconocido' ? 'secondary' : 'default'}
                            size="small"
                        />
                        <Chip 
                            label={`Rol Coincide: ${getRoleMatchStatus().matches ? 'Sí' : 'No'}`}
                            color={getRoleMatchStatus().matches ? 'success' : 'error'}
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
                    
                    {!getRoleMatchStatus().matches && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                <strong>Conflicto de Roles Detectado:</strong> {getRoleMatchStatus().message}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Rol de sesión: <strong>{debugInfo.localSession?.role || 'N/A'}</strong> | 
                                Rol esperado: <strong>{debugInfo.localSession?.user?.Rol || 'N/A'}</strong> | 
                                Página actual: <strong>{getCurrentPageRole()}</strong>
                            </Typography>
                        </Alert>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};