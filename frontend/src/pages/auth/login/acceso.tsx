import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Alert,
    CircularProgress,
    Box,
    Paper,
    TextField,
    Fade,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Business as BusinessIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Interfaces
interface Institucion {
    _id: string;
    Nombre_Completo: string;
    Código_Institución: string;
    Código_Alumno: string;
    Código_Director: string;
    Código_Maestro: string;
    Código_Supervisor: string;
}

// acceso alumno/maestro
const AccesoAlumnoMaestro = () => {
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [institucionSeleccionada, setInstitucionSeleccionada] = useState('');
    const [codigoRolMaestroAlumno, setCodigoRolMaestroAlumno] = useState('');
    const [cursosSeleccionados, setCursosSeleccionados] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();
    // Cargar instituciones al montar el componente
    useEffect(() => {
        cargarInstituciones();
        // Cargar datos del usuario desde localStorage
        const data = localStorage.getItem('userData');
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    const cargarInstituciones = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/colegios');

            if (response.ok) {
                const responseData = await response.json();
                // Extraer el array de instituciones del objeto de respuesta
                setInstituciones(responseData.data || []);
            } else {
                setError('Error al cargar las instituciones');
            }
        } catch (error) {
            setError('Error de conexión al cargar las instituciones');
        } finally {
            setLoading(false);
        }
    };

    const handleToClearInput = () => {
        setInstitucionSeleccionada('');
        setCodigoRolMaestroAlumno('');
        setCursosSeleccionados([]);
        setError('');
        setSuccess('');
    }

    const handleCancelRegistration = () => {
        // Limpiar datos del localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('verificationToken');
        
        // Redirigir al registro
        navigate('/panelRol');
    }

    const validarCodigo = async () => {
        if (!institucionSeleccionada) {
            setError('Por favor seleccione una institución');
            return;
        }

        if (!codigoRolMaestroAlumno.trim()) {
            setError('Por favor ingrese el código de rol');
            return;
        }

        if (!userData) {
            setError('No se encontraron datos del usuario');
            return;
        }

        if (userData && userData.rol === 'Maestro' && cursosSeleccionados.length === 0) {
            setError('Por favor seleccione su curso');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Primero validar que la institución existe
            const institucionResponse = await fetch(`http://localhost:3001/api/colegios/${institucionSeleccionada}`);

            if (!institucionResponse.ok) {
                const errorData = await institucionResponse.json();
                setError(`Institución no encontrada: ${errorData.error || 'Error desconocido'}`);
                setLoading(false);
                return;
            }

            const institucionData = await institucionResponse.json();
            const institucion = institucionData.data;

            // Validar que el código de rol corresponde al rol del usuario
            const codigoCorrecto = userData && userData.rol === 'Maestro'
                ? institucion.Código_Maestro
                : institucion.Código_Alumno;

            if (codigoRolMaestroAlumno !== codigoCorrecto) {
                setError(`Código inválido`);
                setLoading(false);
                return;
            }

            // Crear el usuario en el backend con todos los datos
            const userDataForRegistration = {
                Nombre: userData.nombre,
                Apellido: userData.apellido,
                Teléfono: userData.telefono,
                Correo: userData.correo,
                Contraseña: userData.contraseña,
                Rol: userData && userData.rol,
                Usuario: userData.correo,
                Código_Institución: institucion.Código_Institución,
                Nombre_Institución: institucion.Nombre_Completo,
                Código_Rol: codigoRolMaestroAlumno,
                emailVerificado: false,
                tokenVerificacion: '',
                Cursos: cursosSeleccionados
            };

            // Registrar el usuario
            const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataForRegistration),
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                setError(errorData.error || 'Error en el registro');
                setLoading(false);
                return;
            }

            // Actualizar el usuario con la institución seleccionada
            const updatedUserData = {
                ...userData,
                institucion: institucion.Código_Institución,
                Nombre_Institución: institucion.Nombre_Completo
            };

            // Guardar datos actualizados
            localStorage.setItem('userData', JSON.stringify(updatedUserData));

            // Enviar correo de verificación
            const response = await fetch('http://localhost:3001/api/auth/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.correo,
                    nombre: userData.nombre,
                    rol: userData && userData.rol
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setSuccess('Registro exitoso.');

                // Si hay un token en la respuesta (para testing), guardarlo
                if (responseData.token) {
                    localStorage.setItem('verificationToken', responseData.token);
                }

                // Redirigir a la página de verificación de email
                setTimeout(() => {
                    navigate('/verify-email');
                }, 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Error al enviar el correo');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Box>
                <Fade in timeout={800}>
                    <Container
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                        }}
                    >
                        <Card
                            sx={{
                                width: { xs: '90%', sm: '70%', md: '50%' },
                                padding: 3,
                                borderRadius: 5,
                                boxShadow: 3,
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <Typography variant="h5" textAlign="center">
                                    Acceso {userData?.rol || 'Usuario'}
                                </Typography>
                                <Typography variant="body1" textAlign="center">
                                    Hola {userData?.nombre}, selecciona tu institución para continuar con la verificación.
                                </Typography>

                                {loading && instituciones.length === 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                                        <CircularProgress size={24} sx={{ mr: 2 }} />
                                        <Typography>Cargando instituciones...</Typography>
                                    </Box>
                                )}

                                {error && (
                                    <Alert severity="error" onClose={() => setError('')}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert severity="success" onClose={() => setSuccess('')}>
                                        {success}
                                    </Alert>
                                )}

                                <FormControl fullWidth>
                                    <InputLabel id="instituciones-label">Instituciones</InputLabel>
                                    <Select
                                        labelId="instituciones-label"
                                        id="instituciones-select"
                                        label="Instituciones"
                                        value={institucionSeleccionada}
                                        onChange={(e) => setInstitucionSeleccionada(e.target.value)}
                                        disabled={loading}
                                    >
                                        {instituciones.map((institucion) => (
                                            <MenuItem key={institucion._id} value={institucion._id}>
                                                {institucion.Nombre_Completo}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Código de Rol"
                                    value={codigoRolMaestroAlumno}
                                    onChange={(e) => setCodigoRolMaestroAlumno(e.target.value)}
                                    variant="outlined"
                                    required
                                    placeholder="Ingrese el código proporcionado por su institución"
                                    sx={{ mt: 2 }}
                                />

                                {userData && userData.rol === 'Maestro' && (
                                    <FormGroup>
                                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                            Selecciona tu(s) curso(s):
                                        </Typography>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="Matemáticas"
                                                    checked={cursosSeleccionados.includes("Matemáticas")}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCursosSeleccionados([...cursosSeleccionados, e.target.value]);
                                                        } else {
                                                            setCursosSeleccionados(
                                                                cursosSeleccionados.filter((curso) => curso !== e.target.value)
                                                            );
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Matemáticas"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value="Comunicación y lenguaje"
                                                    checked={cursosSeleccionados.includes("Comunicación y lenguaje")}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCursosSeleccionados([...cursosSeleccionados, e.target.value]);
                                                        } else {
                                                            setCursosSeleccionados(
                                                                cursosSeleccionados.filter((curso) => curso !== e.target.value)
                                                            );
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Comunicación y lenguaje"
                                        />
                                    </FormGroup>
                                )}

                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={validarCodigo}
                                        disabled={loading || !institucionSeleccionada || !codigoRolMaestroAlumno.trim()}
                                        startIcon={loading ? <CircularProgress size={20} /> : null}
                                        sx={{ flex: 2 }}
                                    >
                                        {loading ? 'Entrando...' : 'Entrar al panel'}
                                    </Button>
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleToClearInput}
                                        disabled={loading}
                                        sx={{ flex: 1 }}
                                    >
                                        Limpiar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleCancelRegistration}
                                        disabled={loading}
                                        sx={{ flex: 1 }}
                                    >
                                        Cancelar Registro
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Container>
                </Fade>
            </Box>
        </>
    )
}

// acceso supervisor/director
const AccesoSupervisorDirector = () => {
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [institucionSeleccionada, setInstitucionSeleccionada] = useState('');
    const [codigoRol, setCodigoRol] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    // Cargar instituciones al montar el componente
    useEffect(() => {
        cargarInstituciones();
        // Cargar datos del usuario desde localStorage
        const data = localStorage.getItem('userData');
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    const cargarInstituciones = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/colegios');

            if (response.ok) {
                const responseData = await response.json();
                setInstituciones(responseData.data || []);
            } else {
                setError('Error al cargar las instituciones');
            }
        } catch (error) {
            setError('Error de conexión al cargar las instituciones');
        } finally {
            setLoading(false);
        }
    };

    const validarAcceso = async () => {
        if (!institucionSeleccionada || !codigoRol) {
            setError('Por favor seleccione una institución e ingrese el código de rol');
            return;
        }

        if (!userData) {
            setError('No se encontraron datos del usuario');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Verificar si el código de rol es válido para supervisor o director
            const response = await fetch(`http://localhost:3001/api/colegios/${institucionSeleccionada}`);

            if (response.ok) {
                const responseData = await response.json();
                const institucion = responseData.data;

                if (codigoRol === institucion.Código_Supervisor || codigoRol === institucion.Código_Director) {
                    // Crear el usuario en el backend con todos los datos
                    const userDataForRegistration = {
                        Nombre: userData.nombre,
                        Apellido: userData.apellido,
                        Teléfono: userData.telefono,
                        Correo: userData.correo,
                        Contraseña: userData.contraseña,
                        Rol: userData && userData.rol,
                        Usuario: userData.correo,
                        Código_Institución: institucion.Código_Institución,
                        Nombre_Institución: institucion.Nombre_Completo,
                        Código_Rol: codigoRol,
                        // Incluir departamento solo para Supervisor
                        ...(userData && userData.rol === "Supervisor" && userData.departamento && { Departamento: userData.departamento }),
                        emailVerificado: false,
                        tokenVerificacion: ''
                    };

                    // Registrar el usuario
                    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userDataForRegistration),
                    });

                    if (!registerResponse.ok) {
                        const errorData = await registerResponse.json();
                        setError(errorData.error || 'Error en el registro');
                        setLoading(false);
                        return;
                    }

                    // Actualizar el usuario con la institución seleccionada
                    const updatedUserData = {
                        ...userData,
                        institucion: institucion.Código_Institución,
                        Nombre_Institución: institucion.Nombre_Completo
                    };

                    // Guardar datos actualizados
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));

                    // Enviar correo de verificación
                    const emailResponse = await fetch('http://localhost:3001/api/auth/send-verification-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: userData.correo,
                            nombre: userData.nombre,
                            rol: userData && userData.rol
                        }),
                    });

                    if (emailResponse.ok) {
                        const emailData = await emailResponse.json();
                        setSuccess('Registro exitoso.');

                        // Si hay un token en la respuesta (para testing), guardarlo
                        if (emailData.token) {
                            localStorage.setItem('verificationToken', emailData.token);
                        }

                        setTimeout(() => {
                            navigate('/verify-email');
                        }, 3000);
                    } else {
                        setError('Error');
                    }
                } else {
                    setError(`Código de rol inválido`);
                }
            } else {
                setError('Institución no encontrada');
            }
        } catch (error) {
            setError('Error al validar el código');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Fade in timeout={800}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    backgroundColor: '#e2e8f0',
                                    mb: 2,
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 40, color: '#64748b' }} />
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#1e293b',
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                Acceso {userData?.rol || 'Supervisor/Director'}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#64748b',
                                    fontWeight: 400,
                                }}
                            >
                                Hola {userData?.nombre}, ingresa tu institución y código de rol
                            </Typography>
                        </Box>

                        {/* Formulario */}
                        <Paper
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            <Box sx={{ p: 4 }}>
                                {error && (
                                    <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
                                        {success}
                                    </Alert>
                                )}

                                {/* Campo Institución */}
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel id="instituciones-sd-label">Instituciones</InputLabel>
                                    <Select
                                        labelId="instituciones-sd-label"
                                        id="instituciones-sd-select"
                                        label="Instituciones"
                                        value={institucionSeleccionada}
                                        onChange={(e) => setInstitucionSeleccionada(e.target.value)}
                                        disabled={loading}
                                    >
                                        {instituciones.map((institucion) => (
                                            <MenuItem key={institucion._id} value={institucion._id}>
                                                {institucion.Nombre_Completo}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Campo Código Rol */}
                                <TextField
                                    fullWidth
                                    label="Código Rol"
                                    placeholder="INGRESAR CÓDIGO ROL"
                                    value={codigoRol}
                                    onChange={(e) => setCodigoRol(e.target.value.toUpperCase())}
                                    inputProps={{
                                        maxLength: 10,
                                        pattern: '[A-Z]{6,}',
                                        title: 'Ingrese solo letras mayúsculas (mínimo 6 caracteres)',
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#ccc',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#999',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0066cc',
                                            },
                                        },
                                    }}
                                />

                                {/* Botón Entrar */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={validarAcceso}
                                    disabled={loading || !institucionSeleccionada || !codigoRol}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                    }}
                                >
                                    {loading ? 'Entrando...' : 'Entrar al panel'}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default function Acceso() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar datos del usuario desde localStorage
        const data = localStorage.getItem('userData');
        
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setUserData(parsedData);
            } catch (error) {
                setUserData(null);
            }
        } else {
        }
        setLoading(false);
    }, []);

    // Mostrar loading mientras se cargan los datos
    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Si no hay datos de usuario, mostrar mensaje de error
    if (!userData) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Alert severity="error">
                    No se encontraron datos del usuario. Por favor regresa al registro.
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                >
                    Ir al Registro
                </Button>
            </Box>
        );
    }

    // Mostrar solo el formulario apropiado según el rol
    if (userData.rol === "Supervisor") {
        // Supervisor no debería llegar aquí, pero por seguridad redirigir
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                <Alert severity="info">
                    Redirigiendo al panel...
                </Alert>
            </Box>
        );
    }

    // Renderizar formulario según el rol
    if (userData.rol === "Maestro" || userData.rol === "Alumno") {
        return <AccesoAlumnoMaestro />;
    } else if (userData.rol === "Director") {
        return <AccesoSupervisorDirector />;
    } else {
        // Rol no reconocido
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                <Alert severity="error">
                    Rol no reconocido: {userData.rol}. Por favor regresa al registro.
                </Alert>
            </Box>
        );
    }
}