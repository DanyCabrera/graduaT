import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { FooterAlumno } from "../../../components/layout/footer";
import Navbar from "../../../components/common/Alumno/navbar";
import Comunicacion from "../../../components/common/Comunicacion/index";
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

interface ComunicacionPageProps {
    userData?: UserData | null;
}

export default function ComunicacionPage({ userData }: ComunicacionPageProps) {
    const [sessionError, setSessionError] = useState<Error | null>(null);

    // Verificar que el usuario sea alumno
    useEffect(() => {
        const checkUserRole = () => {
            // Si no hay userData como prop, obtenerlo del localStorage
            if (!userData) {
                const storedUser = localStorage.getItem('user_data');
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser);
                        if (user.Rol !== 'Alumno') {
                            console.warn('⚠️ Usuario no es alumno:', user.Rol);
                            setSessionError(new Error(`Acceso denegado. Rol actual: ${user.Rol}. Se requiere rol: Alumno`));
                        } else {
                            console.log('✅ Usuario es alumno, sesión válida');
                            setSessionError(null);
                        }
                    } catch (error) {
                        console.error('Error al verificar rol de usuario:', error);
                        setSessionError(new Error('Error al cargar datos del usuario'));
                    }
                } else {
                    setSessionError(new Error('No se encontraron datos del usuario'));
                }
            } else {
                if (userData.Rol !== 'Alumno') {
                    console.warn('⚠️ Usuario no es alumno:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Alumno`));
                } else {
                    console.log('✅ Usuario es alumno, sesión válida');
                    setSessionError(null);
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
                window.location.href = '/alumno';
                break;
            case 'progreso':
                window.location.href = '/alumno/progreso';
                break;
            case 'matematicas':
                window.location.href = '/alumno/matematicas';
                break;
            case 'comunicacion':
                window.location.href = '/alumno/comunicacion';
                break;
        }
    };

    const clearSessionError = () => {
        setSessionError(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh', justifyContent: 'center' }}>
                <Navbar
                    onLogout={handleLogout}
                    onNavigate={handleNavigation}
                    currentSection="comunicacion"
                />
                <Box sx={{ 
                    flexGrow: 1, 
                    p: { xs: 2, sm: 3, md: 5 }, 
                    maxWidth: "1200px", 
                    margin: "0 auto", 
                    minHeight: "60vh" 
                }}>
                    <Comunicacion />
                </Box>
                <FooterAlumno />
            </Box>
            
            <SessionErrorHandler
                error={sessionError}
                onRetry={() => {
                    clearSessionError();
                    window.location.reload();
                }}
                onClearError={clearSessionError}
                context="alumno"
            />
        </>
    );
}
