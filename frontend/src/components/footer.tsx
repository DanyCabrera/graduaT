import {
    Box,
    Typography,
    Button
} from '@mui/material';

export default function Footer() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '100%',
                    height: 150,
                    borderTop: '1px solid rgba(0, 0, 0, 0.2)',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minWidth: '100%',
                        height: 75,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
                    }}>
                    <Typography variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            ml: 2
                        }}>
                        GraduaT
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            minWidth: '30%',
                            height: 75,
                        }}>
                        <Button color='inherit' href="/">Inicio</Button>
                        <Button color='inherit' href="/alumnos">Alumnos</Button>
                        <Button color='inherit' href="/agenda">Agenda</Button>
                        <Button color='inherit' href="/historial">Historial</Button>
                        <Button color='inherit' href="/tests">Tests</Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '100%',
                        height: 75,
                    }}>
                    <Typography variant="body2">
                        &copy; 2025 GraduaT. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
