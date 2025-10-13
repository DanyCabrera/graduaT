import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Fade,
    Slide
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Warning,
    Info,
    Close
} from '@mui/icons-material';

interface StyledAlertProps {
    open: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    details?: string;
    showDetails?: boolean;
}

const StyledAlert: React.FC<StyledAlertProps> = ({
    open,
    onClose,
    type,
    title,
    message,
    details,
    showDetails = false
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle sx={{ fontSize: 48, color: '#10b981' }} />;
            case 'error':
                return <Error sx={{ fontSize: 48, color: '#ef4444' }} />;
            case 'warning':
                return <Warning sx={{ fontSize: 48, color: '#f59e0b' }} />;
            case 'info':
                return <Info sx={{ fontSize: 48, color: '#3b82f6' }} />;
            default:
                return <Info sx={{ fontSize: 48, color: '#3b82f6' }} />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            case 'error':
                return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            case 'warning':
                return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            case 'info':
                return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            default:
                return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'success':
                return '#10b981';
            case 'error':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'info':
                return '#3b82f6';
            default:
                return '#3b82f6';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }
            }}
            TransitionComponent={Slide}
            TransitionProps={{ in: open, timeout: 300 }}
        >
            <Fade in={open} timeout={300}>
                <Box>
                    {/* Header con gradiente */}
                    <Box
                        sx={{
                            background: getBackgroundColor(),
                            p: 3,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Patrón de fondo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                opacity: 0.3
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -30,
                                left: -30,
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                opacity: 0.2
                            }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
                            {getIcon()}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {title}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {message}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Contenido */}
                    {showDetails && details && (
                        <DialogContent sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#64748b',
                                    lineHeight: 1.6,
                                    backgroundColor: 'white',
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                {details}
                            </Typography>
                        </DialogContent>
                    )}

                    {/* Acciones */}
                    <DialogActions sx={{ p: 3, backgroundColor: '#f8fafc' }}>
                        <Button
                            onClick={onClose}
                            variant="contained"
                            sx={{
                                backgroundColor: getButtonColor(),
                                color: 'white',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: getButtonColor(),
                                    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
                                    transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            Entendido
                        </Button>
                    </DialogActions>
                </Box>
            </Fade>
        </Dialog>
    );
};

export default StyledAlert;
