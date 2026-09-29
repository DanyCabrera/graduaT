import { useMemo, useState, type ReactNode } from 'react';
import {
    Box,
    Drawer,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import {
    House,
    Users,
    Calendar,
    History,
    BookCheck,
    LogOut,
} from 'lucide-react';
import maestroImg from '../../../assets/ProfesorT.png';

export type MaestroSection = 'inicio' | 'alumnos' | 'agenda' | 'historial' | 'tests';

interface MaestroShellProps {
    section: MaestroSection;
    onLogout: () => void;
    notificationCount?: number;
    children: ReactNode;
}

const aulaTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#6D5EF6', contrastText: '#ffffff' },
        secondary: { main: '#3DDC97' },
        background: { default: '#f6f4fb', paper: '#ffffff' },
        text: { primary: '#1B1B3A', secondary: '#8E93A8' },
        divider: '#EEF0F6',
    },
    shape: { borderRadius: 16 },
});

const NAV: { id: MaestroSection; label: string; href: string; icon: typeof House }[] = [
    { id: 'inicio', label: 'Inicio', href: '/maestro', icon: House },
    { id: 'agenda', label: 'Agenda', href: '/maestro/agenda', icon: Calendar },
    { id: 'alumnos', label: 'Alumnos', href: '/maestro/alumnos', icon: Users },
    { id: 'tests', label: 'Evaluaciones', href: '/maestro/tests', icon: BookCheck },
    { id: 'historial', label: 'Historial', href: '/maestro/historial', icon: History },
];

function readTeacher() {
    try {
        const raw = localStorage.getItem('user_data') || localStorage.getItem('user');
        if (!raw) return null;
        const user = JSON.parse(raw);
        return {
            nombre: [user.Nombre, user.Apellido].filter(Boolean).join(' ') || user.Usuario || 'Maestro',
            institucion: user.Nombre_Institución || user.Código_Institución || '',
        };
    } catch {
        return null;
    }
}

function SideNav({
    section,
    onLogout,
    notificationCount = 0,
    onNavigate,
}: {
    section: MaestroSection;
    onLogout: () => void;
    notificationCount?: number;
    onNavigate?: () => void;
}) {
    const teacher = useMemo(() => readTeacher(), []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 1.75, py: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 0.5, mb: 3 }}>
                <Box
                    component="img"
                    src={maestroImg}
                    alt="Maestro"
                    sx={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0 }}
                />
                <Box>
                    <Typography sx={{ color: '#1B1B3A', fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        GraduaT
                    </Typography>
                    <Typography sx={{ color: '#8E93A8', fontSize: 12 }}>
                        Maestro
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                {NAV.map((item) => {
                    const active = item.id === section;
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.id}
                            onClick={() => {
                                onNavigate?.();
                                window.location.href = item.href;
                            }}
                            startIcon={<Icon size={16} />}
                            sx={{
                                justifyContent: 'flex-start',
                                px: 1.6,
                                py: 1.05,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: active ? 600 : 500,
                                fontSize: 14,
                                color: active ? '#ffffff' : '#8E93A8',
                                bgcolor: active ? '#6D5EF6' : 'transparent',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: active ? '#5B4DE0' : '#F4F5F8' },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                {item.label}
                                {item.id === 'historial' && notificationCount > 0 && (
                                    <Box sx={{
                                        minWidth: 18,
                                        height: 18,
                                        px: 0.5,
                                        borderRadius: '999px',
                                        bgcolor: active ? '#ffffff' : '#FDE8EE',
                                        color: active ? '#6D5EF6' : '#E15B86',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        display: 'grid',
                                        placeItems: 'center',
                                    }}>
                                        {notificationCount}
                                    </Box>
                                )}
                            </Box>
                        </Button>
                    );
                })}
            </Box>

            <Box sx={{ mt: 'auto' }}>
                <Typography sx={{ color: '#1B1B3A', fontSize: 14, fontWeight: 600, px: 1.6 }} noWrap>
                    {teacher?.nombre || 'Profesor'}
                </Typography>
                <Typography sx={{ color: '#8E93A8', fontSize: 12, px: 1.6, mb: 0.5 }} noWrap>
                    {teacher?.institucion || 'Sesión de maestro'}
                </Typography>
                <Button
                    onClick={onLogout}
                    startIcon={<LogOut size={15} />}
                    sx={{
                        color: '#8E93A8',
                        textTransform: 'none',
                        px: 1.6,
                        justifyContent: 'flex-start',
                        fontSize: 14,
                        borderRadius: '12px',
                        '&:hover': { bgcolor: '#F4F5F8', color: '#1B1B3A' },
                    }}
                >
                    Cerrar sesión
                </Button>
            </Box>
        </Box>
    );
}

