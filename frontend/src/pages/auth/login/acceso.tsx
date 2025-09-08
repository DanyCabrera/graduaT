import {
    Container,
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
} from "@mui/material";

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

// acceso supervisor/director
const accesoSupervisorDirector = () => {
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
            {accesoSupervisorDirector()}
        </>
    );
}