// Gestor de sesiones para evitar conflictos entre pestañas

class SessionManager {
  private static instance: SessionManager;
  private sessionId: string;
  private isActive: boolean = true;
  private userRole: string | null = null;
  private userInstitution: string | null = null;
  private sessionToken: string | null = null;
  private sessionUserData: any = null;
  private expectedRole: string | null = null;

  private constructor(expectedRole?: string) {
    // Generar un ID único para esta pestaña
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.expectedRole = expectedRole || null;
    this.initializeSession();
    this.setupStorageListener();
  }

  public static getInstance(expectedRole?: string): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(expectedRole);
    } else if (expectedRole && SessionManager.instance.expectedRole !== expectedRole) {
      // Si se solicita un rol diferente, crear una nueva instancia
      console.log(`🔄 Cambiando de rol ${SessionManager.instance.expectedRole} a ${expectedRole}`);
      SessionManager.instance = new SessionManager(expectedRole);
    }
    return SessionManager.instance;
  }

  private initializeSession() {
    // Capturar la información del usuario actual al inicializar y almacenarla localmente
    const userData = localStorage.getItem('user_data');
    const authToken = localStorage.getItem('auth_token');
    
    if (userData && authToken) {
      try {
        const parsedUser = JSON.parse(userData);
        const currentRole = parsedUser.Rol;
        
        // Verificar si el rol coincide con el esperado
        if (this.expectedRole && currentRole !== this.expectedRole) {
          console.warn(`⚠️ Rol incorrecto detectado:`, {
            expected: this.expectedRole,
            actual: currentRole,
            sessionId: this.sessionId
          });
          
          // No inicializar la sesión si el rol no coincide
          console.log('🚫 Sesión no inicializada - rol incorrecto');
          return;
        }
        
        // Almacenar localmente para esta pestaña
        this.sessionToken = authToken;
        this.sessionUserData = parsedUser;
        this.userRole = currentRole;
        this.userInstitution = parsedUser.Código_Institución;
        
        // Crear una copia aislada en sessionStorage para esta pestaña específica
        const sessionKey = `session_${this.sessionId}`;
        const sessionData = {
          token: authToken,
          user: parsedUser,
          role: currentRole,
          institution: parsedUser.Código_Institución,
          timestamp: Date.now()
        };
        
        sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
        
        console.log('🔒 Sesión inicializada y aislada:', {
          sessionId: this.sessionId,
          role: this.userRole,
          expectedRole: this.expectedRole,
          institution: this.userInstitution,
          hasToken: !!this.sessionToken,
          sessionStorageKey: sessionKey
        });
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
      }
    }
  }

  private setupStorageListener() {
    // Escuchar cambios en localStorage desde otras pestañas
    window.addEventListener('storage', (e) => {
      console.log('🔄 Cambio detectado en localStorage:', e.key, e.newValue);
      
      // Solo reaccionar a cambios críticos que puedan afectar esta sesión
      if (e.key === 'auth_token' && e.newValue === null) {
        console.log('⚠️ Token eliminado por otra pestaña, pero manteniendo sesión local');
        // No hacer nada - mantener la sesión local
      } else if (e.key === 'user_data' || e.key === 'user_role') {
        console.log('⚠️ Datos de usuario cambiados por otra pestaña, pero manteniendo sesión aislada');
        // NO reaccionar a cambios de localStorage - mantener la sesión aislada
        // this.handleUserDataChange(); // Comentado para evitar conflictos
      }
    });

    // Escuchar cuando la pestaña se cierra
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Escuchar cuando la pestaña pierde el foco
    window.addEventListener('blur', () => {
      this.isActive = false;
    });

    // Escuchar cuando la pestaña recupera el foco
    window.addEventListener('focus', () => {
      this.isActive = true;
      this.validateSession();
    });
  }

  private handleTokenRemoval() {
    // No limpiar automáticamente para evitar conflictos entre pestañas
    console.log('🔄 Token eliminado por otra pestaña, pero manteniendo sesión local para evitar pérdida de contenido');
    
    // Verificar si el token realmente existe
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('⚠️ Token no encontrado - posible conflicto entre pestañas');
      // No limpiar automáticamente, dejar que el usuario decida
    }
  }

  private handleUserDataChange() {
    const currentUserData = localStorage.getItem('user_data');
    const currentUserRole = localStorage.getItem('user_role');
    
    if (currentUserData && currentUserRole) {
      try {
        const parsedUser = JSON.parse(currentUserData);
        const newRole = parsedUser.Rol;
        const newInstitution = parsedUser.Código_Institución;
        
        // Verificar si el usuario cambió de rol o institución
        if (newRole !== this.userRole || newInstitution !== this.userInstitution) {
          console.log('⚠️ Usuario cambió de rol/institución en otra pestaña:', {
            oldRole: this.userRole,
            newRole: newRole,
            oldInstitution: this.userInstitution,
            newInstitution: newInstitution,
            sessionId: this.sessionId
          });
          
          // NO actualizar automáticamente - mantener la sesión original de esta pestaña
          console.log('🔒 Manteniendo sesión original de esta pestaña para evitar conflictos');
            }
        } catch (error) {
        console.error('Error al procesar cambio de datos de usuario:', error);
      }
    }
  }

  private validateSession() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      console.log('⚠️ Sesión inválida detectada, pero manteniendo datos para evitar pérdida de contenido');
      // No limpiar automáticamente para evitar pérdida de contenido
      // El usuario puede decidir cuándo cerrar sesión
    } else {
      console.log('✅ Sesión válida detectada');
    }
  }

  private clearSession() {
    // Limpiar solo la sesión de esta pestaña específica
    const sessionKey = `session_${this.sessionId}`;
    sessionStorage.removeItem(sessionKey);
    
    // Solo limpiar localStorage si esta es la última pestaña activa
    // (esto se puede mejorar con un sistema de conteo de pestañas)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    
    // Limpiar datos locales
    this.sessionToken = null;
    this.sessionUserData = null;
    this.userRole = null;
    this.userInstitution = null;
    
    console.log('🧹 Sesión limpiada localmente y de sessionStorage');
  }

  public clearSessionManually() {
    this.clearSession();
  }

  public isSessionValid(): boolean {
    // Usar los datos locales de la sesión para validar
    const hasData = !!(this.sessionToken && this.sessionUserData);
    
    // Si hay un rol esperado, verificar que coincida
    if (this.expectedRole && this.userRole !== this.expectedRole) {
      console.warn('⚠️ Sesión inválida - rol no coincide:', {
        expected: this.expectedRole,
        actual: this.userRole
      });
      return false;
    }
    
    return hasData;
  }

  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isActive: this.isActive,
      isValid: this.isSessionValid(),
      expectedRole: this.expectedRole,
      actualRole: this.userRole
    };
  }

  public forceRefresh() {
    this.refreshSession();
    console.log('🔄 Sesión forzada a refrescar');
  }

  public getSessionUserRole(): string | null {
    return this.userRole;
  }

  public getSessionUserInstitution(): string | null {
    return this.userInstitution;
  }

  public isSessionForRole(role: string): boolean {
    return this.userRole === role;
  }

  public isSessionForInstitution(institution: string): boolean {
    return this.userInstitution === institution;
  }

  public forceSessionUpdate() {
    // Forzar la actualización de la sesión desde localStorage
    const userData = localStorage.getItem('user_data');
    const authToken = localStorage.getItem('auth_token');
    
    if (userData && authToken) {
      try {
        const parsedUser = JSON.parse(userData);
        this.sessionToken = authToken;
        this.sessionUserData = parsedUser;
        this.userRole = parsedUser.Rol;
        this.userInstitution = parsedUser.Código_Institución;
        
        console.log('🔄 Sesión forzada a actualizar:', {
          sessionId: this.sessionId,
          role: this.userRole,
          institution: this.userInstitution
        });
      } catch (error) {
        console.error('Error al forzar actualización de sesión:', error);
      }
    }
  }

  private cleanup() {
    // Limpiar listeners y recursos
    this.isActive = false;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isSessionActive(): boolean {
    return this.isActive;
  }

  public refreshSession() {
    // Marcar la sesión como activa
    this.isActive = true;
    console.log('🔄 Sesión refrescada para pestaña:', this.sessionId);
  }

  // Métodos para compatibilidad con authUtils
  public clearCurrentSession() {
    this.clearSession();
  }

  public getCurrentToken(): string | null {
    // Usar el token local de la sesión para evitar conflictos entre pestañas
    return this.sessionToken;
  }

  public getCurrentUser(): any {
    // Usar los datos locales de la sesión para evitar conflictos entre pestañas
    return this.sessionUserData;
  }

  public getCurrentRole(): string | null {
    // Usar el rol local de la sesión para evitar conflictos entre pestañas
    return this.userRole;
  }

  public hasValidSession(): boolean {
    return this.isSessionValid();
  }

  public setSession(token: string, user: any, role: string) {
    // Actualizar localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('user_role', role);
    
    // Actualizar datos locales de la sesión
    this.sessionToken = token;
    this.sessionUserData = user;
    this.userRole = role;
    this.userInstitution = user.Código_Institución;
    
    this.refreshSession();
    console.log('✅ Sesión establecida y aislada:', { 
      token: token.substring(0, 20) + '...', 
      role,
      sessionId: this.sessionId
    });
  }
}

// Funciones de conveniencia para compatibilidad
export const getCurrentToken = () => sessionManager.getCurrentToken();
export const getCurrentUser = () => sessionManager.getCurrentUser();
export const getCurrentRole = () => sessionManager.getCurrentRole();
export const hasValidSession = () => sessionManager.hasValidSession();
export const setSession = (token: string, user: any, role: string) => sessionManager.setSession(token, user, role);
export const forceSessionUpdate = () => sessionManager.forceSessionUpdate();

// Funciones específicas por rol
export const getMaestroSession = () => SessionManager.getInstance('Maestro');
export const getAlumnoSession = () => SessionManager.getInstance('Alumno');
export const getDirectorSession = () => SessionManager.getInstance('Director');
export const getSupervisorSession = () => SessionManager.getInstance('Supervisor');

export const sessionManager = SessionManager.getInstance();
export default sessionManager;