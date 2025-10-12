// Componente para manejar errores de conexión y evitar pérdida de contenido

import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Box } from '@mui/material';
import { Refresh, WifiOff, Wifi } from '@mui/icons-material';

interface ConnectionErrorHandlerProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

export const ConnectionErrorHandler: React.FC<ConnectionErrorHandlerProps> = ({ 
  children, 
  onRetry 
}) => {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionError(null);
      setRetryCount(0);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionError('Sin conexión a internet');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) {
      onRetry();
    }
    setConnectionError(null);
  };

  const handleCloseError = () => {
    setConnectionError(null);
  };

  // Interceptar errores de fetch globalmente
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Si hay un error de conexión, mostrar mensaje pero no limpiar contenido
        if (!response.ok && response.status >= 500) {
          setConnectionError('Error del servidor. Los datos se mantienen en pantalla.');
        }
        
        return response;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setConnectionError('Error de conexión. Los datos se mantienen en pantalla.');
        }
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Indicador de estado de conexión */}
      {!isOnline && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'error.main',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <WifiOff fontSize="small" />
          <span>Sin conexión</span>
        </Box>
      )}

      {isOnline && retryCount > 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'success.main',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Wifi fontSize="small" />
          <span>Conexión restaurada</span>
        </Box>
      )}

      {/* Snackbar para errores de conexión */}
      <Snackbar
        open={!!connectionError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetry}
              startIcon={<Refresh />}
            >
              Reintentar
            </Button>
          }
          sx={{ width: '100%' }}
        >
          {connectionError}
        </Alert>
      </Snackbar>
    </>
  );
};
