{/* Alumno */ }
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CircularProgress from "@mui/material/CircularProgress";
import { FooterAlumno } from "../../layout/footer";
import Navbar from "./navbar";

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

    // Debug: Mostrar el estado actual
    console.log('🔍 Alumno - Estado actual:');
    console.log('🔍 Alumno - maestrosPorCurso:', maestrosPorCurso);
    console.log('🔍 Alumno - loadingMaestros:', loadingMaestros);

    useEffect(() => {
        fetchMaestros();
    }, []);

    const fetchMaestros = async () => {
        try {
            setLoadingMaestros(true);
            console.log('🔍 Alumno - Iniciando fetch de maestros...');
            
            // Obtener el token del localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('🔍 Alumno - No hay token disponible');
                setLoadingMaestros(false);
                return;
            }
            
            console.log('🔍 Alumno - Token encontrado:', token ? 'Sí' : 'No');
            
            const response = await fetch('http://localhost:3001/api/maestros/for-alumno', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('🔍 Alumno - Response status:', response.status);
            console.log('🔍 Alumno - Response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('🔍 Alumno - Datos completos recibidos:', data);
                console.log('🔍 Alumno - data.data:', data.data);
                console.log('🔍 Alumno - data.success:', data.success);
                
                if (data.success && data.data) {
                    console.log('🔍 Alumno - Estableciendo maestrosPorCurso:', data.data);
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
        window.location.href = 'http://localhost:5173';
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: '100vh', justifyContent: 'center' }}>

            <Navbar onLogout={handleLogout} />
            {/* Contenido principal */}
            <Box sx={{ flexGrow: 1, p: 5, maxWidth: "1200px", margin: "0 auto", minHeight: "60vh", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                {/* Saludo */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
                        Hola, {userData ? `${userData.Nombre} ${userData.Apellido}` : 'Estudiante'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", mt: 1 }}>
                        Estudiante de {userData?.Nombre_Institución || 'tu institución'}
                    </Typography>
                </Box>

                {/* Título de cursos */}
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Mis Cursos
                </Typography>

                {/* Grid de cursos */}
                {loadingMaestros ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Cargando información de maestros...</Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {/* Curso 1: Matemáticas */}
                        <Card sx={{ flex: 1, minWidth: 300, borderRadius: 2, boxShadow: 3 }}>
                            <CardActionArea
                                onClick={() => (window.location.href = "https://es.khanacademy.org/math")}
                            >
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", p: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                                            Matemáticas
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {(() => {                                                
                                                if (maestrosPorCurso['Matemáticas'] && maestrosPorCurso['Matemáticas'].length > 0) {
                                                    return `Profesor: ${maestrosPorCurso['Matemáticas'][0].nombre}`;
                                                } else {
                                                    return 'Profesor: No asignado';
                                                }
                                            })()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 120, height: 120, objectFit: "cover" }}
                                            image="https://img.freepik.com/vector-premium/ninos-objetos-matematicos_1639-28398.jpg"
                                            alt="Matemáticas"
                                        />
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>

                        {/* Curso 2: Comunicación y Lenguaje */}
                        <Card sx={{ flex: 1, minWidth: 300, borderRadius: 2, boxShadow: 3 }}>
                            <CardActionArea
                                onClick={() => (window.location.href = "https://es.khanacademy.org/humanities/grammar")}
                            >
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", p: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                                            Comunicación y Lenguaje
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {(() => {                                                
                                                if (maestrosPorCurso['Comunicación y lenguaje'] && maestrosPorCurso['Comunicación y lenguaje'].length > 0) {
                                                    return `Profesor: ${maestrosPorCurso['Comunicación y lenguaje'][0].nombre}`;
                                                } else {
                                                    return 'Profesor: No asignado';
                                                }
                                            })()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 120, height: 120, objectFit: "cover" }}
                                            image="https://img.freepik.com/vector-gratis/bocadillo-dialogo-libro-lectura-nina_1308-105700.jpg"
                                            alt="Comunicación y Lenguaje"
                                        />
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Box>
                )}
            </Box>
            <FooterAlumno />
        </Box>
    );
}