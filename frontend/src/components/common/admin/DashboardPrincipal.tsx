import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    School,
    Business,
    TrendingUp,
    TrendingDown,
    People,
    Assessment
} from '@mui/icons-material';

interface Institucion {
    _id: string;
    Nombre_Completo: string;
    DEPARTAMENTO: string;
    habilitado: boolean;
    fechaCreacion: string;
}

interface DashboardPrincipalProps {
    instituciones: Institucion[];
}

export default function DashboardPrincipal({ instituciones }: DashboardPrincipalProps) {
    // Función para clasificar instituciones por tipo
    const clasificarInstituciones = () => {
        const institutos = instituciones.filter(inst => 
            inst.Nombre_Completo.toLowerCase().includes('instituto')
        );
        const colegios = instituciones.filter(inst => 
            inst.Nombre_Completo.toLowerCase().includes('colegio')
        );
        const otros = instituciones.filter(inst => 
            !inst.Nombre_Completo.toLowerCase().includes('instituto') && 
            !inst.Nombre_Completo.toLowerCase().includes('colegio')
        );

        return { institutos, colegios, otros };
    };

    const { institutos, colegios, otros } = clasificarInstituciones();
    
    const institutosHabilitados = institutos.filter(inst => inst.habilitado).length;
    const colegiosHabilitados = colegios.filter(inst => inst.habilitado).length;
    const otrosHabilitados = otros.filter(inst => inst.habilitado).length;

    const stats = [
        { 
            title: 'Institutos', 
            value: institutos.length.toString(), 
            subtitle: `${institutosHabilitados} habilitados`,
            icon: <School />, 
            color: '#7c3aed',
            bgColor: '#f3e8ff',
            trend: institutos.length > 0 ? (institutosHabilitados / institutos.length * 100).toFixed(1) + '%' : '0%',
            trendColor: institutosHabilitados > institutos.length / 2 ? '#10b981' : '#ef4444'
        },
        { 
            title: 'Colegios', 
            value: colegios.length.toString(), 
            subtitle: `${colegiosHabilitados} habilitados`,
            icon: <Business />, 
            color: '#059669',
            bgColor: '#d1fae5',
            trend: colegios.length > 0 ? (colegiosHabilitados / colegios.length * 100).toFixed(1) + '%' : '0%',
            trendColor: colegiosHabilitados > colegios.length / 2 ? '#10b981' : '#ef4444'
        },
        { 
            title: 'Otros', 
            value: otros.length.toString(), 
            subtitle: `${otrosHabilitados} habilitados`,
            icon: <People />, 
            color: '#dc2626',
            bgColor: '#fee2e2',
            trend: otros.length > 0 ? (otrosHabilitados / otros.length * 100).toFixed(1) + '%' : '0%',
            trendColor: otrosHabilitados > otros.length / 2 ? '#10b981' : '#ef4444'
        },
        { 
            title: 'Total', 
            value: instituciones.length.toString(), 
            subtitle: `${instituciones.filter(inst => inst.habilitado).length} habilitados`,
            icon: <Assessment />, 
            color: '#1d4ed8',
            bgColor: '#dbeafe',
            trend: instituciones.length > 0 ? (instituciones.filter(inst => inst.habilitado).length / instituciones.length * 100).toFixed(1) + '%' : '0%',
            trendColor: '#10b981'
        }
    ];

    return (
        <Box sx={{ p: 3, backgroundColor: '#ffffffff', borderRadius: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                    Dashboard
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(4, 1fr)' 
                }, 
                gap: 3, 
                mb: 4 
            }}>
                {stats.map((stat, index) => (
                    <Card key={index} sx={{ 
                        height: '100%', 
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="h3" sx={{ 
                                        fontWeight: 'bold', 
                                        color: '#1e293b',
                                        fontSize: '2rem',
                                        lineHeight: 1
                                    }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {stat.subtitle}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ 
                                    bgcolor: stat.bgColor,
                                    color: stat.color,
                                    width: 56,
                                    height: 56,
                                    border: `2px solid ${stat.color}20`
                                }}>
                                    {stat.icon}
                                </Avatar>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {stat.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {stat.trendColor === '#10b981' ? (
                                        <TrendingUp sx={{ fontSize: 16, color: stat.trendColor, mr: 0.5 }} />
                                    ) : (
                                        <TrendingDown sx={{ fontSize: 16, color: stat.trendColor, mr: 0.5 }} />
                                    )}
                                    <Typography variant="body2" sx={{ color: stat.trendColor, fontWeight: 600 }}>
                                        {stat.trend}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Charts Section */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                    xs: '1fr', 
                    md: '2fr 1fr' 
                }, 
                gap: 3 
            }}>
                {/* Distribution Chart */}
                <Card sx={{ 
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Distribución por Tipo
                            </Typography>
                        </Box>
                        
                        {/* Bar Chart Simulation */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ width: 12, height: 12, bgcolor: '#7c3aed', borderRadius: 1, mr: 1 }}></Box>
                                <Typography variant="body2" sx={{ mr: 2 }}>Institutos</Typography>
                                <Box sx={{ flex: 1, height: 8, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
                                    <Box sx={{ 
                                        width: `${institutos.length > 0 ? (institutos.length / instituciones.length * 100) : 0}%`, 
                                        height: '100%', 
                                        bgcolor: '#7c3aed',
                                        transition: 'width 0.3s ease'
                                    }}></Box>
                                </Box>
                                <Typography variant="body2" sx={{ ml: 2, fontWeight: 600 }}>{institutos.length}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ width: 12, height: 12, bgcolor: '#059669', borderRadius: 1, mr: 1 }}></Box>
                                <Typography variant="body2" sx={{ mr: 2 }}>Colegios</Typography>
                                <Box sx={{ flex: 1, height: 8, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
                                    <Box sx={{ 
                                        width: `${colegios.length > 0 ? (colegios.length / instituciones.length * 100) : 0}%`, 
                                        height: '100%', 
                                        bgcolor: '#059669',
                                        transition: 'width 0.3s ease'
                                    }}></Box>
                                </Box>
                                <Typography variant="body2" sx={{ ml: 2, fontWeight: 600 }}>{colegios.length}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ width: 12, height: 12, bgcolor: '#dc2626', borderRadius: 1, mr: 1 }}></Box>
                                <Typography variant="body2" sx={{ mr: 2 }}>Otros</Typography>
                                <Box sx={{ flex: 1, height: 8, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
                                    <Box sx={{ 
                                        width: `${otros.length > 0 ? (otros.length / instituciones.length * 100) : 0}%`, 
                                        height: '100%', 
                                        bgcolor: '#dc2626',
                                        transition: 'width 0.3s ease'
                                    }}></Box>
                                </Box>
                                <Typography variant="body2" sx={{ ml: 2, fontWeight: 600 }}>{otros.length}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Status Overview */}
                <Card sx={{ 
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                            Estado del Sistema
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Habilitados</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {instituciones.filter(inst => inst.habilitado).length}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={instituciones.length > 0 ? (instituciones.filter(inst => inst.habilitado).length / instituciones.length * 100) : 0}
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 1,
                                    bgcolor: '#f1f5f9',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: '#10b981'
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Deshabilitados</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {instituciones.filter(inst => !inst.habilitado).length}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={instituciones.length > 0 ? (instituciones.filter(inst => !inst.habilitado).length / instituciones.length * 100) : 0}
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 1,
                                    bgcolor: '#f1f5f9',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: '#ef4444'
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ 
                            p: 2, 
                            bgcolor: '#f8fafc', 
                            borderRadius: 2, 
                            border: '1px solid #e2e8f0' 
                        }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Total de Instituciones
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                                {instituciones.length}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
