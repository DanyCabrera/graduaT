import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Footer from "../footer";

const Alumno: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', justifyContent: 'center' }}>
            {/* Navbar */}
            <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginLeft: 3 }}>
                        Estudiante
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button color="inherit">Inicio</Button>
                        <Button color="inherit">PruebaT</Button>
                        <Button color="inherit">Progreso</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Contenido principal */}
            <Box sx={{ p: 5, maxWidth: "1200px", margin: "0 auto", minHeight: "60vh", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Saludo */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
                        Hola, Keyri Obando
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", mt: 1 }}>
                        Estudiante de Ingeniería en Sistemas, Universidad Central
                    </Typography>
                </Box>

                {/* Título de cursos */}
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Mis Cursos
                </Typography>

                {/* Grid de cursos */}
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
                                        Profesor: Dr. Carlos Pérez
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
                                        Profesora: Lic. Ana García
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
            </Box>
            <Footer />
        </Box>
    );
};

export default Alumno;