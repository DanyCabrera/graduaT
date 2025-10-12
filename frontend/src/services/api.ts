// Servicio de API base

import { API_BASE_URL } from '../constants';
import { sessionManager } from '../utils/sessionManager';

// Sistema de tokens aislados por pestaña
class TabTokenManager {
  private static instance: TabTokenManager;
  private tabId: string;
  private tabToken: string | null = null;
  private tabUserData: any = null;

  private constructor() {
    this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.initializeTabToken();
  }

  public static getInstance(): TabTokenManager {
    if (!TabTokenManager.instance) {
      TabTokenManager.instance = new TabTokenManager();
    }
    return TabTokenManager.instance;
  }

  private initializeTabToken() {
    // Capturar el token y datos del usuario al inicializar esta pestaña
    this.refreshTokenFromStorage();
  }

  private refreshTokenFromStorage() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      this.tabToken = token;
      try {
        this.tabUserData = JSON.parse(userData);
        console.log(`🔒 Token aislado para pestaña ${this.tabId}:`, {
          role: this.tabUserData.Rol,
          user: this.tabUserData.Usuario
        });
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
      }
    } else {
      console.log(`⚠️ No se encontró token o datos de usuario para pestaña ${this.tabId}`);
      console.log('Token disponible:', !!token);
      console.log('Datos de usuario disponibles:', !!userData);
    }
  }

  public getToken(): string | null {
    // Si no hay token, intentar refrescar desde localStorage
    if (!this.tabToken) {
      this.refreshTokenFromStorage();
    }
    return this.tabToken;
  }

  public getUserData(): any {
    // Si no hay datos de usuario, intentar refrescar desde localStorage
    if (!this.tabUserData) {
      this.refreshTokenFromStorage();
    }
    return this.tabUserData;
  }

  public getTabId(): string {
    return this.tabId;
  }

  public updateToken(newToken: string, newUserData: any) {
    this.tabToken = newToken;
    this.tabUserData = newUserData;
    console.log(`🔄 Token actualizado para pestaña ${this.tabId}:`, {
      role: newUserData.Rol,
      user: newUserData.Usuario
    });
  }

  public forceRefresh() {
    this.refreshTokenFromStorage();
  }
}

const tabTokenManager = TabTokenManager.getInstance();

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación aislado por pestaña
    const token = tabTokenManager.getToken();
    const userData = tabTokenManager.getUserData();
    
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        'X-Tab-ID': tabTokenManager.getTabId(), // Identificador único de pestaña
      };
      console.log(`✅ Token aislado agregado a headers (${tabTokenManager.getTabId()}):`, {
        role: userData?.Rol,
        user: userData?.Usuario
      });
      // Refrescar la sesión para mantenerla activa
      sessionManager.refreshSession();
    } else {
      console.log('❌ No se encontró token de autenticación aislado');
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // Si no se puede parsear como JSON, usar el texto plano
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        console.error('❌ Error response:', errorMessage);
        
        // Manejo de errores con reintentos para problemas de conexión
        if (response.status === 401) {
          console.log('⚠️ Token expirado o inválido, pero manteniendo sesión para otras pestañas');
          // No hacer nada - dejar que el componente maneje el error
        } else if (response.status === 403) {
          console.log('⚠️ Acceso denegado - posible cambio de rol en otra pestaña');
          // No limpiar automáticamente - puede ser un conflicto de sesiones
        } else if (response.status >= 500 && retryCount < 2) {
          // Reintentar en errores del servidor
          console.log(`🔄 Reintentando petición (${retryCount + 1}/2) para ${endpoint}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Delay incremental
          return this.request<T>(endpoint, options, retryCount + 1);
        } else if (response.status === 0 || response.status >= 500) {
          // Error de conexión o servidor
          if (retryCount < 2) {
            console.log(`🔄 Reintentando por error de conexión (${retryCount + 1}/2) para ${endpoint}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return this.request<T>(endpoint, options, retryCount + 1);
          }
        }
        
        // Crear un error personalizado con el mensaje del backend
        const customError = new Error(errorMessage);
        (customError as any).status = response.status;
        throw customError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Método para actualizar el token de la pestaña
  updateTabToken(token: string, userData: any) {
    tabTokenManager.updateToken(token, userData);
  }

  // Método para forzar la actualización del token desde localStorage
  refreshTabToken() {
    tabTokenManager.forceRefresh();
  }

  // Método para obtener información de la pestaña
  getTabInfo() {
    return {
      tabId: tabTokenManager.getTabId(),
      hasToken: !!tabTokenManager.getToken(),
      userRole: tabTokenManager.getUserData()?.Rol,
      userEmail: tabTokenManager.getUserData()?.Usuario
    };
  }
}

export const apiService = new ApiService();
