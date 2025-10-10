import { 
    Box, 
    Typography, 
    Avatar,
    Paper,
    Chip
} from '@mui/material';
import { 
    Person, 
    Email, 
    Phone, 
    School, 
    AccountCircle
} from '@mui/icons-material';

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución?: string;
    Nombre_Institución?: string;
    nombre_institucion?: string;
    institucion?: string;
    codigo_institucion?: string;
    [key: string]: any; // Para permitir otros campos que puedan venir del backend
}

interface InformacionDirectorProps {
    userData: UserData | null;
}

export default function InformacionDirector({ userData }: InformacionDirectorProps) {
    if (!userData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography color="error">No se encontraron datos del usuario</Typography>
            </Box>
        );
    }

    // Función para obtener el nombre de la institución
    const getInstitutionName = () => {
        // Si hay un nombre de institución válido, usarlo
        if (userData.Nombre_Institución && userData.Nombre_Institución !== 'null') {
            return userData.Nombre_Institución;
        }
        
        // Mapeo de códigos a nombres (puedes expandir esto según tus instituciones)
        const institutionMap: { [key: string]: string } = {
            'COLKEC': 'Colegio KEC',
            // Agregar más códigos aquí según sea necesario
        };
        
        // Si tenemos un código, intentar mapearlo
        if (userData.Código_Institución) {
            return institutionMap[userData.Código_Institución] || userData.Código_Institución;
        }
        
        return 'No especificada';
    };


    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            {/* Header Minimalista */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Avatar 
                    sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: '#f5f5f5', 
                        color: '#666',
                        mx: 'auto',
                        mb: 2,
                        border: '2px solid #e0e0e0'
                    }}
                >
                    <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 300, color: '#333', mb: 1 }}>
                    {userData.Nombre} {userData.Apellido}
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', fontWeight: 400 }}>
                    Director
                </Typography>
            </Box>

            {/* Información Principal */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                }}
            >
                <Box sx={{ display: 'grid', gap: 3 }}>
                    {/* Información de Contacto */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Contacto
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Email sx={{ color: '#999', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ color: '#333' }}>
                                {userData.Correo}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Phone sx={{ color: '#999', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ color: '#333' }}>
                                {userData.Teléfono}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Información Institucional */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: '#666', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Institución
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <School sx={{ color: '#999', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                                {getInstitutionName()}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AccountCircle sx={{ color: '#999', fontSize: 20 }} />
                            <Typography variant="body1" sx={{ color: '#333', fontFamily: 'monospace' }}>
                                {userData.Usuario}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Estado */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                        <Chip 
                            label="Cuenta Activa" 
                            sx={{ 
                                backgroundColor: '#e8f5e8',
                                color: '#2e7d32',
                                fontWeight: 500,
                                border: '1px solid #c8e6c9'
                            }}
                        />
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}