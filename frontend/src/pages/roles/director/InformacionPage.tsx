import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import NavbarDirector from "../../../components/common/Director/navbar";
import Informacion from "../../../components/common/Director/informacion";
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

interface InformacionPageProps {
    userData?: UserData | null;
}

export default function InformacionPage({ userData }: InformacionPageProps) {
    const [sessionError, setSessionError] = useState<Error | null>(null);
    const [currentUserData, setCurrentUserData] = useState<UserData | null>(userData || null);

    // Verificar que el usuario sea director
    useEffect(() => {
        const checkUserRole = () => {
            // Si no hay userData como prop, obtenerlo del localStorage
            if (!userData) {
                const storedUser = localStorage.getItem('user_data');
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser);
                        setCurrentUserData(user);
                        if (user.Rol !== 'Director') {
                            console.warn('⚠️ Usuario no es director:', user.Rol);
                            setSessionError(new Error(`Acceso denegado. Rol actual: ${user.Rol}. Se requiere rol: Director`));
                        } else {
                            console.log('✅ Usuario es director, sesión válida');
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
                setCurrentUserData(userData);
                if (userData.Rol !== 'Director') {
                    console.warn('⚠️ Usuario no es director:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Director`));
                } else {
                    console.log('✅ Usuario es director, sesión válida');
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


    const clearSessionError = () => {
        setSessionError(null);
    };

    return (
        <>
            <Box sx={{ display: "flex", minHeight: '100vh' }}>
                <NavbarDirector
                    onLogout={handleLogout}
                    currentPage="informacion"
                />
                <Box sx={{ 
                    flexGrow: 1, 
                    ml: '280px', // Ajustar para el sidebar fijo
                    p: 3 
                }}>
                    <Informacion userData={currentUserData ?? null} />
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
