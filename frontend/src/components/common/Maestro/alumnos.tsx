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
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Código_Institución: string;
    Nombre_Institución: string;
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

            const response = await fetch('http://localhost:3000/api/alumnos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los alumnos');
            }

            const data = await response.json();
            setAlumnos(data);
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
                Lista de Alumnos
            </Typography>

            <TableContainer component={Paper} sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Apellido</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Institución</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alumnos.map((alumno) => (
                            <TableRow 
                                key={alumno.Usuario}
                                sx={{ 
                                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                    '&:hover': { backgroundColor: '#f1f5f9' },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <TableCell>{alumno.Nombre}</TableCell>
                                <TableCell>{alumno.Apellido}</TableCell>
                                <TableCell>{alumno.Correo}</TableCell>
                                <TableCell>{alumno.Teléfono}</TableCell>
                                <TableCell>{alumno.Nombre_Institución}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}