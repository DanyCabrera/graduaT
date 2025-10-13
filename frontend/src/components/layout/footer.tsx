import { Box, Typography, Button } from "@mui/material";
import logo from "../../assets/logoo1.png";
import tortuFooter from "../../assets/TortuFooter.png";

// Footer para Maestro
export function FooterMaestro() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#36385fff",
                color: "white",
                mt: 8,
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
                        
                        sx={{ height: 10 }}
                    />
                </Box>

                  {/* Tortuga saliendo del footer */}
                    <Box
                        component="img"
                        src={tortuFooter}
                        alt="Tortuga GraduaT"
                        sx={{
                        height: { xs: 160, sm: 160, md: 140 }, 
                        position: 'absolute',
                        right: { xs: 140, sm: 290, md: 670 }, 
                        bottom: { xs: 210, sm: 271, md: 134 }, 
                        zIndex: 10,
                        transform: 'rotate(-5deg)',
                        pointerEvents: 'none',
                        m: 0,
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
                    <Box
                        component="img"
                        src={logo}
                        alt="GraduaT logo"
                        sx={{ height: 70 }}
                    />
                 
                    
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
                sx={{ textAlign: "center", mt: 3, color: "#e7e7e7ff" }}
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
                mt: 4,
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
                       
                        sx={{ height: 10 }}
                    />
                    {/* Tortuga saliendo del footer */}
                    <Box
                        component="img"
                        src={tortuFooter}
                        alt="Tortuga GraduaT"
                        sx={{
                             height: { xs: 160, sm: 140, md: 140 }, 
                            position: 'absolute',
                            right: { xs: 60, sm: 310, md: -350 }, 
                            bottom: { xs: -1, sm: -1, md: 24 }, 
                            zIndex: 10,
                            transform: 'rotate(-5deg)',
                            pointerEvents: 'none',
                            m: 0,
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
                    <Box
                        component="img"
                        src={logo}
                        alt="GraduaT logo"
                        sx={{ height: 70 }}
                    />
                    
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
                sx={{ textAlign: "center", mt: 3, color: "#e7e7e7ff" }}
            >
                © {new Date().getFullYear()} GraduaT. Todos los derechos reservados.
            </Typography>
        </Box>
    );
}
