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
            // Verificar datos de localStorage directamente primero
            const authToken = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');
            const userRole = localStorage.getItem('user_role');
            
            console.log('🔍 hasValidAccessToken - Datos directos de localStorage:', {
                hasAuthToken: !!authToken,
                hasUserData: !!userData,
                hasUserRole: !!userRole
            });
            
            // Si tenemos datos básicos en localStorage, permitir acceso
            if (authToken && userData && userRole) {
                try {
                    const parsedUser = JSON.parse(userData);
                    console.log('✅ Acceso autorizado por datos de localStorage:', {
                        user: parsedUser.Usuario,
                        role: parsedUser.Rol
                    });
                    return true;
                } catch (error) {
                    console.error('❌ Error al parsear datos de usuario:', error);
                }
            }
            
            // Para acceso de rol, verificar que tenemos una sesión válida
            const hasSession = hasValidSession();
            const currentRole = getCurrentRole();
            const sessionToken = getSessionToken();
            
            console.log('🔍 Verificaciones de sesión:', { hasSession, currentRole, hasToken: !!sessionToken });
            
            // Si tenemos una sesión válida con token y rol, permitir acceso sin token de acceso adicional
            if (hasSession && sessionToken && currentRole) {
                console.log('✅ Acceso autorizado por sesión válida');
                return true;
            }
            
            // Si no hay sesión válida, verificar token de acceso tradicional
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
                console.log('❌ Faltan datos del token de acceso y no hay sesión válida');
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
            
            // Para el panel de roles, necesitamos el token de acceso válido
            const result = hasValidAccess;
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
