import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import NavbarDirector from "../../../components/common/Director/navbar";
import Alumnos from "../../../components/common/Director/alumnos";
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
}

interface AlumnosPageProps {
    userData?: UserData | null;
}

export default function AlumnosPage({ userData }: AlumnosPageProps) {
    const [sessionError, setSessionError] = useState<Error | null>(null);

    // Verificar que el usuario sea director
    useEffect(() => {
        const checkUserRole = () => {
            if (userData) {
                if (userData.Rol !== 'Director') {
                    console.warn('⚠️ Usuario no es director:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Director`));
                } else {
                    console.log('✅ Usuario es director, sesión válida');
                    setSessionError(null);
                }
            } else {
                const storedUser = localStorage.getItem('user_data');
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser);
                        if (user.Rol !== 'Director') {
                            console.warn('⚠️ Usuario no es director:', user.Rol);
                            setSessionError(new Error(`Acceso denegado. Rol actual: ${user.Rol}. Se requiere rol: Director`));
                        } else {
                            console.log('✅ Usuario es director, sesión válida');
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
                window.location.href = '/director';
                break;
            case 'alumnos':
                window.location.href = '/director/alumnos';
                break;
            case 'maestros':
                window.location.href = '/director/maestros';
                break;
            case 'cursos':
                window.location.href = '/director/cursos';
                break;
            case 'rendimiento':
                window.location.href = '/director/rendimiento';
                break;
            case 'informacion':
                window.location.href = '/director/informacion';
                break;
        }
    };

    const clearSessionError = () => {
        setSessionError(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", minHeight: '100vh' }}>
                <NavbarDirector
                    onLogout={handleLogout}
                    onNavigate={handleNavigation}
                    currentPage="alumnos"
                />
                <Box sx={{ 
                    flexGrow: 1, 
                    ml: '280px', // Ajustar para el sidebar fijo
                    p: 3 
                }}>
                    <Alumnos userData={userData} />
                </Box>
            </Box>
            
            <SessionErrorHandler
                error={sessionError}
                onRetry={() => {
                    clearSessionError();
                    window.location.reload();
                }}
                onClearError={clearSessionError}
                context="director"
            />
        </>
    );
}
