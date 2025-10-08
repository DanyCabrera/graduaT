import { apiService } from './api';

export interface Pregunta {
    _id?: string;
    nombre: string;
    url: string;
    respuesta: string;
}

export interface Test {
    _id: string;
    titulo: string;
    descripcion: string;
    preguntas: Pregunta[];
    duracion: number; // en minutos
    dificultad: 'facil' | 'media' | 'dificil';
    semana: number;
    curso: 'matematicas' | 'comunicacion';
}

export interface TestsByCourse {
    matematicas: Test[];
    comunicacion: Test[];
}

export interface TestAssignment {
    _id?: string;
    testId: string;
    testType: 'matematicas' | 'comunicacion';
    studentIds: string[];
    fechaAsignacion: Date;
    fechaVencimiento: Date;
    estado: 'asignado' | 'completado' | 'vencido';
    createdAt: Date;
    updatedAt: Date;
}

export interface TestResponse {
    success: boolean;
    data: Test[];
    message: string;
}

export interface TestsByCourseResponse {
    success: boolean;
    data: TestsByCourse;
    message: string;
}

export interface TestAssignmentResponse {
    success: boolean;
    data: TestAssignment;
    message: string;
}

export interface TestAssignmentsResponse {
    success: boolean;
    data: TestAssignment[];
    message: string;
}

class TestService {
    // Obtener todos los tests de matemáticas
    async getTestsMatematicas(): Promise<TestResponse> {
        return apiService.get<TestResponse>('/tests/matematicas');
    }

    // Obtener todos los tests de comunicación
    async getTestsComunicacion(): Promise<TestResponse> {
        return apiService.get<TestResponse>('/tests/comunicacion');
    }

    // Obtener tests organizados por curso
    async getTestsByCourse(): Promise<TestsByCourseResponse> {
        return apiService.get<TestsByCourseResponse>('/tests/by-course');
    }

    // Obtener un test específico por ID y tipo
    async getTestById(id: string, tipo: 'matematicas' | 'comunicacion'): Promise<TestResponse> {
        return apiService.get<TestResponse>(`/tests/${tipo}/${id}`);
    }

    // Asignar test a estudiantes
    async assignTestToStudents(assignment: {
        testIds: string[];
        testType: 'matematicas' | 'comunicacion';
        studentIds: string[];
        fechaAsignacion?: Date;
        fechaVencimiento?: Date;
    }): Promise<TestAssignmentResponse> {
        return apiService.post<TestAssignmentResponse>('/tests/assign', assignment);
    }

    // Obtener asignaciones de tests
    async getTestAssignments(): Promise<TestAssignmentsResponse> {
        return apiService.get<TestAssignmentsResponse>('/tests/assignments');
    }

    // Obtener estudiantes del maestro (para asignación)
    async getStudentsForAssignment(): Promise<{ success: boolean; data: any[]; message: string }> {
        // Esta función debería obtener los estudiantes del maestro actual
        // Por ahora retornamos un array vacío, pero debería integrarse con el servicio de alumnos
        return Promise.resolve({
            success: true,
            data: [],
            message: 'Estudiantes obtenidos exitosamente'
        });
    }
}

export const testService = new TestService();
