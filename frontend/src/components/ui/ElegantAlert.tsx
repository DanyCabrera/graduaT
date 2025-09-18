import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Fade,
    Slide,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

interface ElegantAlertProps {
    open: boolean;
    onClose: () => void;
    severity: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    autoHideDuration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ElegantAlert: React.FC<ElegantAlertProps> = ({
    open,
    onClose,
    severity,
    title,
    message,
    autoHideDuration = 6000,
    position = 'top-right'
}) => {
    React.useEffect(() => {
        if (open && autoHideDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [open, autoHideDuration, onClose]);

    const getSeverityConfig = () => {
        switch (severity) {
            case 'success':
                return {
                    icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
                    bgColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    iconBg: '#f3f4f6',
                    iconColor: '#10b981',
                    titleColor: '#111827',
                    textColor: '#6b7280',
                    accentColor: '#10b981',
                };
            case 'error':
                return {
                    icon: <ErrorIcon sx={{ fontSize: 24 }} />,
                    bgColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    iconBg: '#f3f4f6',
                    iconColor: '#ef4444',
                    titleColor: '#111827',
                    textColor: '#6b7280',
                    accentColor: '#ef4444',
                };
            case 'warning':
                return {
                    icon: <WarningIcon sx={{ fontSize: 24 }} />,
                    bgColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    iconBg: '#f3f4f6',
                    iconColor: '#f59e0b',
                    titleColor: '#111827',
                    textColor: '#6b7280',
                    accentColor: '#f59e0b',
                };
            case 'info':
                return {
                    icon: <InfoIcon sx={{ fontSize: 24 }} />,
                    bgColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    iconBg: '#f3f4f6',
                    iconColor: '#3b82f6',
                    titleColor: '#111827',
                    textColor: '#6b7280',
                    accentColor: '#3b82f6',
                };
            default:
                return {
                    icon: <InfoIcon sx={{ fontSize: 24 }} />,
                    bgColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    iconBg: '#f3f4f6',
                    iconColor: '#3b82f6',
                    titleColor: '#111827',
                    textColor: '#6b7280',
                    accentColor: '#3b82f6',
                };
        }
    };

    const getPositionStyles = () => {
        switch (position) {
            case 'top-right':
                return { top: 24, right: 24 };
            case 'top-left':
                return { top: 24, left: 24 };
            case 'bottom-right':
                return { bottom: 24, right: 24 };
            case 'bottom-left':
                return { bottom: 24, left: 24 };
            case 'top-center':
                return { top: 24, left: '50%', transform: 'translateX(-50%)' };
            case 'bottom-center':
                return { bottom: 24, left: '50%', transform: 'translateX(-50%)' };
            default:
                return { top: 24, right: 24 };
        }
    };

    const config = getSeverityConfig();
    const positionStyles = getPositionStyles();

    return (
        <Fade in={open} timeout={300}>
            <Box
                sx={{
                    position: 'fixed',
                    zIndex: 9999,
                    minWidth: 350,
                    maxWidth: 500,
                    ...positionStyles,
                }}
            >
                <Slide
                    direction={position.includes('right') ? 'left' : 'right'}
                    in={open}
                    timeout={300}
                >
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: config.bgColor,
                            border: `1px solid ${config.borderColor}`,
                            borderRadius: 3,
                            position: 'relative',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {/* Accent line */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 3,
                                backgroundColor: config.accentColor,
                                borderRadius: '3px 3px 0 0',
                            }}
                        />

                        {/* Close button */}
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                width: 28,
                                height: 28,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: '#f3f4f6',
                                },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 16, color: config.textColor }} />
                        </IconButton>

                        {/* Content */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, pr: 4 }}>
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    backgroundColor: config.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: `1px solid ${config.borderColor}`,
                                }}
                            >
                                <Box sx={{ color: config.iconColor }}>
                                    {config.icon}
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: config.titleColor,
                                        mb: 1,
                                        fontSize: '1rem',
                                    }}
                                >
                                    {title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: config.textColor,
                                        lineHeight: 1.5,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {message}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
            </Box>
        </Fade>
    );
};

export default ElegantAlert;
