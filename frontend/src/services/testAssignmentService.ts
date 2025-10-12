import { apiService } from './api';

// Interfaces para las asignaciones de tests
export interface TestAssignment {
    _id: string;
    testId: string;
    testType: 'matematicas' | 'comunicacion';
    studentIds: string[];
    fechaAsignacion: string;
    fechaVencimiento: string;
    estado: 'asignado' | 'completado' | 'vencido';
    test?: {
        _id: string;
        titulo: string;
        descripcion: string;
        preguntas: Pregunta[];
        duracion: number;
        dificultad: string;
        semana: number;
        curso: string;
    };
    result?: {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        earnedPoints: number;
        totalPoints: number;
        pointsPerQuestion: number;
        timeSpent?: number;
        completedAt?: string;
    };
}

export interface Pregunta {
    nombre: string;
    url: string;
    respuesta: string;
    _id: string;
}

export interface TestResponse {
    success: boolean;
    data: TestAssignment[];
    message: string;
}

export interface SubmitTestResponse {
    success: boolean;
    data: {
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        earnedPoints: number;
        totalPoints: number;
        pointsPerQuestion: number;
        timeSpent: number;
    };
    message: string;
}

export interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    studentId: string;
    testId: string;
    testType: string;
    score: number;
    createdAt: string;
    read: boolean;
}

export interface NotificationResponse {
    success: boolean;
    data: Notification[];
    message: string;
}

class TestAssignmentService {
    // Obtener tests asignados al alumno actual
    async getAssignedTests(): Promise<TestResponse> {
        return apiService.get<TestResponse>('/test-assignments/student');
    }

    // Obtener tests asignados para el maestro (para mostrar cuáles están tachados)
    async getAssignedTestsForTeacher(): Promise<TestResponse> {
        return apiService.get<TestResponse>('/test-assignments/teacher/assigned');
    }

    // Obtener un test específico para responder
    async getTestForStudent(testId: string, testType: 'matematicas' | 'comunicacion'): Promise<TestResponse> {
        return apiService.get<TestResponse>(`/test-assignments/student/${testType}/${testId}`);
    }

    // Enviar respuestas del test
    async submitTest(testId: string, testType: 'matematicas' | 'comunicacion', answers: { [questionId: string]: string }): Promise<SubmitTestResponse> {
        return apiService.post<SubmitTestResponse>(`/test-assignments/student/${testType}/${testId}/submit`, {
            answers,
            timestamp: new Date().toISOString()
        });
    }

    // Obtener historial de tests completados
    async getTestHistory(): Promise<TestResponse> {
        return apiService.get<TestResponse>('/test-assignments/student/history');
    }

    // Obtener resultados de tests del estudiante
    async getStudentTestResults(): Promise<{ success: boolean; data: any[]; message: string }> {
        return apiService.get<{ success: boolean; data: any[]; message: string }>('/test-assignments/student/results');
    }

    // Obtener resultados de tests de estudiantes (para maestros)
    async getTeacherStudentTestResults(): Promise<{ success: boolean; data: any[]; message: string }> {
        return apiService.get<{ success: boolean; data: any[]; message: string }>('/test-assignments/teacher/results');
    }

    // Obtener notificaciones para el maestro
    async getNotifications(): Promise<NotificationResponse> {
        return apiService.get<NotificationResponse>('/test-assignments/teacher/notifications');
    }

    // Marcar notificación como leída
    async markNotificationAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
        return apiService.put<{ success: boolean; message: string }>(`/test-assignments/teacher/notifications/${notificationId}/read`);
    }

    // Limpiar todos los tests asignados
    async clearAllTestAssignments(): Promise<{ success: boolean; message: string; data?: any }> {
        return apiService.delete<{ success: boolean; message: string; data?: any }>('/test-assignments/teacher/clear-all');
    }
}

export const testAssignmentService = new TestAssignmentService();
