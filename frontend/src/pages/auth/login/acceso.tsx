import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    MenuItem,
    Select,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputLabel,
    FormControl,
    Alert,
    CircularProgress,
    Box,
} from "@mui/material";
import { useState, useEffect } from "react";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Cargar instituciones al montar el componente
    useEffect(() => {
        cargarInstituciones();
    }, []);

    const cargarInstituciones = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/colegios');
            
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

    const validarCodigo = async () => {
        if (!institucionSeleccionada) {
            setError('Por favor seleccione una institución e ingrese el código');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await fetch(`http://localhost:5000/api/colegios/codigo/${institucionSeleccionada}`);
            if (response.ok) {
                const responseData = await response.json();
                
                // Verificar que el código pertenece a la institución seleccionada
                if (responseData.institucion._id === institucionSeleccionada) {
                    setSuccess('Código válido. Acceso autorizado.');
                    // Aquí podrías redirigir al usuario o continuar con el flujo
                } else {
                    setError('El código no pertenece a la institución seleccionada');
                }
            } else {
                setError('Código inválido o no encontrado');
            }
        } catch (error) {
            setError('Error al validar el código');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                            Acceso Alumno/Maestro
                        </Typography>
                        <Typography variant="body1" textAlign="center">
                            Seleccione su institución e ingrese su código de acceso.
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

                        <FormGroup>
                            <Typography>Seleccione su curso</Typography>
                            <FormControlLabel control={<Checkbox />} label="Matemáticas" />
                            <FormControlLabel control={<Checkbox />} label="Comunicación y Lenguaje" />
                        </FormGroup>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={validarCodigo}
                            disabled={loading || !institucionSeleccionada}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Validando...' : 'Acceder'}
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}


// acceso supervisor/director
const AccesoSupervisorDirector = () => {
    return (
        <>
            <Container>
                <h1>Acceso Supervisor/Director</h1>
                {/* 
                    Contenedor para el acceso del supervisor y director
                    Aca solo vas a diseñar otro Card con el de acceso alumno/maestro pero ahora va hacer para superviros y director
                    los campos que se necesitan son: Instituciones y Código de Rol, y el botón de acceder va hacer para que el supervisor o director ingrese a la plataforma

                    El diseño esta en figma ahi estan los dos campos que se necesitan crear
                    para el campo de institucion lo puedes copiar de la otra funcion de acceso alumno/maestro
                    ahi tengo el codigo para que se vea como un listado y para el campo de codigo del rol
                    que sea que el user digite solo codigo en mayúscula y que sea minimo de 6 digitos.

                    solo diseña eso, no hagas ningun tipo de funcionalidad, despues lo vamos  validar dependiendo de que rol entre le mostrara el panel
                 */}
            </Container>
        </>
    )
}



export default function Acceso() {
    return (
        <>
            <AccesoAlumnoMaestro />
            <AccesoSupervisorDirector />
        </>
    );
}