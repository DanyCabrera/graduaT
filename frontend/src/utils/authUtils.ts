// Utilidades para manejo de autenticación y tokens de acceso
import { sessionManager, getCurrentToken, getCurrentUser, getCurrentRole, hasValidSession } from './sessionManager';

export const clearAccessTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessType');
    localStorage.removeItem('accessExpiry');
    // También limpiar la sesión actual
    sessionManager.clearCurrentSession();
};

export const hasValidAccessToken = (requiredType: string = 'ROL'): boolean => {
    try {
        console.log('🔍 hasValidAccessToken - Tipo requerido:', requiredType);
        console.log('🔍 localStorage completo:', {
            accessToken: localStorage.getItem('accessToken'),
            accessType: localStorage.getItem('accessType'),
            accessExpiry: localStorage.getItem('accessExpiry'),
            token: localStorage.getItem('token'),
            user: localStorage.getItem('user'),
            user_role: localStorage.getItem('user_role'),
            currentSessions: localStorage.getItem('currentSessions')
        });
        
        // Verificar el tipo de acceso requerido
        if (requiredType === 'ROL') {
            // Para acceso de rol, verificar que tenemos una sesión válida Y un token de acceso válido
            const hasSession = hasValidSession();
            const currentRole = getCurrentRole();
            
            console.log('🔍 Verificaciones de sesión:', { hasSession, currentRole });
            
            // Verificar token de acceso tradicional
            const accessToken = localStorage.getItem('accessToken');
            const accessType = localStorage.getItem('accessType');
            const accessExpiry = localStorage.getItem('accessExpiry');

            console.log('🔍 Token de acceso:', { 
                hasToken: !!accessToken, 
                type: accessType, 
                hasExpiry: !!accessExpiry,
                expiryTime: accessExpiry ? new Date(parseInt(accessExpiry)).toLocaleString() : 'N/A'
            });

            if (!accessToken || !accessType || !accessExpiry) {
                console.log('❌ Faltan datos del token de acceso');
                return false;
            }

            // Verificar si el token ha expirado
            const now = new Date().getTime();
            const expiryTime = parseInt(accessExpiry);
            
            if (now > expiryTime) {
                console.log('❌ Token expirado - Ahora:', new Date(now).toLocaleString(), 'Expira:', new Date(expiryTime).toLocaleString());
                // Token expirado, limpiar
                clearAccessTokens();
                return false;
            }

            // Verificar si el tipo de acceso coincide
            const hasValidAccess = accessType === requiredType;
            
            console.log('🔍 Validaciones finales:', { 
                hasValidAccess, 
                hasSession, 
                hasRole: currentRole !== null && currentRole !== undefined 
            });
            
            // Para el panel de roles, necesitamos tanto el token de acceso como una sesión válida
            // El rol puede ser TEMP_ROLE (temporal) o un rol específico
            const result = hasValidAccess && hasSession && currentRole !== null && currentRole !== undefined;
            console.log('✅ Resultado final:', result);
            return result;
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
