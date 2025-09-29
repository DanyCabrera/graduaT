import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, Button, Typography, TextField, Box, IconButton, Fade, Alert, CircularProgress, InputAdornment, InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Login() {
    // Estado para almacenar el rol seleccionado
    const [selectedRol, setSelectedRol] = useState<string | null>(null);
    const navigate = useNavigate();

    // Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        departamento: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
        codigoRol: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Efecto para obtener el rol seleccionado del almacenamiento local
    useEffect(() => {
        const rol = localStorage.getItem("selectedRol");
        setSelectedRol(rol);
    }, []);

    const handleBackToPanel = () => {
        navigate('/panelRol');
    };

        const departamentos = [
        'Alta Verapaz',
        'Baja Verapaz',
        'Chimaltenango',
        'Chiquimula',
        'El Progreso',
        'Escuintla',
        'Guatemala',
        'Huehuetenango',
        'Izabal',
        'Jalapa',
        'Jutiapa',
        'Petén',
        'Quetzaltenango',
        'Quiché',
        'Retalhuleu',
        'Sacatepéquez',
        'San Marcos',
        'Santa Rosa',
        'Sololá',
        'Suchitepéquez',
        'Totonicapán',
        'Zacapa',
    ];

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Validar email en tiempo real
        if (field === 'correo') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.trim() && !emailRegex.test(value)) {
                setEmailError('Formato de correo inválido');
            } else {
                setEmailError('');
            }
        }
    }, []);

    const validateForm = useCallback(() => {
        if (!formData.nombre.trim()) {
            setError('El nombre es requerido');
            return false;
        }
        if (!formData.apellido.trim()) {
            setError('El apellido es requerido');
            return false;
        }
        if (!formData.telefono.trim()) {
            setError('El teléfono es requerido');
            return false;
        }
        // Validar departamento solo para Supervisor
        if (selectedRol === "Supervisor" && !formData.departamento.trim()) {
            setError('El departamento es requerido');
            return false;
        }
        if (!formData.correo.trim()) {
            setError('El correo es requerido');
            return false;
        }
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            setError('Por favor ingrese un correo electrónico válido');
            return false;
        }
        if (!formData.contraseña.trim()) {
            setError('La contraseña es requerida');
            return false;
        }
        if (formData.contraseña !== formData.confirmarContraseña) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        // Removido: validación de código de rol en el registro
        // La validación se hará en el panel de acceso
        return true;
    }, [formData, selectedRol]);

    // Función removida - la validación de códigos se hace en el panel de acceso

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Limpiar mensajes previos
        setSuccess('');
        setEmailError('');

        // Validar formulario antes de limpiar errores
        if (!validateForm()) {
            return;
        }

        // Si la validación pasa, limpiar errores y continuar
        setError('');
        setLoading(true);

        try {
            // Solo guardar datos en localStorage para el panel de acceso
            const userData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                telefono: formData.telefono,
                // Solo incluir departamento para Supervisor
                ...(selectedRol === "Supervisor" && { departamento: formData.departamento }),
                correo: formData.correo,
                contraseña: formData.contraseña,
                rol: selectedRol
            };

            // Guardar datos del usuario en localStorage
            localStorage.setItem('userData', JSON.stringify(userData));

            if (selectedRol === "Supervisor") {
                // Supervisor se registra directamente en el backend
                const supervisorData = {
                    Nombre: formData.nombre,
                    Apellido: formData.apellido,
                    Teléfono: formData.telefono,
                    Correo: formData.correo,
                    Contraseña: formData.contraseña,
                    Rol: selectedRol,
                    Usuario: formData.correo, // Usar correo como usuario
                    Departamento: formData.departamento,
                    emailVerificado: false,
                    tokenVerificacion: ''
                };

                // Registrar supervisor en el backend
                const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(supervisorData),
                });

                if (!registerResponse.ok) {
                    const errorData = await registerResponse.json();
                    setError(errorData.error || 'Error en el registro del supervisor');
                    setLoading(false);
                    return;
                }

                // Enviar correo de verificación
                const emailResponse = await fetch('http://localhost:3001/api/auth/send-verification-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.correo,
                        nombre: formData.nombre,
                        rol: selectedRol
                    }),
                });

                if (emailResponse.ok) {
                    const emailData = await emailResponse.json();
                    setSuccess('Registro exitoso. Se ha enviado un correo de verificación a tu email.');
                    
                    // Si hay un token en la respuesta (para testing), guardarlo
                    if (emailData.token) {
                        localStorage.setItem('verificationToken', emailData.token);
                    }
                    
                    // Redirigir a la página de verificación de email
                    setTimeout(() => {
                        navigate('/verify-email');
                    }, 3000);
                } else {
                    setError('Error al enviar el correo de verificación');
                }
            } else {
                // Director, Maestro y Alumno van al panel de acceso
                setSuccess('Datos guardados. Redirigiendo al panel de acceso...');
                setTimeout(() => {
                    navigate('/acceso');
                }, 1500);
            }

        } catch (error) {
            setError('Error al procesar los datos');
        } finally {
            setLoading(false);
        }
    }, [formData, selectedRol, navigate, validateForm]);

    const handleDepartamentoChange = (event: any) => {
        const value = event.target.value;
        handleInputChange('departamento', value);
    };

    const FormularioSupervisor = useMemo(() => {
        return (
            <>
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

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        {success}
                                    </Alert>
                                )}

                                <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        value={formData.nombre}
                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                        variant="outlined"
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Apellido"
                                        value={formData.apellido}
                                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                                        variant="outlined"
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Teléfono"
                                        value={formData.telefono}
                                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                                        variant="outlined"
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                            },
                                        }}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="departamento-label">Departamento *</InputLabel>
                                        <Select
                                            value={formData.departamento}
                                            labelId="departamento-label"
                                            name="departamento"
                                            onChange={handleDepartamentoChange}
                                            label="Departamento *"
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: "white",
                                            }}
                                        >
                                            {departamentos.map((dep, index) => (
                                                <MenuItem key={index} value={dep}>
                                                    {dep}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label="Correo"
                                        type="email"
                                        value={formData.correo}
                                        onChange={(e) => handleInputChange('correo', e.target.value)}
                                        variant="outlined"
                                        required
                                        error={!!emailError}
                                        helperText={emailError}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Contraseña"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.contraseña}
                                        onChange={(e) => handleInputChange('contraseña', e.target.value)}
                                        variant="outlined"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Confirmar Contraseña"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmarContraseña}
                                        onChange={(e) => handleInputChange('confirmarContraseña', e.target.value)}
                                        variant="outlined"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1,
                                            },
                                        }}
                                    />

                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} /> : null}
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
                                        {loading ? 'Procesando...' : 'Registrar'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>


                </Fade>
            </>
        )
    }, [formData, loading, error, success, emailError, showPassword, showConfirmPassword, handleInputChange, handleSubmit, handleBackToPanel, selectedRol]);
    
    const FormularioDirector = useMemo(() => {
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

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    variant="outlined"
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    value={formData.apellido}
                                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                                    variant="outlined"
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    variant="outlined"
                                    required
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
                                    value={formData.correo}
                                    onChange={(e) => handleInputChange('correo', e.target.value)}
                                    variant="outlined"
                                    required
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.contraseña}
                                    onChange={(e) => handleInputChange('contraseña', e.target.value)}
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmarContraseña}
                                    onChange={(e) => handleInputChange('confirmarContraseña', e.target.value)}
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
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
                                    {loading ? 'Procesando...' : 'Siguiente'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        );
    }, [formData, loading, error, success, emailError, showPassword, showConfirmPassword, handleInputChange, handleSubmit, handleBackToPanel, selectedRol]);

    const FormularioMaestroAlumno = useMemo(() => {
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

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    variant="outlined"
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    value={formData.apellido}
                                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                                    variant="outlined"
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    variant="outlined"
                                    required
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
                                    value={formData.correo}
                                    onChange={(e) => handleInputChange('correo', e.target.value)}
                                    variant="outlined"
                                    required
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.contraseña}
                                    onChange={(e) => handleInputChange('contraseña', e.target.value)}
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmarContraseña}
                                    onChange={(e) => handleInputChange('confirmarContraseña', e.target.value)}
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                                {/* Campo de código removido - se validará en el panel de acceso */}
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
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
                                    {loading ? 'Procesando...' : 'Siguiente'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        );
    }, [formData, loading, error, success, emailError, showPassword, showConfirmPassword, handleInputChange, handleSubmit, handleBackToPanel, selectedRol]);

    return (
        <>
            {/* Mostrar formulario dependiendo con qué rol esté entrando */}
            {/* formulario para Director */}
            {selectedRol === "Director" ? FormularioDirector : null}

            {/* formulario para Supervisor */}
            {selectedRol === "Supervisor" ? FormularioSupervisor : null}

            {/* formulario para Maestro/Alumno */}
            {selectedRol === "Maestro" || selectedRol === "Alumno" ? FormularioMaestroAlumno : null}
        </>
    );
}
