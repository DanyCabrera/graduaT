// maestro.tsx
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

import { FooterMaestro }  from '../../layout/footer';
import { SessionErrorHandler } from '../SessionErrorHandler';
import { apiService } from '../../../services/api';
// import { getMaestroSession } from '../../utils/sessionManager';

//Secciones del maestro
import Navbar from "./navbar";
import Agenda from "./agenda";
import Alumno from "./alumnos";
import Historial from "./historial";
import Test from "./test";

//Logo de los cursos
import LogoMatematica from "../../../assets/TortuMate.png";
import LogoComunicacion from "../../../assets/TortuLenguaje.png";

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

interface IndexMaestroProps {
    userData?: UserData | null;
}

const IndexMaestro: React.FC<IndexMaestroProps> = ({ userData }) => {
    const [currentSection, setCurrentSection] = useState('inicio');
    const [historialRefreshTrigger, setHistorialRefreshTrigger] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [sessionError, setSessionError] = useState<Error | null>(null);

    // Verificar que el usuario sea maestro
    useEffect(() => {
        const checkUserRole = () => {
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
        };

        checkUserRole();
        
        // Verificar cada vez que cambie el localStorage
        const handleStorageChange = () => {
            checkUserRole();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Forzar la actualización del token al cargar el componente
    useEffect(() => {
        apiService.refreshTabToken();
    }, []);

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
        setCurrentSection(section);
    };

    const refreshHistorial = () => {
        console.log('🔄 Refrescando historial...');
        setHistorialRefreshTrigger(prev => prev + 1);
    };

    const updateNotificationCount = (count: number) => {
        setNotificationCount(count);
    };

    // const handleSessionError = (error: Error) => {
    //     console.log('🚨 Error de sesión en maestro:', error);
    //     setSessionError(error);
    // };

    const clearSessionError = () => {
        setSessionError(null);
    };

    // Definir información de cursos disponibles
    const cursosDisponibles = {
        'Matemáticas': {
            titulo: 'Matemáticas',
            descripcion: 'Curso de matemáticas básicas',
            imagen: LogoMatematica,
            url: 'https://es.khanacademy.org/math'
        },
        'Comunicación y lenguaje': {
            titulo: 'Comunicación y Lenguaje',
            descripcion: 'Curso de lectura y escritura',
            imagen: LogoComunicacion,
            url: 'https://es.khanacademy.org/humanities/grammar'
        }
    };

    // Obtener solo los cursos asignados al maestro
    const cursosAsignados = userData?.CURSO || [];

    const renderContent = () => {
        switch (currentSection) {
            case 'agenda':
                return <Agenda />;
            case 'alumnos':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Alumno />
                    </Box>
                );
            case 'historial':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Historial 
                            refreshTrigger={historialRefreshTrigger} 
                            onNotificationCountChange={updateNotificationCount}
                        />
                    </Box>
                );
            case 'tests':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Test onTestsCleared={refreshHistorial} />
                    </Box>
                );
            case 'mate':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 3 }}>
                            Curso de Matemáticas
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                            Gestiona el contenido y actividades del curso de Matemáticas
                        </Typography>
                        {/* Aquí puedes agregar más contenido específico para matemáticas */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 2, 
                            flexWrap: 'wrap' 
                        }}>
                            <Card sx={{ width: 200, p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Lecciones</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestionar contenido
                                </Typography>
                            </Card>
                            <Card sx={{ width: 200, p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Ejercicios</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Crear actividades
                                </Typography>
                            </Card>
                            <Card sx={{ width: 200, p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Evaluaciones</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Asignar tareas
                                </Typography>
                            </Card>
                        </Box>
                    </Box>
                );
            case 'comu':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 3 }}>
                            Curso de Comunicación y Lenguaje
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                            Gestiona el contenido y actividades del curso de Comunicación y Lenguaje
                        </Typography>
                        {/* Aquí puedes agregar más contenido específico para comunicación */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 2, 
                            flexWrap: 'wrap' 
                        }}>
                            <Card sx={{ width: 200, p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Lectura</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Materiales de lectura
                                </Typography>
                            </Card>
                            <Card sx={{ width: 200, p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Escritura</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ejercicios de escritura
                                </Typography>
                            </Card>
                            <Card sx={{ width: 200, p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Comprensión</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Actividades de comprensión
                                </Typography>
                            </Card>
                        </Box>
                    </Box>
                );
            default:
                return (
                    <Box sx={{flexGrow: 1, p: 7 }}>
                        {/* Saludo */}
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
                                Bienvenido, Prof. {userData ? `${userData.Nombre} ${userData.Apellido}` : 'Maestro'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#666" }}>
                                {userData?.Nombre_Institución || 'tu institución'}
                            </Typography>
                        </Box>

                        {/* Grid de cursos dinámico */}
                        {cursosAsignados.length > 0 ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: 5,
                                }}
                            >
                                {cursosAsignados.map((cursoNombre, index) => {
                                    const cursoInfo = cursosDisponibles[cursoNombre as keyof typeof cursosDisponibles];
                                    if (!cursoInfo) return null;
                                    
                                    return (
                                        <Card 
                                            key={index} 
                                            elevation={0}
                                            sx={{ 
                                                width: 300, 
                                                minHeight: 300, 
                                                borderRadius: 4,
                                                border: 1,
                                                borderColor: '#e2e8f0',
                                                mb: {xs: 8, sm: 4, md: 4}
                                            }} 
                                            >
                                            <CardActionArea
                                                onClick={() => {
                                                    // Determinar qué caso activar basado en el nombre del curso
                                                    if (cursoNombre === 'Matemáticas') {
                                                        setCurrentSection('agenda');
                                                    } else if (cursoNombre === 'Comunicación y lenguaje') {
                                                        setCurrentSection('agenda');
                                                    }
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={cursoInfo.imagen}
                                                    alt={cursoInfo.titulo}
                                                    sx={{ 
                                                        height: '100%', 
                                                        objectFit: 'cover',
                                                        p: 2,
                                                    }}
                                                />
                                                <CardContent>
                                                    <Typography 
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {cursoInfo.titulo}
                                                    </Typography>
                                                    <Typography color="text.secondary">
                                                        {cursoInfo.descripcion}
                                                    </Typography>
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        color="success"
                                                        sx={{
                                                            mt: 2
                                                        }}
                                                    >
                                                        Agenda
                                                    </Button>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No tienes cursos asignados aún
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Contacta con tu administrador para asignarte cursos
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );
        }
    };

    return (
        <>
            <Fade in={true} timeout={800}>
                <Box sx={{display: "flex", flexDirection: "column", minHeight: '100vh'}}>
                    <Navbar 
                        onLogout={handleLogout} 
                        onNavigate={handleNavigation}
                        currentSection={currentSection}
                        notificationCount={notificationCount}
                    />
                    {renderContent()}
                    <FooterMaestro />
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
                context="maestro"
            />
            
        </>
    );
};

export default IndexMaestro;