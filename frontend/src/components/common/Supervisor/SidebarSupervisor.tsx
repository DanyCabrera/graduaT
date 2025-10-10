import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    Divider,
    Toolbar,
    CssBaseline
} from '@mui/material';
import {
    Dashboard,
    SupervisorAccount,
    Logout
} from '@mui/icons-material';

interface SidebarSupervisorProps {
    currentView: string;
    onViewChange: (view: 'dashboard') => void;
    userData: any;
    onLogout: () => void;
}

const drawerWidth = 280;

export default function SidebarSupervisor({ currentView, onViewChange, userData, onLogout }: SidebarSupervisorProps) {
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Dashboard />,
            description: 'Vista general del departamento'
        }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #e5e7eb',
                    },
                }}
            >
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <SupervisorAccount sx={{ mr: 2, color: '#6b7280' }} />
                        <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 'bold' }}>
                            Supervisor
                        </Typography>
                    </Box>
                </Toolbar>
                
                <Divider />
                
                {/* Información del Usuario */}
                <Box sx={{ p: 2, backgroundColor: '#f9fafb', m: 2, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#f3f4f6', color: '#374151', mr: 2, width: 48, height: 48 }}>
                            <SupervisorAccount />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.9rem' }}>
                                Sup. {userData?.Nombre} {userData?.Apellido}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                {userData?.DEPARTAMENTO}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                
                <Divider />
                
                {/* Navegación */}
                <List sx={{ px: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                            <ListItemButton
                                selected={currentView === item.id}
                                onClick={() => onViewChange('dashboard')}
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    color: '#374151',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#f3f4f6',
                                        color: '#1f2937',
                                        '&:hover': {
                                            backgroundColor: '#e5e7eb',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: '#1f2937',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label}
                                    secondary={item.description}
                                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                
                {/* Sección de Usuario/Configuración */}
                <Box sx={{ mt: 'auto', p: 1 }}>
                    <Divider sx={{ mb: 1 }} />
                    <List sx={{ px: 1 }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={onLogout}
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    color: '#6b7280',
                                    '&:hover': {
                                        backgroundColor: '#f3f4f6',
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <Logout sx={{ color: '#6b7280' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Cerrar Sesión"
                                    primaryTypographyProps={{ fontSize: '0.85rem', color: '#6b7280' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
