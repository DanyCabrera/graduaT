import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { FooterMaestro } from "../../../components/layout/footer";
import Navbar from "../../../components/common/Maestro/navbar";
import Historial from "../../../components/common/Maestro/historial";
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

interface HistorialPageProps {
    userData?: UserData | null;
}

export default function HistorialPage({ userData }: HistorialPageProps) {
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
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh' }}>
                <Navbar
                    onLogout={handleLogout}
                    currentSection="historial"
                />
                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Historial 
                        refreshTrigger={0} 
                        onNotificationCountChange={() => {}}
                    />
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
