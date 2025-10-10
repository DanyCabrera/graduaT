// Utilidades para manejo de autenticación y tokens de acceso
import sessionManager, { getCurrentToken, getCurrentUser, getCurrentRole, hasValidSession } from './sessionManager';

export const clearAccessTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessType');
    localStorage.removeItem('accessExpiry');
    // También limpiar la sesión actual
    sessionManager.clearCurrentSession();
};

export const hasValidAccessToken = (requiredType: string = 'ROL'): boolean => {
    try {
        // Primero verificar si tenemos una sesión válida
        if (!hasValidSession()) {
            return false;
        }

        // Verificar el tipo de acceso requerido
        if (requiredType === 'ROL') {
            // Para acceso de rol, verificar que tenemos un rol válido
            const currentRole = getCurrentRole();
            return currentRole !== null && currentRole !== undefined;
        }

        // Para otros tipos de acceso, usar el sistema anterior
        const accessToken = localStorage.getItem('accessToken');
        const accessType = localStorage.getItem('accessType');
        const accessExpiry = localStorage.getItem('accessExpiry');

        if (!accessToken || !accessType || !accessExpiry) {
            return false;
        }

        // Verificar si el token ha expirado
        const now = new Date().getTime();
        const expiryTime = parseInt(accessExpiry);
        
        if (now > expiryTime) {
            // Token expirado, limpiar
            clearAccessTokens();
            return false;
        }

        // Verificar si el tipo de acceso coincide
        return accessType === requiredType;
    } catch (error) {
        console.error('Error checking access token:', error);
        return false;
    }
};

export const setAccessToken = (type: string, durationMinutes: number = 30) => {
    const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const accessExpiry = Date.now() + (durationMinutes * 60 * 1000);
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('accessType', type);
    localStorage.setItem('accessExpiry', accessExpiry.toString());
    
    return accessToken;
};

// Nuevas funciones para manejo de sesiones
export const getSessionToken = () => getCurrentToken();
export const getSessionUser = () => getCurrentUser();
export const getSessionRole = () => getCurrentRole();
export const isSessionValid = () => hasValidSession();