export function MaestroPage({
    kicker,
    title,
    description,
    meta,
    actions,
    children,
}: {
    kicker: string;
    title: string;
    description: string;
    meta?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'flex-end' },
                gap: 2,
                flexWrap: 'wrap',
                mb: 3,
            }}>
                <Box sx={{ maxWidth: 640 }}>
                    <Typography sx={{ fontSize: 12, color: '#8E93A8', fontWeight: 500 }}>
                        {kicker}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 28, md: 32 }, lineHeight: 1.1, letterSpacing: '-0.04em', fontWeight: 700, color: '#1B1B3A', mt: 0.4 }}>
                        {title}
                    </Typography>
                    <Typography sx={{ color: '#8E93A8', mt: 0.75, fontSize: 14, lineHeight: 1.55 }}>
                        {description}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    {meta && (
                        <Typography sx={{ fontSize: 13, color: '#1B1B3A', px: 1.5, py: 0.6, borderRadius: '12px', bgcolor: '#F4F5F8' }}>{meta}</Typography>
                    )}
                    {actions}
                </Box>
            </Box>
            {children}
        </Box>
    );
}

export default function MaestroShell({ section, onLogout, notificationCount = 0, children }: MaestroShellProps) {
    const [open, setOpen] = useState(false);
    const current = NAV.find((item) => item.id === section);

    const drawer = (
        <SideNav
            section={section}
            onLogout={onLogout}
            notificationCount={notificationCount}
            onNavigate={() => setOpen(false)}
        />
    );

    return (
        <ThemeProvider theme={aulaTheme}>
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            bgcolor: '#F8F7FC',
            '& .MuiPaper-root': {
                backgroundImage: 'none',
                color: '#1B1B3A',
                borderRadius: '20px',
            },
            '& .MuiTableCell-root': { color: '#3D4158', borderColor: '#EEF0F6' },
            '& .MuiTab-root': { color: '#8E93A8', textTransform: 'none', borderRadius: '12px' },
            '& .Mui-selected': { color: '#6D5EF6 !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#6D5EF6' },
            '& .MuiAlert-root': { borderRadius: '16px' },
            '& .MuiButton-contained': {
                borderRadius: '12px',
                backgroundColor: '#6D5EF6',
                color: '#ffffff',
                boxShadow: 'none',
            },
            '& .MuiButton-outlined, & .MuiButton-text': { borderRadius: '12px' },
            '& .MuiDialog-paper': { borderRadius: '24px', border: '1px solid #EEF0F6' },
        }}>
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    width: 232,
                    flexShrink: 0,
                    bgcolor: '#ffffff',
                    borderRight: '1px solid #F1F2F6',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                {drawer}
            </Box>

            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: 280, bgcolor: '#ffffff' } }}
            >
                {drawer}
            </Drawer>

            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', bgcolor: '#F8F7FC' }}>
                <Box
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 1,
                        bgcolor: '#ffffff',
                        borderBottom: '1px solid #F1F2F6',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                    }}
                >
                    <IconButton aria-label="Abrir menú" onClick={() => setOpen(true)} sx={{ color: '#6D5EF6' }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography sx={{ fontWeight: 700, letterSpacing: '-0.03em', color: '#1B1B3A' }}>
                        {current?.label || 'Inicio'}
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, px: { xs: 2, md: 3.5 }, py: { xs: 2.5, md: 3 }, width: '100%' }}>
                    {children}
                </Box>

                <Box sx={{ px: { xs: 2, md: 3.5 }, py: 2, color: '#8E93A8', fontSize: 12 }}>
                    GraduaT · Universidad Mariano Gálvez, Retalhuleu
                </Box>
            </Box>
        </Box>
        </ThemeProvider>
    );
}
