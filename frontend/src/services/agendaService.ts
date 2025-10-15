import { apiService } from './api';

export interface Tema {
    dia: number;
    titulo: string;
    url: string;
}

export interface AgendaSemana {
    _id?: string;
    semana: number;
    nombre: string;
    temas: Tema[];
}

export interface AgendaResponse {
    success: boolean;
    data: {
        materia: string;
        agenda?: AgendaSemana[];
        semana?: number;
    };
}

export interface AgendaSemanaResponse {
    success: boolean;
    data: {
        materia: string;
        semana: number;
        agenda: AgendaSemana;
    };
}

export interface EstructuraTema {
    tema: string;
    materia: string;
    duracion: number;
    estructura: any;
    fechaGeneracion: string;
}

export interface EstructuraTemaResponse {
    success: boolean;
    message: string;
    data: EstructuraTema;
}

class AgendaService {
    // Obtener toda la agenda del maestro
    async getAgendaMaestro(): Promise<AgendaResponse> {
        return apiService.get<AgendaResponse>('/agenda');
    }

    // Generar nueva agenda (siguiente semana)
    async generarNuevaAgenda(semana?: number): Promise<AgendaSemanaResponse> {
        const url = semana ? `/agenda/generar?semana=${semana}` : '/agenda/generar';
        return apiService.post<AgendaSemanaResponse>(url);
    }

    // Obtener agenda de una semana específica
    async getAgendaSemana(semana: number): Promise<AgendaSemanaResponse> {
        return apiService.get<AgendaSemanaResponse>(`/agenda/semana/${semana}`);
    }

    // Generar estructura de tema usando Gemini
    async generarEstructuraTema(tema: string, materia: string, duracion?: number): Promise<EstructuraTemaResponse> {
        return apiService.post<EstructuraTemaResponse>('/gemini/estructura-tema', {
            tema,
            materia,
            duracion: duracion || 45
        });
    }
}

export const agendaService = new AgendaService();
