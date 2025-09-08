import { useState } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';

export default function LoginInstituciones() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        direccion: '',
        telefono: '',
        departamento: '',
    });

    const [codigoInstitucion, setCodigoInstitucion] = useState<string | null>(null); // Estado para el código generado

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }
    ) => {
        const { name, value } = e.target;
        if (name) {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleVerClick= (e: React.FormEvent) => {
        e.preventDefault();

        // Generar un código aleatorio de 6 caracteres en mayúsculas
        const codigo = Array(6)
            .fill(0)
            .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras de A-Z
            .join('');

        setCodigoInstitucion(codigo); // Guardar el código en el estado
        console.log('Formulario enviado:', formData, 'Código de Institución:', codigo);
    };

    const cardCodigo = () => {
        return(
            <>
                <Container
                    sx={{
                        width: '80%',
                        minHeight: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                    {codigoInstitucion && (

                        <Card 
                            variant='outlined' 
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mt:2,
                                width: '100%',
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: 3,
                                placeItems: 'center',
                            }}>
                            <CardContent>
                                <Typography variant="body1" textAlign="center" gutterBottom color='success.main' sx={{fontWeight: 'bold'}}>
                                    Registro exitoso!
                                </Typography>
                                <Typography variant="h4" sx={{letterSpacing: '5px', fontWeight: 'bold'}} textAlign="center">
                                    {codigoInstitucion}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Container>
            </>
        )
    }

    return (
        <>
            <Container 
                sx={{
                    p: 2,
                    minWidth: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" }, // Cambia la dirección en pantallas pequeñas
                    justifyContent: "center", // Centra el contenido verticalmente
                    alignItems: "center", // Centra el contenido horizontalmente
                    gap: 2,
                    bgcolor: "rgba(166, 196, 253, 0.1)",
                }}>

                <Container
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            width: { xs: '100%', sm: '50%', md: '80%' }, // Ajuste responsivo del ancho
                            padding: 2,
                            borderRadius: 3,
                            boxShadow: 3,
                        }}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                width: '100%',
                            }}>
                            <Typography variant="h5" textAlign="center" gutterBottom>
                                Registro de Instituciones
                            </Typography>
                            <form
                                style={{
                                    display: 'grid',
                                    width: '100%',
                                    height: '100%',
                                    gap: '14px',
                                }}
                            >
                                <TextField
                                    label="Nombre Completo"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, ''); // Convierte a mayúsculas y elimina caracteres no permitidos
                                        setFormData({ ...formData, nombre: value });
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Correo Electrónico"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    type="email"
                                />
                                <TextField
                                    label="Dirección"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    type="tel"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="departamento-label">Departamento</InputLabel>
                                    <Select
                                        variant="standard"
                                        labelId="departamento-label"
                                        name="departamento"
                                        value={formData.departamento}
                                        onChange={handleChange}
                                    >
                                        {departamentos.map((dep, index) => (
                                            <MenuItem key={index} value={dep}>
                                                {dep}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    onClick={handleVerClick}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Registrar
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
                <>{cardCodigo()}</>
            </Container>
        </>
    );
}
