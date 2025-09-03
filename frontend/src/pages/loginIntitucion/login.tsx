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
    Alert,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Generar un código aleatorio de 6 caracteres en mayúsculas
        const codigo = Array(6)
            .fill(0)
            .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras de A-Z
            .join('');

        setCodigoInstitucion(codigo); // Guardar el código en el estado
        console.log('Formulario enviado:', formData, 'Código de Institución:', codigo);
    };

    return (
        <Container
            sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    width: { xs: '95%', sm: '70%', md: '50%' }, // Ajuste responsivo del ancho
                    padding: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>
                        Registro de Instituciones
                    </Typography>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr', // Una sola columna por defecto
                            gap: '16px', // Espaciado entre los campos
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
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Registrar
                        </Button>
                    </form>
                    {codigoInstitucion && (
                        <Alert severity="success" sx={{ marginTop: 2 }}>
                            Su código de institución es: <strong>{codigoInstitucion}</strong>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}
