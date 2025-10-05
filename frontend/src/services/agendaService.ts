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
}

export const agendaService = new AgendaService();
