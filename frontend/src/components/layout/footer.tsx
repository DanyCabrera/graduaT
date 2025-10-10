import { Box, Typography, Button, Link } from "@mui/material";
import logo from "../../assets/logoo1.png";
import tortuFooter from "../../assets/TortuFooter.png";

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
                position: 'relative',
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
                        width: { xs: '100%', md: '33%' },
                        position: 'relative',
                    }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="GraduaT logo"
                        sx={{ height: 70 }}
                    />
                </Box>

                  {/* Tortuga saliendo del footer */}
                    <Box
                        component="img"
                        src={tortuFooter}
                        alt="Tortuga GraduaT"
                        sx={{
                            height: 180,
                            position: 'absolute',
                            right: 150,
                            bottom: {xs: 200, sm: 80, md: 120},
                            zIndex: 10,
                            transform: 'rotate(-10deg)',
                            pointerEvents: 'none',
                        }}
                    />

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

                bgcolor: "#36385fff",
                color: "white",
                mt: "auto",
                py: 4,
                px: 2,
                position: 'relative',
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
                        width: { xs: '100%', md: '33%' },
                        position: 'relative',
                    }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="GraduaT logo"
                        sx={{ height: 70 }}
                    />
                    {/* Tortuga saliendo del footer */}
                    <Box
                        component="img"
                        src={tortuFooter}
                        alt="Tortuga GraduaT"
                        sx={{
                            height: 180,
                            position: 'absolute',
                            right: 70,
                            bottom: 41,
                            zIndex: 10,
                            transform: 'rotate(2deg)',
                            pointerEvents: 'none',
                        }}
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
