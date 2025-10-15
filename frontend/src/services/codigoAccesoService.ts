// Servicio simplificado para códigos de acceso sin autenticación
import { API_BASE_URL } from '../constants';

export interface CodigoAcceso {
  _id?: string;
  codigo: string;
  tipo: string;
  activo: boolean;
  descripcion?: string;
  fechaCreacion: string;
  generadoPor?: string;
  codigoInstitucion?: string;
  nombreInstitucion?: string;
}

export interface CrearCodigoRequest {
  codigo: string;
  tipo: string;
  descripcion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

class CodigoAccesoService {
  private baseEndpoint = '/api/codigos-acceso';

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 [CodigoAccesoService] URL:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [CodigoAccesoService] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ [CodigoAccesoService] Request failed:', error);
      throw error;
    }
  }

  async crearCodigo(codigoData: CrearCodigoRequest): Promise<ApiResponse<CodigoAcceso>> {
    try {
      console.log('🔍 [CodigoAccesoService] Creando código:', codigoData);
      const response = await this.makeRequest<ApiResponse<CodigoAcceso>>(
        `${this.baseEndpoint}/crear`,
        {
          method: 'POST',
          body: JSON.stringify(codigoData)
        }
      );
      console.log('✅ [CodigoAccesoService] Código creado exitosamente:', response);
      return response;
    } catch (error) {
      console.error('❌ [CodigoAccesoService] Error al crear código:', error);
      throw error;
    }
  }

  async obtenerCodigos(): Promise<ApiResponse<CodigoAcceso[]>> {
    try {
      console.log('🔍 [CodigoAccesoService] Obteniendo códigos');
      const response = await this.makeRequest<ApiResponse<CodigoAcceso[]>>(
        `${this.baseEndpoint}/listar`
      );
      console.log('✅ [CodigoAccesoService] Códigos obtenidos:', response);
      return response;
    } catch (error) {
      console.error('❌ [CodigoAccesoService] Error al obtener códigos:', error);
      throw error;
    }
  }

  async verificarCodigo(codigo: string): Promise<ApiResponse<CodigoAcceso>> {
    try {
      console.log('🔍 [CodigoAccesoService] Verificando código:', codigo);
      const response = await this.makeRequest<ApiResponse<CodigoAcceso>>(
        `${this.baseEndpoint}/verificar`,
        {
          method: 'POST',
          body: JSON.stringify({ codigo })
        }
      );
      console.log('✅ [CodigoAccesoService] Código verificado:', response);
      return response;
    } catch (error) {
      console.error('❌ [CodigoAccesoService] Error al verificar código:', error);
      throw error;
    }
  }
}

export const codigoAccesoService = new CodigoAccesoService();
