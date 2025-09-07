// maestro.tsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";


const Maestro: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white", color: "black", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginLeft: 3 }}>
            Maestro
          </Typography>

          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit">Inicio</Button>
            <Button color="inherit">Alumnos</Button>
            <Button color="inherit">Agenda</Button>
            <Button color="inherit">Historial</Button>
            <Button color="inherit">Tests</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 7 }}>
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
    <Card sx={{ width: 500, minHeight: 500}} elevation={4}>
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
    </Box>
  );
};

export default Maestro;