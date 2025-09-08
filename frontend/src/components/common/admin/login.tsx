import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    ManageAccounts,
    Security,
    Assessment,
    Settings,
    Update,
} from "@mui/icons-material";
import { useState } from "react";

export default function LoginAdmin() {
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const IniciarSesion = () => {
        return (
            <Card
                sx={{
                    width: { xs: "100%", sm: 600},
                    borderRadius: 2,
                }}
            >
                <CardContent
                    sx={{
                        borderColor: "divider",
                    }}
                >
                    <form
                        style={{
                            padding: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                            Iniciar sesión
                        </Typography>
                        <FormControl>
                            <TextField id="usuario" label="Usuario" variant="standard" />
                        </FormControl>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="contrasenia">Contraseña</InputLabel>
                            <Input
                                id="contrasenia"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword
                                                    ? "hide the password"
                                                    : "display the password"
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button variant="contained" color="primary">
                            Iniciar sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    };

    const Registro = () => {
        return (
            <Card
                sx={{
                    width: { xs: "100%", sm: 600, md: 700},
                    borderRadius: 2,
                }}
            >
                <CardContent
                    sx={{
                        borderColor: "divider",
                    }}
                >
                    <form
                        style={{
                            padding: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                            Registrarse
                        </Typography>
                        <TextField id="nombre" label="Nombre" variant="standard" />
                        <TextField id="apellido" label="Apellido" variant="standard" />
                        <TextField id="usuario" label="Usuario" variant="standard" />
                        <TextField id="correo" label="Correo" variant="standard" type="email" />
                        <TextField id="telefono" label="Teléfono" variant="standard" type="tel" />
                        <TextField id="contrasenia" label="Contraseña" variant="standard" type="password" />
                        <TextField
                            id="confirmar-contrasena"
                            label="Confirmar Contraseña"
                            variant="standard"
                            type="password"
                        />
                        <Button variant="contained">Registrarse</Button>
                    </form>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container
            disableGutters
            sx={{
                minWidth: "80vw",
                minHeight: "80vh",
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // Cambia la dirección en pantallas pequeñas
                justifyContent: "center", // Centra el contenido verticalmente
                alignItems: "center", // Centra el contenido horizontalmente
            }}
        >
            {/* Formulario de inicio de sesión o registro */}
            <Container
                disableGutters
                maxWidth={false}
                sx={{
                    p: 3,
                    placeItems: "center",
                    display: "grid",
                    justifyContent: "center", // Centra el formulario horizontalmente
                    alignItems: "center", // Centra el formulario verticalmente
                    height: '100vh',
                    width: '100%',
                    
                }}
            >
                {isRegistering ? <Registro /> : <IniciarSesion />}
            </Container>

            {/* Contenedor de descripción del administrador */}
            <Container
                disableGutters
                maxWidth={false}
                sx={{
                    display: "grid",
                    placeItems: "center",
                    minHeight: '50vh',
                    minWidth: '50%',
                }}
            >
                <Typography
                    variant="button"
                    sx={{
                        fontWeight: "bold",
                        fontSize: {xs:'2rem', md:'3rem'},
                    }}
                >
                    Administrador
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ManageAccounts />
                        </ListItemIcon>
                        <ListItemText
                            primary="Gestión de usuarios"
                            secondary="Crear, editar, eliminar y asignar permisos a los usuarios del sistema."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Security />
                        </ListItemIcon>
                        <ListItemText
                            primary="Seguridad y control de acceso"
                            secondary="Implementar medidas de seguridad para proteger los datos y controlar el acceso."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Assessment />
                        </ListItemIcon>
                        <ListItemText
                            primary="Supervisión de datos"
                            secondary="Revisar y mantener la integridad de los datos almacenados en el sistema."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText
                            primary="Configuración del sistema"
                            secondary="Personalizar y ajustar el sistema según las necesidades de la organización."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Update />
                        </ListItemIcon>
                        <ListItemText
                            primary="Actualizaciones y mantenimiento"
                            secondary="Aplicar actualizaciones y realizar mantenimiento para garantizar el buen funcionamiento."
                        />
                    </ListItem>
                </List>
                {isRegistering && 
                    <Button 
                        onClick={() => setIsRegistering(false)}
                        variant='contained' 
                        color='primary'>
                            Iniciar sesión
                </Button>}
                {!isRegistering && 
                    <Button 
                        onClick={() => setIsRegistering(true)}
                        variant='contained' 
                        color='primary'>
                            Registrarse
                </Button>}
            </Container>
        </Container>
    );
}
