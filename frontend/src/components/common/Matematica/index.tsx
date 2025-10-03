import { Box, Typography, Container } from "@mui/material";

export default function Matematica() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    Matemáticas
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Curso de Matemáticas Básicas
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
                    <Typography variant="h6" sx={{ mb: 2 }}>Números Naturales</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Aprende sobre los números naturales y sus propiedades
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
                    <Typography variant="h6" sx={{ mb: 2 }}>Operaciones Básicas</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Suma, resta, multiplicación y división
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
                    <Typography variant="h6" sx={{ mb: 2 }}>Geometría Básica</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Formas geométricas y sus propiedades
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
