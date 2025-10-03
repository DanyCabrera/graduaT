import { useState } from "react";
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
    CircularProgress
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Logo from '../../../assets/logo.png'

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
        setError("");

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
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
                // Guardar token y datos del usuario
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
                backgroundColor: "white", // Fondo
                padding: { xs: 2, sm: 1 },
            }}>
            <Fade in timeout={800}>
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "900px", md: "1000px" },
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        border: "none",
                        backgroundColor: "white",
                        overflow: "hidden",
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            minHeight: { xs: "auto", sm: "600px" },
                            flexDirection: { xs: "column", md: "row" },
                        }}
                    >
                        {/* Sección izquierda - Formulario */}
                        <Box
                            sx={{
                                flex: 1,
                                padding: { xs: 3, sm: 4, md: 5 },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={Logo}
                                    alt="GraduaT"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mr: 2,
                                    }}
                                >
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#374151",
                                    }}
                                >
                                    GraduaT
                                </Typography>
                            </Box>

                            {/* Título de bienvenida */}
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1f2937",
                                    mb: 4,
                                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                                }}
                            >
                                Bienvenido
                            </Typography>


                            {/* Mostrar error si existe */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Formulario */}
                            <Box component="form" onSubmit={handleLogin}>
                                <TextField
                                    fullWidth
                                    label="Dirección de correo"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Dirección de correo"
                                    sx={{
                                        mb: 2,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            backgroundColor: "white",
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#374151",
                                            fontWeight: 500,
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleTogglePassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            backgroundColor: "white",
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#374151",
                                            fontWeight: 500,
                                        },
                                    }}
                                />

                                {/* Opciones */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            type="checkbox"
                                            id="keepLoggedIn"
                                            style={{
                                                marginRight: 8,
                                                accentColor: "#38b000",
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#374151",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            Mantener sesión iniciada
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: "black",
                                            textTransform: "none",
                                            fontSize: "0.875rem",
                                            fontWeight: 500,
                                            p: 0,
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Button>
                                </Box>

                                {/* Botón de login */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                    sx={{
                                        py: 1.5,
                                        mb: 3,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        bgcolor: '#38b000',
                                        '&:disabled': {
                                            bgcolor: '#a0a0a0'
                                        }
                                    }}
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                </Button>
                            </Box>

                            {/* Enlace de registro */}
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    ¿No tienes cuenta?{" "}
                                    <Button
                                        variant="text"
                                        onClick={() => navigate("/codigo-acceso")}
                                        sx={{
                                            color: "#00012",
                                            textTransform: "none",
                                            fontWeight: 500,
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
                        </Box>

                        {/* Sección derecha - Solo imagen */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Gradiente de fondo */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0.8,
                                }}
                            />

                            {/* Imagen que ocupa toda la sección */}
                            <Box
                                sx={{
                                    position: "relative",
                                    zIndex: 2,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: { xs: 2, sm: 3, md: 4 },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={Logo}
                                    alt="Vista 3D de libros y educación"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Fade>
        </Box>
    );
}