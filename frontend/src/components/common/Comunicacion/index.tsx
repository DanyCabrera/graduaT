import { Box, Typography, Container } from "@mui/material";

export default function Comunicacion() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    Comunicación y Lenguaje
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Curso de Comunicación y Lenguaje
                </Typography>
            </Box>
            
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: 3,
                mt: 4 
            }}>
                <Box sx={{ 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    textAlign: 'center',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Lectura Comprensiva</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Desarrolla habilidades de comprensión lectora
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    textAlign: 'center',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Expresión Escrita</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Mejora tu escritura y redacción
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    p: 3, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    textAlign: 'center',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Gramática</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Aprende las reglas gramaticales básicas
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
