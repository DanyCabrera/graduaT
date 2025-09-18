import { useEffect, useState } from "react";
import { Card, CardContent, Button, Typography, TextField, Box, IconButton, Fade } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Login() {
    // Estado para almacenar el rol seleccionado
    const [selectedRol, setSelectedRol] = useState<string | null>(null);
    const navigate = useNavigate();

    // Efecto para obtener el rol seleccionado del almacenamiento local
    useEffect(() => {
        const rol = localStorage.getItem("selectedRol");
        setSelectedRol(rol);
    }, []);

    const handleBackToPanel = () => {
        navigate('/panelRol');
    };

    const FormularioSupervisorDirector = () => {
        return (
            <Fade in timeout={800}>
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 3,
                        backgroundColor: "#fafafa",
                    }}
                >
                    {/* Botón de regreso */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                        }}
                    >
                        <IconButton
                            onClick={handleBackToPanel}
                            sx={{
                                backgroundColor: "white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                    </Box>

                    <Card
                        variant="outlined"
                        sx={{
                            width: { xs: "95%", sm: "500px" },
                            maxWidth: "500px",
                            padding: 0,
                            borderRadius: 2,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <CardContent sx={{ padding: 4 }}>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                sx={{
                                    marginBottom: 3,
                                    fontWeight: 300,
                                    color: "#333",
                                    fontSize: "1.75rem",
                                }}
                            >
                                Registro {selectedRol}
                            </Typography>

                            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Correo"
                                    type="email"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    type="password"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Código de Rol"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        marginTop: 2,
                                        padding: 1.5,
                                        backgroundColor: "#333",
                                        borderRadius: 1,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 400,
                                        "&:hover": {
                                            backgroundColor: "#555",
                                        },
                                    }}
                                >
                                    Registrar
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        );
    };

    const FormularioMaestroAlumno = () => {
        return (
            <Fade in timeout={800}>
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 3,
                        backgroundColor: "#fafafa",
                    }}
                >
                    {/* Botón de regreso */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                        }}
                    >
                        <IconButton
                            onClick={handleBackToPanel}
                            sx={{
                                backgroundColor: "white",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                    </Box>

                    <Card
                        variant="outlined"
                        sx={{
                            width: { xs: "95%", sm: "500px" },
                            maxWidth: "500px",
                            padding: 0,
                            borderRadius: 2,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            border: "1px solid #e0e0e0",
                        }}
                    >
                        <CardContent sx={{ padding: 4 }}>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                sx={{
                                    marginBottom: 3,
                                    fontWeight: 300,
                                    color: "#333",
                                    fontSize: "1.75rem",
                                }}
                            >
                                Registro {selectedRol}
                            </Typography>

                            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Apellido"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Teléfono"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Correo"
                                    type="email"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Confirmar Contraseña"
                                    type="password"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        marginTop: 2,
                                        padding: 1.5,
                                        backgroundColor: "#333",
                                        borderRadius: 1,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 400,
                                        "&:hover": {
                                            backgroundColor: "#555",
                                        },
                                    }}
                                >
                                    Registrar
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        );
    };

    return (
        <>
            {/* Mostrar formulario dependiendo con qué rol esté entrando */}
            {/* formulario para Supervisor/Director */}
            {selectedRol === "Supervisor" || selectedRol === "Director" ? <FormularioSupervisorDirector /> : null}

            {/* formulario para Maestro/Alumno */}
            {selectedRol === "Maestro" || selectedRol === "Alumno" ? <FormularioMaestroAlumno /> : null}
        </>
    );
}