import { Box, Typography, Button, Link } from "@mui/material";
import logo from "../../assets/logoo1.png";

// Footer para Maestro
export function FooterMaestro() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#023047",
                color: "white",
                mt: "auto",
                py: 4,
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        width: { xs: '100%', md: '33%' }
                    }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="GraduaT logo"
                        sx={{ height: 60 }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: { xs: '100%', md: '33%' },
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    {["Inicio", "Alumnos", "Agenda", "Historial", "Test"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            underline="none"
                            color="inherit"
                            sx={{ "&:hover": { color: "gray" } }}
                        >
                            {item}
                        </Link>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-end' },
                        width: { xs: '100%', md: '33%' }
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=graduat502@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Contáctanos
                    </Button>
                </Box>
            </Box>

            <Typography
                variant="body2"
                sx={{ textAlign: "center", mt: 3, color: "gray" }}
            >
                © {new Date().getFullYear()} GraduaT. Todos los derechos reservados.
            </Typography>
        </Box>
    );
}

// Footer para Alumno
export function FooterAlumno() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#2f3e46",
                color: "white",
                mt: "auto",
                py: 4,
                px: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        width: { xs: '100%', md: '33%' }
                    }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="GraduaT logo"
                        sx={{ height: 60 }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: { xs: '100%', md: '33%' },
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    {["Inicio", "PruebaT", "Progreso"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            underline="none"
                            color="inherit"
                            sx={{ "&:hover": { color: "gray" } }}
                        >
                            {item}
                        </Link>
                    ))}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-end' },
                        width: { xs: '100%', md: '33%' }
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=graduat502@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Contáctanos
                    </Button>
                </Box>
            </Box>

            <Typography
                variant="body2"
                sx={{ textAlign: "center", mt: 3, color: "gray" }}
            >
                © {new Date().getFullYear()} GraduaT. Todos los derechos reservados.
            </Typography>
        </Box>
    );
}
