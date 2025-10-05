import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';

interface Alumno {
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Código_Institución?: string;
    Nombre_Institución?: string;
}

export default function Alumnos() {
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAlumnos();
    }, []);

    const fetchAlumnos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            // Primero obtener la información del maestro autenticado
            const userResponse = await fetch('http://localhost:3001/api/auth/verify-with-role-data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                throw new Error(`Error al obtener información del usuario: ${userResponse.status} - ${errorText}`);
            }

            const userData = await userResponse.json();

            const codigoInstitucion = userData.user.Código_Institución;

            if (!codigoInstitucion) {
                throw new Error('No se encontró el código de institución del maestro');
            }

            // Obtener alumnos de la misma institución
            const response = await fetch(`http://localhost:3001/api/alumnos/institucion/${codigoInstitucion}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener los alumnos de la institución: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setAlumnos(data.data || []);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: 4,
        }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 4,
                    fontWeight: 600,
                    color: '#1e293b',
                    letterSpacing: '-0.5px'
                }}
            >
                Lista de Alumnos
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#475569',
                                    borderBottom: '2px solid #e2e8f0',
                                    backgroundColor: '#fff',
                                    py: 2.5
                                }}
                            >
                                No.
                            </TableCell>
                            {['Nombre', 'Apellido', 'Correo', 'Teléfono', 'Punteo', 'Fecha inicio'].map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        color: '#475569',
                                        borderBottom: '2px solid #e2e8f0',
                                        backgroundColor: '#fff',
                                        py: 2.5
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alumnos.length > 0 ? (
                            alumnos.map((alumno, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f8fafc',
                                            '& td': {
                                                color: '#1e293b'
                                            }
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    <TableCell sx={{
                                        color: '#64748b',
                                        fontSize: '0.875rem',
                                        py: 2.5
                                    }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#64748b',
                                        fontSize: '0.875rem',
                                        py: 2.5
                                    }}>
                                        {alumno.Nombre}
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>
                                        {alumno.Apellido}
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>
                                        {alumno.Correo}
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>
                                        {alumno.Teléfono}
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>
                                        N/A
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>
                                        N/A
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        color: '#64748b'
                                    }}
                                >
                                    No hay alumnos registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}