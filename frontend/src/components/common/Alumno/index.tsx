{/* Alumno */ }
import { API_BASE_URL } from "../../../constants/index";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import { FooterAlumno } from "../../layout/footer";
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import Navbar from "./navbar";
import Progreso from "./progreso";
import { SessionErrorHandler } from '../SessionErrorHandler';
import { apiService } from '../../../services/api';
// import { getAlumnoSession } from '../../utils/sessionManager';

//Logo de los cursos
import LogoMatematica from "../../../assets/TortuMate.png";
import LogoComunicacion from "../../../assets/TortuLenguaje.png";

//Cursos
import Matematica from "../Matematica/index";
import Comunicacion from "../Comunicacion/index";

import {
    BookOpen
} from 'lucide-react'

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

interface MaestroInfo {
    nombre: string;
    correo: string;
    telefono: string;
}

interface MaestrosPorCurso {
    [curso: string]: MaestroInfo[];
}

interface IndexAlumnoProps {
    userData?: UserData | null;
}

export default function IndexAlumno({ userData }: IndexAlumnoProps) {
    const [maestrosPorCurso, setMaestrosPorCurso] = useState<MaestrosPorCurso>({});
    const [loadingMaestros, setLoadingMaestros] = useState(true);
    const [currentSection] = useState('inicio');
    const [sessionError, setSessionError] = useState<Error | null>(null);

    // Verificar que el usuario sea alumno (solo una vez al cargar)
    useEffect(() => {
        const checkUserRole = () => {
            // Usar los datos del prop userData en lugar de localStorage para evitar conflictos
            if (userData) {
                if (userData.Rol !== 'Alumno') {
                    console.warn('⚠️ Usuario no es alumno:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Alumno`));
                } else {
                    console.log('✅ Usuario es alumno, sesión válida');
                    setSessionError(null);
                }
            } else {
                // Fallback a localStorage solo si no hay userData
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
                    }
                }
            }
        };

        checkUserRole();
        
        // NO escuchar cambios en localStorage para evitar conflictos entre pestañas
        // Cada pestaña mantiene su propia sesión aislada
        console.log('🔒 Panel de Alumno: Sesión aislada, no escuchando cambios de localStorage');
    }, [userData]);

    useEffect(() => {
        // Forzar la actualización del token al cargar el componente
        apiService.refreshTabToken();
        fetchMaestros();
    }, []);

    const fetchMaestros = async () => {
        try {
            setLoadingMaestros(true);

            // Obtener el token del localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setLoadingMaestros(false);
                return;
            }


            const response = await fetch(`${API_BASE_URL}/maestros/for-alumno`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });


            if (response.ok) {
                const data = await response.json();

                if (data.success && data.data) {
                    setMaestrosPorCurso(data.data);
                } else {
                    console.error('🔍 Alumno - Respuesta no exitosa o sin datos:', data);
                }
            } else {
                const errorData = await response.json();
                console.error('🔍 Alumno - Error en respuesta:', errorData);
            }
        } catch (error) {
            console.error('🔍 Alumno - Error al obtener maestros:', error);
        } finally {
            setLoadingMaestros(false);
        }
    };

    const handleLogout = () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_role');

        // Redirigir al inicio
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

    // const handleSessionError = (error: Error) => {
    //     console.log('🚨 Error de sesión en alumno:', error);
    //     setSessionError(error);
    // };

    const clearSessionError = () => {
        setSessionError(null);
    };

    const renderContent = () => {
        switch (currentSection) {
            case 'progreso':
                return (
                    <Box sx={{ 
                        p: { xs: 1, sm: 2, md: 4 }, 
                        textAlign: 'center',
                        minWidth: "100%", 
                        margin: "0 auto"
                    }}>
                        <Progreso />
                    </Box>
                );
            case 'matematicas':
                return (
                    <Box sx={{ 
                        flexGrow: 1, 
                        p: { xs: 2, sm: 3, md: 5 }, 
                        maxWidth: "1200px", 
                        margin: "0 auto", 
                        minHeight: "60vh" 
                    }}>
                        <Matematica />
                    </Box>
                );
            case 'comunicacion':
                return (
                    <Box sx={{ 
                        flexGrow: 1, 
                        p: { xs: 2, sm: 3, md: 5 }, 
                        maxWidth: "1200px", 
                        margin: "0 auto", 
                        minHeight: "60vh" 
                    }}>
                        <Comunicacion />
                    </Box>
                );
            default:
                return (
                    <Box sx={{ 
                        flexGrow: 1, 
                        p: { xs: 2, sm: 3, md: 2 }, 
                        mb: { xs: 12, sm: 12, md: 4 },
                        minWidth: "90%", 
                        maxWidth: "100%",
                        margin: "0 auto", 
                        minHeight: "60vh", 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center' 
                    }}>

                        {/* Saludo */}
                        <Box 
                            sx={{ 
                                mb: { xs: 2, sm: 3, md: 4 },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: { xs: 'column', sm: 'column', md: 'column' },
                            }}
                        >
                            <Typography variant="h4" sx={{ 
                                fontWeight: "bold", 
                                color: "#333",
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                            }}>
                                Bienvenido, {userData ? `${userData.Nombre} ${userData.Apellido}` : 'Estudiante'}
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: "#666", 
                                mt: 1,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}>
                                {userData?.Nombre_Institución || 'tu institución'}
                            </Typography>
                        </Box>

                        {/* Grid de cursos */}
                        {loadingMaestros ? (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                py: 4,
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 2 },
                            }}>
                                <CircularProgress size={24} />
                                <Typography sx={{ 
                                    ml: { xs: 0, sm: 2 },
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}>
                                    Cargando información de maestros...
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                gap: { xs: 2, sm: 3, md: 4 },
                            }}>
                                {/* Curso 1: Matemáticas */}
                                <Card sx={{
                                    height: { xs: 590, sm: 590, md: 280 },
                                    width: { xs: 330, sm: 330, md: 880 },
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    border: 1,
                                    borderColor: '#e0e0e0',
                                    '&:hover': {
                                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                                    }
                                }}>
                                    <CardActionArea 
                                        onClick={() => handleNavigation('matematicas')}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'start',
                                            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                        }}
                                        >
                                        <CardMedia
                                            component="img"
                                            image={LogoMatematica}
                                            alt="Matemáticas"
                                            sx={{
                                                display: 'block',
                                                margin: '0 auto',
                                                height: { xs: 380, sm: 300, md: 280 },
                                                width: { xs: 380, sm: 300, md: 280 },
                                                objectFit: "contain",
                                                p: { xs: 1, sm: 2 },
                                            }}
                                        />
                                        <Divider />
                                        <Box sx={{ p: { xs: 2, sm: 3 } }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: '#2c3e50',
                                                fontSize: { xs: '1rem', sm: '1.25rem' }
                                            }}>
                                                Matemáticas
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#34495e',
                                                mb: 2,
                                                fontWeight: 500,
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                            }}>
                                                {maestrosPorCurso['Matemáticas']?.length > 0
                                                    ? `Prof. ${maestrosPorCurso['Matemáticas'][0].nombre}`
                                                    : 'Profesor no asignado'
                                                }
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                lineHeight: 1.6,
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                            }}>
                                                Curso fundamental que desarrolla el pensamiento lógico y habilidades para resolver problemas matemáticos.
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color= 'primary'
                                                startIcon={<BookOpen />}
                                                sx={{
                                                    mt: 2
                                                }}
                                            >
                                                Ver más
                                            </Button>
                                        </Box>
                                    </CardActionArea>
                                </Card>

                                {/* Curso 2: Comunicación y Lenguaje */}
                                <Card sx={{
                                    height: { xs: 590, sm: 590, md: 280 },
                                    width: { xs: 330, sm: 330, md: 880 },
                                    borderRadius: 3,
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    border: 1,
                                    borderColor: '#e0e0e0',
                                    '&:hover': {
                                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                                    }
                                }}>
                                    <CardActionArea 
                                        onClick={() => handleNavigation('comunicacion')}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'start',
                                            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                display: 'block',
                                                margin: '0 auto',
                                                height: { xs: 380, sm: 300, md: 280 },
                                                width: { xs: 380, sm: 300, md: 280 },
                                                objectFit: "contain",
                                                p: { xs: 1, sm: 2 },
                                            }}
                                            image={LogoComunicacion}
                                            alt="Comunicación y Lenguaje"
                                        />
                                        <Divider />
                                        <Box sx={{ p: { xs: 2, sm: 3 } }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: '#2c3e50',
                                                fontSize: { xs: '1rem', sm: '1.25rem' }
                                            }}>
                                                Comunicación y Lenguaje
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#34495e',
                                                mb: 2,
                                                fontWeight: 500,
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                            }}>
                                                {maestrosPorCurso['Comunicación y lenguaje']?.length > 0
                                                    ? `Prof. ${maestrosPorCurso['Comunicación y lenguaje'][0].nombre}`
                                                    : 'Profesor no asignado'
                                                }
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                lineHeight: 1.6,
                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                            }}>
                                                Curso que desarrolla habilidades de comunicación efectiva, comprensión lectora y expresión escrita.
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color= 'success'
                                                startIcon={<BookOpen />}
                                                sx={{
                                                    mt: 2
                                                }}
                                            >
                                                Ver más
                                            </Button>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Box>
                        )}
                    </Box>
                );
        }
    };

    return (
        <>
            <Fade in={true} timeout={500}>
                <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh', justifyContent: 'center' }}>
                    <Navbar
                        onLogout={handleLogout}
                        onNavigate={handleNavigation}
                        currentSection={currentSection}
                    />
                    {renderContent()}
                    <FooterAlumno />
                </Box>
            </Fade>
            
            <SessionErrorHandler
                error={sessionError}
                onRetry={() => {
                    clearSessionError();
                    // Recargar la sección actual
                    window.location.reload();
                }}
                onClearError={clearSessionError}
                context="alumno"
            />
            
        </>
    );
}