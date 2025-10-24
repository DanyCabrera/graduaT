import { useState } from "react";
import { API_BASE_URL } from "../../../constants";
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Fade,
    Alert,
    CircularProgress,
    Divider,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setError("");
        }, 3000)

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: email, // El backend espera 'usuario' pero usamos email
                    contraseña: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar en localStorage para compatibilidad con código existente
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                localStorage.setItem('user_role', data.user.Rol);

                // Redirigir según el rol
                switch (data.user.Rol) {
                    case 'Alumno':
                        navigate('/alumno');
                        break;
                    case 'Maestro':
                        navigate('/maestro');
                        break;
                    case 'Director':
                        navigate('/director');
                        break;
                    case 'Supervisor':
                        navigate('/supervisor');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: {xs: "#ffffffff",sm:"#f8f9fa"}, // Fondo gris claro como en la imagen
                padding: { xs: 2, sm: 1 },
            }}>
            <Fade in timeout={800}>
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "450px" },
                        borderRadius: 3,
                        backgroundColor: {xs: "#ffffffff", sm: "white"},
                        boxShadow: {xs: "0 0px 0px rgba(0, 0, 0, 0)", sm: "0 4px 6px rgba(0, 0, 0, 0.1)"},
                        padding: {xs: 2, sm: 4},
                    }}>
                    {/* Ícono de graduación */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                width: 68,
                                height: 68,
                                backgroundColor: "#37415112",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <GraduationCap size={40} />
                        </Box>
                    </Box>

                    {/* Título de bienvenida */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#374151",
                            textAlign: "center",
                            mb: 1,
                            fontSize: { xs: "1.5rem", sm: "1.85rem" },
                        }}
                    >
                        GraduaT
                    </Typography>

                    {/* Subtítulo */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#6b7280",
                            textAlign: "center",
                            mb: 4,
                            fontSize: "0.875rem",
                        }}
                    >
                        Inicia sesión en tu cuenta educativa
                    </Typography>

                    {/* Mostrar error si existe */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 4, border: "#c1121e4f 1px solid" }}>
                            {error}
                        </Alert>

                    )}

                    {/* Formulario */}
                    <Box component="form" onSubmit={handleLogin}>
                        {/* Campo de email */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#374151",
                                    fontWeight: 500,
                                    mb: 1,
                                    fontSize: "0.875rem",
                                }}
                            >
                                Correo electrónico
                            </Typography>
                            <TextField
                                fullWidth
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@ejemplo.edu"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: "#9ca3af", fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "white",
                                        "& fieldset": {
                                            borderColor: "#d1d5db",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#9ca3af",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#3b82f6",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: "12px 14px",
                                        fontSize: "0.875rem",
                                    },
                                }}
                            />
                        </Box>

                        {/* Campo de contraseña */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#374151",
                                        fontWeight: 500,
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    Contraseña
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: "#9ca3af", fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end">
                                                {showPassword ?
                                                    <VisibilityOff sx={{ color: "#9ca3af", fontSize: 20 }} /> :
                                                    <Visibility sx={{ color: "#9ca3af", fontSize: 20 }} />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor: "white",
                                        "& fieldset": {
                                            borderColor: "#d1d5db",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#9ca3af",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#3b82f6",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        padding: "12px 14px",
                                        fontSize: "0.875rem",
                                    },
                                }}
                            />
                        </Box>

                        {/* Botón de login */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                mb: 3,
                                borderRadius: {xs: 10, sm: 2},
                                textTransform: "none",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                backgroundColor: "#1a202c",
                                "&:hover": {
                                    backgroundColor: "#2d3748",
                                },
                                "&:disabled": {
                                    backgroundColor: "#a0a0a0",
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </Box>

                    {/* Separador */}
                    <Box sx={{ position: "relative", mb: 3 }}>
                        <Divider />
                        <Typography
                            variant="body2"
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: "white",
                                px: 2,
                                color: "#6b7280",
                                fontSize: "0.875rem",
                            }}
                        >
                            O
                        </Typography>
                    </Box>

                    {/* Enlace de registro */}
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#374151",
                                fontSize: "0.875rem",
                            }}
                        >
                            ¿No tienes una cuenta?{" "}
                            <Button
                                variant="text"
                                onClick={() => navigate("/codigo-acceso")}
                                sx={{
                                    color: "#374151",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    p: 0,
                                    minWidth: "auto",
                                    fontSize: "0.875rem",
                                    textDecoration: "underline",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Regístrate
                            </Button>
                        </Typography>
                    </Box>
                </Card>
            </Fade>
        </Box>
    );
}