// Sistema de gestión de sesiones por pestaña
// Permite manejar múltiples roles simultáneamente en diferentes pestañas

interface SessionData {
    token: string;
    user: any;
    role: string;
    timestamp: number;
    tabId: string;
}

class SessionManager {
    private sessions: Map<string, SessionData> = new Map();
    private currentTabId: string;

    constructor() {
        // Intentar recuperar el tabId existente o generar uno nuevo
        this.currentTabId = this.getOrCreateTabId();
        
        // No limpiar sesión automáticamente en beforeunload para permitir recarga de página
        // La sesión se mantendrá hasta que expire o se limpie explícitamente

        // Escuchar cambios en localStorage de otras pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentSessions') {
                this.syncSessions();
            }
        });

        // Sincronizar sesiones al cargar
        this.syncSessions();
    }

    private getOrCreateTabId(): string {
        // Intentar recuperar un tabId existente del localStorage
        const existingTabId = localStorage.getItem('currentTabId');
        if (existingTabId) {
            return existingTabId;
        }
        
        // Si no existe, generar uno nuevo y guardarlo
        const newTabId = this.generateTabId();
        localStorage.setItem('currentTabId', newTabId);
        console.log('🔍 Generando nuevo tabId:', newTabId);
        return newTabId;
    }

    private generateTabId(): string {
        return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private syncSessions(): void {
        try {
            const storedSessions = localStorage.getItem('currentSessions');
            if (storedSessions) {
                const sessionsData = JSON.parse(storedSessions);
                this.sessions = new Map(Object.entries(sessionsData));
            }
        } catch (error) {
            console.error('Error syncing sessions:', error);
        }
    }

    private saveSessions(): void {
        try {
            const sessionsObject = Object.fromEntries(this.sessions);
            localStorage.setItem('currentSessions', JSON.stringify(sessionsObject));
        } catch (error) {
            console.error('Error saving sessions:', error);
        }
    }

    public setSession(token: string, user: any, role: string): void {
        const sessionData: SessionData = {
            token,
            user,
            role,
            timestamp: Date.now(),
            tabId: this.currentTabId
        };

        this.sessions.set(this.currentTabId, sessionData);
        this.saveSessions();

        // También guardar en localStorage para compatibilidad con código existente
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user_role', role);
    }

    public getCurrentSession(): SessionData | null {
        return this.sessions.get(this.currentTabId) || null;
    }

    public getCurrentToken(): string | null {
        const session = this.getCurrentSession();
        return session ? session.token : null;
    }

    public getCurrentUser(): any | null {
        const session = this.getCurrentSession();
        return session ? session.user : null;
    }

    public getCurrentRole(): string | null {
        const session = this.getCurrentSession();
        return session ? session.role : null;
    }

    public clearCurrentSession(): void {
        console.log('🔍 Limpiando sesión actual para tabId:', this.currentTabId);
        this.sessions.delete(this.currentTabId);
        this.saveSessions();

        // Limpiar localStorage solo si no hay otras sesiones activas
        if (this.sessions.size === 0) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('user_role');
            localStorage.removeItem('currentSessions');
            localStorage.removeItem('currentTabId');
        }
    }

    public clearAllSessions(): void {
        this.sessions.clear();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
        localStorage.removeItem('currentSessions');
        localStorage.removeItem('currentTabId');
    }

    public hasValidSession(): boolean {
        const session = this.getCurrentSession();
        console.log('🔍 hasValidSession - Sesión actual:', session);
        
        if (!session) {
            console.log('❌ No hay sesión actual');
            return false;
        }

        // Verificar si la sesión no ha expirado (24 horas)
        const now = Date.now();
        const sessionAge = now - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas

        console.log('🔍 Verificación de expiración:', {
            now: new Date(now).toLocaleString(),
            sessionTimestamp: new Date(session.timestamp).toLocaleString(),
            sessionAge: Math.round(sessionAge / (1000 * 60)) + ' minutos',
            maxAge: Math.round(maxAge / (1000 * 60 * 60)) + ' horas'
        });

        if (sessionAge > maxAge) {
            console.log('❌ Sesión expirada, limpiando');
            this.clearCurrentSession();
            return false;
        }

        console.log('✅ Sesión válida');
        return true;
    }

    public getActiveSessions(): SessionData[] {
        return Array.from(this.sessions.values());
    }

    public switchToRole(role: string): boolean {
        // Buscar si ya existe una sesión con este rol
        for (const [tabId, session] of this.sessions) {
            if (session.role === role) {
                // Cambiar a esa sesión
                this.currentTabId = tabId;
                this.saveSessions();
                return true;
            }
        }
        return false;
    }
}

// Crear una instancia singleton
const sessionManager = new SessionManager();

export default sessionManager;

// Funciones de utilidad para compatibilidad con código existente
export const getCurrentToken = () => sessionManager.getCurrentToken();
export const getCurrentUser = () => sessionManager.getCurrentUser();
export const getCurrentRole = () => sessionManager.getCurrentRole();
export const setSession = (token: string, user: any, role: string) => sessionManager.setSession(token, user, role);
export const clearSession = () => sessionManager.clearCurrentSession();
export const hasValidSession = () => sessionManager.hasValidSession();
