import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { FooterMaestro } from "../../../components/layout/footer";
import Navbar from "../../../components/common/Maestro/navbar";
import Agenda from "../../../components/common/Maestro/agenda";
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

    const handleNavigation = (section: string) => {
        // Redirigir a la ruta correspondiente
        switch (section) {
            case 'inicio':
                window.location.href = '/maestro';
                break;
            case 'alumnos':
                window.location.href = '/maestro/alumnos';
                break;
            case 'agenda':
                window.location.href = '/maestro/agenda';
                break;
            case 'historial':
                window.location.href = '/maestro/historial';
                break;
            case 'tests':
                window.location.href = '/maestro/tests';
                break;
        }
    };

    const clearSessionError = () => {
        setSessionError(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh' }}>
                <Navbar
                    onLogout={handleLogout}
                    onNavigate={handleNavigation}
                    currentSection="agenda"
                />
                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Agenda />
                </Box>
                <FooterMaestro />
            </Box>
            
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
