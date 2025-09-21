// maestro.tsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import { FooterMaestro }  from '../../layout/footer';
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

interface IndexMaestroProps {
    userData?: UserData | null;
}

const IndexMaestro: React.FC<IndexMaestroProps> = ({ userData }) => {
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
        <Box sx={{display: "flex", flexDirection: "column", minHeight: '100vh'}}>

            <Navbar onLogout={handleLogout} />
            <Box sx={{flexGrow: 1, p: 7 }}>
                {/* Saludo */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
                        Hola, Prof. {userData ? `${userData.Nombre} ${userData.Apellido}` : 'Maestro'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                        Docente de {userData?.Nombre_Institución || 'tu institución'}
                    </Typography>
                </Box>

                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", marginLeft: 35 }}>
                    Mis Cursos
                </Typography>

                {/* Grid de cursos */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 5,
                    }}
                >
                    {/* Curso 1 */}
                    <Card sx={{ width: 500, minHeight: 500 }} elevation={4}>
                        <CardActionArea
                            onClick={() =>
                                (window.location.href = "https://es.khanacademy.org/math")
                            }
                        >
                            <CardMedia
                                component="img"
                                sx={{ height: 380, objectFit: "cover" }}
                                image="https://media.istockphoto.com/id/1026884078/es/vector/ni%C3%B1os-ni%C3%B1o-y-ni%C3%B1a-aprender-matem%C3%A1ticas-con-la-ilustraci%C3%B3n-de-libros-abiertos.jpg?s=612x612&w=0&k=20&c=ZoKy5yqnbLyHkdCvXOyWY_wrAx9yvwdBGjJHZj14lwY="
                                alt="Matemáticas"
                            />
                            <CardContent>
                                <Typography variant="h6">Matemáticas</Typography>
                                <Typography color="text.secondary">
                                    Curso de matemáticas básicas
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    {/* Curso 2 */}
                    <Card sx={{ width: 500, minHeight: 500 }} elevation={4}>
                        <CardActionArea
                            onClick={() =>
                            (window.location.href =
                                "https://es.khanacademy.org/humanities/grammar")
                            }
                        >
                            <CardMedia
                                component="img"
                                sx={{ height: 380, objectFit: "cover" }}  // 👈 misma altura también aquí
                                image="https://i.pinimg.com/736x/9f/1d/9a/9f1d9ab4830d2e82efe8ed95cd4be5eb.jpg"
                                alt="Comunicación y Lenguaje"
                            />
                            <CardContent>
                                <Typography variant="h6">Comunicación y Lenguaje</Typography>
                                <Typography color="text.secondary">
                                    Curso de lectura y escritura
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Box>
            </Box>
            <FooterMaestro />
        </Box>
    );
};

export default IndexMaestro;