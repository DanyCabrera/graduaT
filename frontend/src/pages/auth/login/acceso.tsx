//import {
    //Container,
    //Card,
    //CardContent,
    //Typography,
    //Button,
    //MenuItem,
    //Select,
    //Checkbox,
    //FormControlLabel,
    //FormGroup,
    //InputLabel,
    //FormControl,
//} from "@mui/material";

// acceso alumno/maestro
/*
const accesoAlumnoMaestro = () => {
    return (
        <>
                    <Container
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center', // Centra horizontalmente
                    alignItems: 'center', // Centra verticalmente
                    padding: 2,
                }}
            >
                <Card
                    sx={{
                        width: { xs: '90%', sm: '70%', md: '50%' }, // Ancho responsivo
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
                            Bienvenido a la página de acceso.
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="instituciones-label">Instituciones</InputLabel>
                            <Select
                                labelId="instituciones-label"
                                id="instituciones-select"
                                label="Instituciones"
                                defaultValue=""
                            >
                                <MenuItem value={1}>Colegio Paraíso</MenuItem>
                                <MenuItem value={2}>Colegio Nacional</MenuItem>
                                <MenuItem value={3}>Colegio Internacional</MenuItem>
                                <MenuItem value={4}>Instituto Carlo Dubón</MenuItem>
                            </Select>
                        </FormControl>
                        <FormGroup>
                            <Typography>Seleccione su curso</Typography>
                            <FormControlLabel control={<Checkbox />} label="Matemáticas" />
                            <FormControlLabel control={<Checkbox />} label="Comunicación y Lenguaje" />
                        </FormGroup>
                        <Button variant="contained" color="primary" fullWidth>
                            Acceder
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}
*/

import {
    Container,
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
    Button,
    Paper,
    Fade,
} from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";

// acceso supervisor/director — con diseño moderno como en CodigoAcceso
const accesoSupervisorDirector = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f8fafc', // Fondo claro
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
                                Acceso Supervisor/Director
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#64748b',
                                    fontWeight: 400,
                                }}
                            >
                                Ingresa tu institución y código de rol
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
                                {/* Campo Institución */}
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel id="institucion-label">
                                        Institución
                                    </InputLabel>
                                    <Select
                                        labelId="institucion-label"
                                        id="institucion-select"
                                        label="Institución"
                                        defaultValue=""
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#ccc',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#999',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#0066cc',
                                            },
                                        }}
                                    >
                                        <MenuItem value={1}>Colegio Paraíso</MenuItem>
                                        <MenuItem value={2}>Colegio Nacional</MenuItem>
                                        <MenuItem value={3}>Colegio Internacional</MenuItem>
                                        <MenuItem value={4}>Instituto Carlo Dubón</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Campo Código Rol */}
                                <TextField
                                    fullWidth
                                    label="Código Rol"
                                    placeholder="INGRESAR CÓDIGO ROL"
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
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: '#374151',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundColor: '#1f2937',
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#9ca3af',
                                        },
                                    }}
                                >
                                    ENTRAR
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

// Exporta como antes
export default function Acceso() {
    return (
        <>
            {accesoSupervisorDirector()}
        </>
    );
}