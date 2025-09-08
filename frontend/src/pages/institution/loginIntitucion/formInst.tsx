import { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from "@mui/material";

export default function FormInst() {
    const [codigo, setCodigo] = useState(""); // Estado para el código ingresado
    const [mostrarTablas, setMostrarTablas] = useState(false); // Estado para mostrar las tablas

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Solo mayúsculas y números
        setCodigo(value);
    };

    const handleVerClick = () => {
        if (codigo.length === 6) {
            setMostrarTablas(true); // Muestra las tablas si el código tiene 6 caracteres
        }
    };

    return (
        <Container
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                padding: 2,
            }}
        >
            {/* Campo para ingresar el código */}
            <TextField
                label="Código de 6 dígitos"
                value={codigo}
                onChange={handleInputChange}
                inputProps={{ maxLength: 6 }} // Limita el número de caracteres a 6
                sx={{ width: "300px" }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleVerClick}
                sx={{ width: "150px" }}
            >
                Ver
            </Button>

            {/* Tablas que se muestran al hacer clic en "Ver" */}
            {mostrarTablas && (
                <>
                    {/* Primera tabla */}
                    <Typography variant="h6" sx={{ marginTop: 3 }}>
                        Información General
                    </Typography>
                    <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre Completo</TableCell>
                                    <TableCell>Dirección</TableCell>
                                    <TableCell>Departamento</TableCell>
                                    <TableCell>Correo</TableCell>
                                    <TableCell>Teléfono</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>COLEGIO BILINGUE PARAISO</TableCell>
                                    <TableCell>Zona 1, Retlhuleu</TableCell>
                                    <TableCell>Retalhuleu</TableCell>
                                    <TableCell>paraiso@gmail.com</TableCell>
                                    <TableCell>12345678</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Segunda tabla */}
                    <Typography variant="h6">Información de la Institución</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código Institución</TableCell>
                                    <TableCell>Código Supervisor</TableCell>
                                    <TableCell>Código Director</TableCell>
                                    <TableCell>Código Maestro</TableCell>
                                    <TableCell>Código Alumno</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ABC123</TableCell>
                                    <TableCell>SUP456</TableCell>
                                    <TableCell>DIR789</TableCell>
                                    <TableCell>MAE321</TableCell>
                                    <TableCell>ALU654</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
}