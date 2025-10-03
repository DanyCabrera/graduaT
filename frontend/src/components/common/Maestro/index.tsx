// maestro.tsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Fade from "@mui/material/Fade";
import { FooterMaestro }  from '../../layout/footer';

import Navbar from "./navbar";
import Agenda from "./agenda";
import Alumno from "./alumnos";
import Historial from "./historial";
import Test from "./test";


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

    const handleNavigation = (section: string) => {
        setCurrentSection(section);
    };

    // Definir información de cursos disponibles
    const cursosDisponibles = {
        'Matemáticas': {
            titulo: 'Matemáticas',
            descripcion: 'Curso de matemáticas básicas',
            imagen: 'https://media.istockphoto.com/id/1026884078/es/vector/ni%C3%B1os-ni%C3%B1o-y-ni%C3%B1a-aprender-matem%C3%A1ticas-con-la-ilustraci%C3%B3n-de-libros-abiertos.jpg?s=612x612&w=0&k=20&c=ZoKy5yqnbLyHkdCvXOyWY_wrAx9yvwdBGjJHZj14lwY=',
            url: 'https://es.khanacademy.org/math'
        },
        'Comunicación y lenguaje': {
            titulo: 'Comunicación y Lenguaje',
            descripcion: 'Curso de lectura y escritura',
            imagen: 'https://i.pinimg.com/736x/9f/1d/9a/9f1d9ab4830d2e82efe8ed95cd4be5eb.jpg',
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
                        <Historial />
                    </Box>
                );
            case 'tests':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Test />
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

                        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", marginLeft: 35 }}>
                            Mis Cursos
                        </Typography>

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
                                        <Card key={index} sx={{ width: 500, minHeight: 500 }} elevation={4}>
                                            <CardActionArea
                                                onClick={() => window.location.href = cursoInfo.url}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    sx={{ height: 380, objectFit: "cover" }}
                                                    image={cursoInfo.imagen}
                                                    alt={cursoInfo.titulo}
                                                />
                                                <CardContent>
                                                    <Typography variant="h6">{cursoInfo.titulo}</Typography>
                                                    <Typography color="text.secondary">
                                                        {cursoInfo.descripcion}
                                                    </Typography>
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
                    />
                    {renderContent()}
                    <FooterMaestro />
                </Box>
            </Fade>
        </>
    );
};

export default IndexMaestro;