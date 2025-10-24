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

import { Calendar } from 'lucide-react'

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

    // Verificar que el usuario sea maestro (solo una vez al cargar)
    useEffect(() => {
        const checkUserRole = () => {
            // Usar los datos del prop userData en lugar de localStorage para evitar conflictos
            if (userData) {
                if (userData.Rol !== 'Maestro') {
                    console.warn('⚠️ Usuario no es maestro:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Maestro`));
                } else {
                    console.log('✅ Usuario es maestro, sesión válida');
                    setSessionError(null);
                }
            } else {
                // Fallback a localStorage solo si no hay userData
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
        
        // NO escuchar cambios en localStorage para evitar conflictos entre pestañas
        // Cada pestaña mantiene su propia sesión aislada
        console.log('🔒 Panel de Maestro: Sesión aislada, no escuchando cambios de localStorage');
    }, [userData]);

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
                return (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Agenda />
                    </Box>
                );
            case 'alumnos':
                return (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Alumno />
                    </Box>
                );
            case 'historial':
                return (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Historial 
                            refreshTrigger={historialRefreshTrigger} 
                            onNotificationCountChange={updateNotificationCount}
                        />
                    </Box>
                );
            case 'tests':
                return (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Test onTestsCleared={refreshHistorial} />
                    </Box>
                );
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
                                                width: {xs: '300px', sm: '700px', md: '700px'}, 
                                                minHeight: {xs: '450px', sm: '300px', md: '300px'}, 
                                                borderRadius: 4,
                                                border: 1,
                                                borderColor: '#00000019',
                                                mb: {xs: 8, sm: 4, md: 4},
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                bgcolor: '#ededed77'
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
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: {xs: 'column', sm: 'row', md: 'row'},
                                                    width: {xs: '300px', sm: '700px', md: '700px'},
                                                    height: {xs: '450px', sm: '300px', md: '300px'},
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    p: 2
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={cursoInfo.imagen}
                                                    alt={cursoInfo.titulo}
                                                    sx={{ 
                                                        height: {xs: '60%', sm: '100%'}, 
                                                        objectFit: 'contain',
                                                        p: 2,
                                                    }}
                                                />
                                                <CardContent    
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'start',
                                                        p: 2
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            fontSize: {xs: '1.1rem', sm: '1.5rem'}
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
                                                        startIcon={<Calendar />}
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