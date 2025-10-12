// Componente para manejar errores de sesión y conflictos entre pestañas

import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Box, Typography } from '@mui/material';
import { Refresh, Warning, Error } from '@mui/icons-material';
import { sessionManager } from '../../utils/sessionManager';

interface SessionErrorHandlerProps {
  error: Error | null;
  onRetry?: () => void;
  onClearError?: () => void;
  context?: string; // Contexto donde ocurrió el error (ej: "maestro", "alumno")
}

export const SessionErrorHandler: React.FC<SessionErrorHandlerProps> = ({ 
  error, 
  onRetry, 
  onClearError,
  context = 'sistema'
}) => {
  const [showError, setShowError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    if (error) {
      console.log(`🚨 Error de sesión en ${context}:`, error);
      
      // Analizar el tipo de error
      const errorStatus = (error as any).status;
      const errorMessage = error.message;
      
      let errorType = 'unknown';
      let severity: 'error' | 'warning' | 'info' = 'error';
      let title = 'Error de Conexión';
      let message = errorMessage;
      let action = null;

      if (errorStatus === 401) {
        errorType = 'unauthorized';
        severity = 'warning';
        title = 'Sesión Expirada';
        message = 'Tu sesión ha expirado. Por favor, recarga la página.';
        action = (
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => window.location.reload()}
            startIcon={<Refresh />}
          >
            Recargar Página
          </Button>
        );
      } else if (errorStatus === 403) {
        errorType = 'forbidden';
        severity = 'warning';
        title = 'Acceso Denegado';
        message = 'No tienes permisos para acceder a esta función.';
        action = (
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            startIcon={<Refresh />}
          >
            Reintentar
          </Button>
        );
      } else if (errorMessage.includes('conexión') || errorMessage.includes('network')) {
        errorType = 'network';
        severity = 'error';
        title = 'Error de Conexión';
        message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        action = (
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            startIcon={<Refresh />}
          >
            Reintentar
          </Button>
        );
      }

      setErrorDetails({
        type: errorType,
        severity,
        title,
        message,
        action,
        context,
        sessionInfo: sessionManager.getSessionInfo()
      });
      
      setShowError(true);
    }
  }, [error, context, onRetry]);

  const handleClose = () => {
    setShowError(false);
    if (onClearError) {
      onClearError();
    }
  };

  const handleRetry = () => {
    setShowError(false);
    if (onRetry) {
      onRetry();
    }
  };

  if (!showError || !errorDetails) {
    return null;
  }

  return (
    <Snackbar
      open={showError}
      autoHideDuration={errorDetails.type === 'network' ? 10000 : 6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={errorDetails.severity}
        action={errorDetails.action}
        sx={{ 
          width: '100%',
          maxWidth: '500px',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        icon={errorDetails.severity === 'error' ? <Error /> : <Warning />}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {errorDetails.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {errorDetails.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Contexto: {errorDetails.context} | Sesión: {errorDetails.sessionInfo.sessionId.substring(0, 8)}...
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};
