import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Checkbox,
    Button,
    Fade
} from '@mui/material';
import {
    Calculate,
} from "@mui/icons-material";


const tests = [
    {
        icon: <Calculate />,
        title: "Números y operaciones básicas",
        description: "Fundamentos básicos de los números y operaciones aritméticas",
        questions: 5
    },
    {
        icon: <Calculate />,
        title: "Álgebra elemental",
        description: "Expresiones algebraicas y ecuaciones lineales",
        questions: 5
    },
    {
        icon: <Calculate />,
        title: "Geometría básica",
        description: "Conceptos fundamentales de geometría y medición",
        questions: 5
    },
    {
        icon: <Calculate />,
        title: "Estadística descriptiva",
        description: "Análisis de datos y medidas de tendencia central",
        questions: 5
    },
    {
        icon: <Calculate />,
        title: "Problemas de aplicación",
        description: "Resolución de problemas del mundo real",
        questions: 5
    }
];

export default function Test() {
    const [selectedTests, setSelectedTests] = useState<number[]>([]);

    const handleTestSelect = (index: number) => {
        setSelectedTests(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <>
            <Fade in={true} timeout={800}>
                <Box sx={{ p: 2 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 500,
                            color: '#1e293b',
                            mb: 4,
                            textAlign: 'center',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Asignar Evaluaciones
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {tests.map((test, index) => (
                            <Card
                                key={index}
                                sx={{
                                    display: 'flex',
                                    borderRadius: 2,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 2,
                                        color: '#64748b'
                                    }}
                                >
                                    <Box sx={{ fontSize: '2rem' }}>
                                        {test.icon}
                                    </Box>
                                </Box>

                                <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 500,
                                                color: '#334155',
                                                mb: 0.5
                                            }}
                                        >
                                            {test.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#64748b',
                                                mb: 1
                                            }}
                                        >
                                            {test.description}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                                color: '#94a3b8',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <span>📝 {test.questions} preguntas</span>
                                        </Box>
                                    </Box>
                                </CardContent>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        pr: 2
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedTests.includes(index)}
                                        onChange={() => handleTestSelect(index)}
                                        sx={{
                                            color: '#cbd5e1',
                                            '&.Mui-checked': {
                                                color: '#3b82f6'
                                            }
                                        }}
                                    />
                                </Box>
                            </Card>
                        ))}
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            disabled={selectedTests.length === 0}
                            onClick={() => {
                                console.log('Evaluaciones seleccionadas:', selectedTests.map(i => tests[i].title));
                                // Aquí puedes agregar la lógica para asignar las evaluaciones
                            }}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                backgroundColor: selectedTests.length > 0 ? '#3b82f6' : '#cbd5e1',
                                '&:hover': {
                                    backgroundColor: selectedTests.length > 0 ? '#2563eb' : '#cbd5e1'
                                },
                                '&:disabled': {
                                    backgroundColor: '#cbd5e1',
                                    color: '#94a3b8'
                                }
                            }}
                        >
                            {selectedTests.length > 0
                                ? `Asignar ${selectedTests.length} evaluaciones seleccionadas`
                                : 'Selecciona al menos una evaluación'
                            }
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}