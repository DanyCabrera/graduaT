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
} from "@mui/material";

export default function Acceso() {
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
                            Acceso
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
    );
}