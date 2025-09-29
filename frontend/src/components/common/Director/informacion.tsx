import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Avatar,
    Paper,
    Chip,
    Divider
} from '@mui/material';
import { 
    Person, 
    Email, 
    Phone, 
    Business, 
    School, 
    AccountCircle,
    LocationOn
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <Person sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Información del Director
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Detalles completos del perfil
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Información Personal */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person color="primary" />
                            Información Personal
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Nombre Completo</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    Dir. {userData.Nombre} {userData.Apellido}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Correo Electrónico</Typography>
                                    <Typography variant="body1">{userData.Correo}</Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                                    <Typography variant="body1">{userData.Teléfono}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Información Académica */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business color="primary" />
                            Información Académica
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Rol</Typography>
                                <Chip 
                                    label={userData.Rol} 
                                    color="primary" 
                                    variant="filled"
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <School color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Institución</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {getInstitutionName()}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountCircle color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Usuario</Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                        {userData.Usuario}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>


            {/* Información Adicional */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn color="primary" />
                        Estado de la Cuenta
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip 
                            label="Activa" 
                            color="success" 
                            variant="outlined"
                            sx={{ fontSize: '1rem', padding: '8px 16px' }}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}