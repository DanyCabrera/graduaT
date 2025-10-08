{/* Alumno */ }
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
import Navbar from "./navbar";
import Progreso from "./progreso";
import PruebaT from "./pruebaT";

//Logo de los cursos
import LogoMatematica from "../../../assets/TortuMate.png";
import LogoComunicacion from "../../../assets/TortuLenguaje.png";

//Cursos
import Matematica from "../Matematica/index";
import Comunicacion from "../Comunicacion/index";

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
    const [currentSection, setCurrentSection] = useState('inicio');

    useEffect(() => {
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


            const response = await fetch('http://localhost:3001/api/maestros/for-alumno', {
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
        setCurrentSection(section);
    };

    const renderContent = () => {
        switch (currentSection) {
            case 'pruebaT':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <PruebaT />
                    </Box>
                );
            case 'progreso':
                return (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Progreso />
                    </Box>
                );
            case 'matematicas':
                return (
                    <Box sx={{ flexGrow: 1, p: 5, maxWidth: "1200px", margin: "0 auto", minHeight: "60vh" }}>
                        <Matematica />
                    </Box>
                );
            case 'comunicacion':
                return (
                    <Box sx={{ flexGrow: 1, p: 5, maxWidth: "1200px", margin: "0 auto", minHeight: "60vh" }}>
                        <Comunicacion />
                    </Box>
                );
            default:
                return (
                    <Box sx={{ flexGrow: 1, p: 5, maxWidth: "1200px", margin: "0 auto", minHeight: "60vh", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        {/* Saludo */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
                                Bienvenido, {userData ? `${userData.Nombre}` : 'Estudiante'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#666", mt: 1 }}>
                                {userData?.Nombre_Institución || 'tu institución'}
                            </Typography>
                        </Box>

                        {/* Título de cursos */}
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: 'center' }}>
                            Mis cursos
                        </Typography>

                        {/* Grid de cursos */}
                        {loadingMaestros ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Cargando información de maestros...</Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: 4
                            }}>
                                {/* Curso 1: Matemáticas */}
                                <Card sx={{
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    border: 1,
                                    borderColor: '#e0e0e0',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <CardActionArea onClick={() => handleNavigation('matematicas')}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                height: 420,
                                                objectFit: "cover",
                                                p: 2
                                            }}
                                            image={LogoMatematica}
                                            alt="Matemáticas"
                                        />
                                        <Divider />
                                        <Box sx={{ p: 3 }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: '#2c3e50'
                                            }}>
                                                Matemáticas
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#34495e',
                                                mb: 2,
                                                fontWeight: 500
                                            }}>
                                                {maestrosPorCurso['Matemáticas']?.length > 0
                                                    ? `Prof. ${maestrosPorCurso['Matemáticas'][0].nombre}`
                                                    : 'Profesor no asignado'
                                                }
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                lineHeight: 1.6
                                            }}>
                                                Curso fundamental que desarrolla el pensamiento lógico y habilidades para resolver problemas matemáticos.
                                            </Typography>
                                        </Box>
                                    </CardActionArea>
                                </Card>

                                {/* Curso 2: Comunicación y Lenguaje */}
                                <Card sx={{
                                    borderRadius: 3,
                                    backgroundColor: '#fff',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    border: 1,
                                    borderColor: '#e0e0e0',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <CardActionArea onClick={() => handleNavigation('comunicacion')}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                height: 420,
                                                objectFit: "cover",
                                                p: 2
                                            }}
                                            image={LogoComunicacion}
                                            alt="Comunicación y Lenguaje"
                                        />
                                        <Divider />
                                        <Box sx={{ p: 3 }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: '#2c3e50'
                                            }}>
                                                Comunicación y Lenguaje
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#34495e',
                                                mb: 2,
                                                fontWeight: 500
                                            }}>
                                                {maestrosPorCurso['Comunicación y lenguaje']?.length > 0
                                                    ? `Prof. ${maestrosPorCurso['Comunicación y lenguaje'][0].nombre}`
                                                    : 'Profesor no asignado'
                                                }
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                lineHeight: 1.6
                                            }}>
                                                Curso que desarrolla habilidades de comunicación efectiva, comprensión lectora y expresión escrita.
                                            </Typography>
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
        </>
    );
}