import { useState, useEffect } from "react";
import Agenda from "../../../components/common/Maestro/agenda";
import MaestroShell from "../../../components/common/Maestro/MaestroShell";
import { SessionErrorHandler } from '../../../components/common/SessionErrorHandler';
import { apiService } from '../../../services/api';

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución: string;
    Nombre_Institución?: string;
    CURSO?: string[];
}

interface AgendaPageProps {
    userData?: UserData | null;
}

export default function AgendaPage({ userData }: AgendaPageProps) {
    const [sessionError, setSessionError] = useState<Error | null>(null);

    // Verificar que el usuario sea maestro
    useEffect(() => {
        const checkUserRole = () => {
            if (userData) {
                if (userData.Rol !== 'Maestro') {
                    console.warn('⚠️ Usuario no es maestro:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Maestro`));
                } else {
                    console.log('✅ Usuario es maestro, sesión válida');
                    setSessionError(null);
                }
            } else {
                const storedUser = localStorage.getItem('user_data');
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser);
                        if (user.Rol !== 'Maestro') {
                            console.warn('⚠️ Usuario no es maestro:', user.Rol);
                            setSessionError(new Error(`Acceso denegado. Rol actual: ${user.Rol}. Se requiere rol: Maestro`));
                        } else {
                            console.log('✅ Usuario es maestro, sesión válida');
                            setSessionError(null);
                        }
                    } catch (error) {
                        console.error('Error al verificar rol de usuario:', error);
                    }
                }
            }
        };

        checkUserRole();
        apiService.refreshTabToken();
    }, [userData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_role');
        window.location.href = '/';
    };


    const clearSessionError = () => {
        setSessionError(null);
    };

    return (
        <>
            <MaestroShell section="agenda" onLogout={handleLogout}>
                <Agenda />
            </MaestroShell>
            <SessionErrorHandler
                error={sessionError}
                onRetry={() => {
                    clearSessionError();
                    window.location.reload();
                }}
                onClearError={clearSessionError}
                context="maestro"
            />
        </>
    );
}
