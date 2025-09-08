import { useEffect, useState } from "react";
import { Container, Card, CardContent, Button, Typography, TextField } from "@mui/material";

export default function Login() {
    // Estado para almacenar el rol seleccionado
    const [selectedRol, setSelectedRol] = useState<string | null>(null);

    // Efecto para obtener el rol seleccionado del almacenamiento local
    useEffect(() => {
        const rol = localStorage.getItem("selectedRol");
        setSelectedRol(rol);
    }, []);

    const FormularioSupervisorDirector = () => {
        // nombre, apellido, telefono, correo, contraseña, confirmar contraseña, codigo de rol
        return (
            <Container
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: { xs: "90%", sm: "80%", md: "60%" }, // Ancho responsivo
                        padding: 3,
                        borderRadius: 5,
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h5" textAlign="center">
                            Regístrate
                        </Typography>
                        <form
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsivo
                                gap: "16px",
                                width: "100%",
                            }}
                        >
                            <TextField label="Nombre" fullWidth margin="normal" />
                            <TextField label="Apellido" fullWidth margin="normal" />
                            <TextField label="Teléfono" fullWidth margin="normal" />
                            <TextField label="Correo" fullWidth margin="normal" />
                            <TextField label="Contraseña" type="password" fullWidth margin="normal" />
                            <TextField label="Confirmar Contraseña" type="password" fullWidth margin="normal" />
                            <TextField label="Código de Rol" fullWidth margin="normal" />
                        </form>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                width: "100%",
                                marginTop: 2,
                            }}
                        >
                            Registrar
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    };

    const FormularioMaestroAlumno = () => {
        // nombre, apellido, telefono, correo, contraseña, confirmar contraseña
        return (
            <Container
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: { xs: "90%", sm: "80%", md: "60%" }, // Ancho responsivo
                        padding: 3,
                        borderRadius: 5,
                    }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h5" textAlign="center">
                            Regístrate
                        </Typography>
                        <form
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Responsivo
                                gap: "16px",
                                width: "100%",
                            }}
                        >
                            <TextField label="Nombre" fullWidth margin="normal" />
                            <TextField label="Apellido" fullWidth margin="normal" />
                            <TextField label="Teléfono" fullWidth margin="normal" />
                            <TextField label="Correo" fullWidth margin="normal" />
                            <TextField label="Contraseña" type="password" fullWidth margin="normal" />
                            <TextField label="Confirmar Contraseña" type="password" fullWidth margin="normal" />
                        </form>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                width: "100%",
                                marginTop: 2,
                            }}
                        >
                            Registrar
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    };

    return (
        <>
            {/* Mostrar formulario dependiendo con qué rol esté entrando */}
            {/* formulario para Supervisor/Director */}
            {selectedRol === "Supervisor" || selectedRol === "Director" ? (
                <FormularioSupervisorDirector />
            ) : null}

            {/* formulario para Maestro/Alumno */}
            {selectedRol === "Maestro" || selectedRol === "Alumno" ? <FormularioMaestroAlumno /> : null}
        </>
    );
}