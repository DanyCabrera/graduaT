// maestro.tsx
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Calendar, BookCheck, Users, BookOpen } from 'lucide-react';
import maestroImg from '../../../assets/ProfesorT.png';

import { SessionErrorHandler } from '../SessionErrorHandler';
import { apiService } from '../../../services/api';
import { API_BASE_URL } from '../../../constants';
import { testAssignmentService, type TestAssignment } from '../../../services/testAssignmentService';
import { getSessionToken } from '../../../utils/authUtils';
import type { AgendaSemana } from '../../../services/agendaService';

import MaestroShell from "./MaestroShell";
import Agenda from "./agenda";
import Alumno from "./alumnos";
import Historial from "./historial";
import Test from "./test";

interface UserData {
    Usuario: string;
    Nombre: string;
    Apellido: string;
    Correo: string;
    Teléfono: string;
    Rol: string;
    Código_Institución: string;
    Nombre_Institución?: string;
    CURSO?: string[];
}

interface IndexMaestroProps {
    userData?: UserData | null;
}

const card = {
    bgcolor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(80, 70, 140, 0.06)',
    border: '1px solid #F3F4F8',
};

const tooltipStyle = {
    borderRadius: 12,
    border: 'none',
    boxShadow: '0 8px 24px rgba(80, 70, 140, 0.12)',
    fontSize: 13,
};

function ir(href: string) {
    window.location.href = href;
}

function esComunicacion(nombre?: string) {
    return (nombre || '').toLowerCase().includes('comun');
}

function InicioMaestro({ user }: { user: UserData | null }) {
    const [agendas, setAgendas] = useState<AgendaSemana[]>([]);
    const [tests, setTests] = useState<TestAssignment[]>([]);
    const [alumnos, setAlumnos] = useState<string[]>([]);
    const [loadingTests, setLoadingTests] = useState(true);
    const [loadingAlumnos, setLoadingAlumnos] = useState(true);

    const nombre = user ? `${user.Nombre} ${user.Apellido}`.trim() : 'Maestro';
    const institucion = user?.Nombre_Institución || 'tu institución';

    useEffect(() => {
        try {
            const userKey = user?.Usuario || 'unknown';
            const saved = localStorage.getItem(`maestro_agenda_${userKey}`);
            setAgendas(saved ? JSON.parse(saved) : []);
        } catch {
            setAgendas([]);
        }
    }, [user?.Usuario]);

    useEffect(() => {
        let activo = true;
        (async () => {
            try {
                const response = await testAssignmentService.getAssignedTestsForTeacher();
                if (!activo) return;
                if (response.success && Array.isArray(response.data)) {
                    const vistos = new Set<string>();
                    setTests(response.data.filter((item) => {
                        if (!item?.testId || vistos.has(item.testId)) return false;
                        vistos.add(item.testId);
                        return true;
                    }));
                } else {
                    setTests([]);
                }
            } catch {
                if (activo) setTests([]);
            } finally {
                if (activo) setLoadingTests(false);
            }
        })();
        return () => { activo = false; };
    }, []);

    useEffect(() => {
        let activo = true;
        (async () => {
            try {
                const token = getSessionToken() || localStorage.getItem('token');
                const codigo = user?.Código_Institución;
                if (!token || !codigo) {
                    setAlumnos([]);
                    return;
                }
                const response = await fetch(`${API_BASE_URL}/alumnos/institucion/${encodeURIComponent(codigo)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    setAlumnos([]);
                    return;
                }
                const data = await response.json();
                if (!activo) return;
                const lista = Array.isArray(data.data) ? data.data : [];
                setAlumnos(lista.map((alumno: { Nombre?: string; Apellido?: string; Usuario?: string }) => (
                    [alumno.Nombre, alumno.Apellido].filter(Boolean).join(' ') || alumno.Usuario || 'Alumno'
                )));
            } catch {
                if (activo) setAlumnos([]);
            } finally {
                if (activo) setLoadingAlumnos(false);
            }
        })();
        return () => { activo = false; };
    }, [user?.Código_Institución]);

    const temas = agendas.reduce((total, agenda) => total + (agenda.temas?.length || 0), 0);
    const barrasAgenda = agendas.map((agenda) => ({
        nombre: `S${agenda.semana}`,
        temas: agenda.temas?.length || 0,
        fill: esComunicacion(agenda.nombre) ? '#3DDC97' : '#4C78F0',
    }));
    const barrasTests = [
        { nombre: 'Matemáticas', total: tests.filter((test) => test.testType === 'matematicas').length, fill: '#7B61FF' },
        { nombre: 'Comunicación', total: tests.filter((test) => test.testType === 'comunicacion').length, fill: '#F5C14A' },
    ];
    const kpis = [
        { valor: agendas.length, etiqueta: 'Agendas', detalle: 'semanas listas', bg: '#FDE8EE', color: '#E15B86', icon: <Calendar size={16} /> },
        { valor: loadingTests ? '…' : tests.length, etiqueta: 'Tests', detalle: 'pruebas del curso', bg: '#FFF4D4', color: '#E0A322', icon: <BookCheck size={16} /> },
        { valor: loadingAlumnos ? '…' : alumnos.length, etiqueta: 'Alumnos', detalle: 'en la institución', bg: '#E4F8EA', color: '#2EBE78', icon: <Users size={16} /> },
        { valor: temas, etiqueta: 'Temas', detalle: 'en las agendas', bg: '#EDE7FE', color: '#7A62F0', icon: <BookOpen size={16} /> },
    ];
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, letterSpacing: '-0.04em', color: '#1B1B3A' }}>
                    Inicio
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1B1B3A', lineHeight: 1.2 }}>{nombre}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#8E93A8' }}>{institucion}</Typography>
                    </Box>
                    <Box
                        component="img"
                        src={maestroImg}
                        alt="Maestro"
                        sx={{ width: 52, height: 52, objectFit: 'contain' }}
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.45fr 0.85fr' }, gap: 2, mb: 2 }}>
                <Box sx={{ ...card, p: 2.25 }}>
                    <Typography sx={{ fontWeight: 700, color: '#1B1B3A', fontSize: 16 }}>Resumen del aula</Typography>
                    <Typography sx={{ color: '#8E93A8', fontSize: 13, mb: 2 }}>Agendas, tests y alumnos</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.25 }}>
                        {kpis.map((item) => (
                            <Box key={item.etiqueta} sx={{ bgcolor: item.bg, borderRadius: '16px', p: 1.6, minHeight: 124 }}>
                                <Box sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '10px',
                                    bgcolor: 'rgba(255,255,255,0.72)',
                                    color: item.color,
                                    display: 'grid',
                                    placeItems: 'center',
                                    mb: 1.25,
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#1B1B3A', lineHeight: 1 }}>{item.valor}</Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1B1B3A', mt: 0.6 }}>{item.etiqueta}</Typography>
                                <Typography sx={{ fontSize: 12, color: item.color, mt: 0.15 }}>{item.detalle}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ ...card, p: 2.25 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, color: '#1B1B3A', fontSize: 16 }}>Tests asignados</Typography>
                            <Typography sx={{ color: '#8E93A8', fontSize: 13 }}>Por curso</Typography>
                        </Box>
                        <Abrir href="/maestro/tests" />
                    </Box>
                    {loadingTests ? (
                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 4 }}>Cargando…</Typography>
                    ) : tests.length === 0 ? (
                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 4, lineHeight: 1.5 }}>
                            Cuando asignes un test al curso, la comparación aparece aquí.
                        </Typography>
                    ) : (
                        <Box sx={{ height: 210 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barrasTests} barSize={36}>
                                    <CartesianGrid vertical={false} stroke="#F1F2F6" />
                                    <XAxis dataKey="nombre" tick={{ fill: '#8E93A8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fill: '#8E93A8', fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                                    <Tooltip cursor={{ fill: 'rgba(109,94,246,0.06)' }} contentStyle={tooltipStyle} />
                                    <Bar dataKey="total" radius={[8, 8, 0, 0]} name="Tests">
                                        {barrasTests.map((item, index) => (
                                            <Cell key={`${item.nombre}-${index}`} fill={item.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.35fr 0.8fr 0.8fr' }, gap: 2 }}>
                <Box sx={{ ...card, p: 2.25 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, color: '#1B1B3A', fontSize: 16 }}>Agendas generadas</Typography>
                            <Typography sx={{ color: '#8E93A8', fontSize: 13 }}>Temas por semana</Typography>
                        </Box>
                        <Abrir href="/maestro/agenda" />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Leyenda color="#4C78F0" texto="Matemáticas" />
                        <Leyenda color="#3DDC97" texto="Comunicación" />
                    </Box>
                    {agendas.length === 0 ? (
                        <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 3, lineHeight: 1.5 }}>
                            Genera la primera semana y el gráfico se llena con sus temas.
                        </Typography>
                    ) : (
                        <Box sx={{ height: 210 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barrasAgenda} barSize={22}>
                                    <CartesianGrid vertical={false} stroke="#F1F2F6" />
                                    <XAxis dataKey="nombre" tick={{ fill: '#8E93A8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fill: '#8E93A8', fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                                    <Tooltip cursor={{ fill: 'rgba(76,120,240,0.06)' }} contentStyle={tooltipStyle} />
                                    <Bar dataKey="temas" radius={[8, 8, 0, 0]} name="Temas">
                                        {barrasAgenda.map((item, index) => (
                                            <Cell key={`${item.nombre}-${index}`} fill={item.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Box>

                <Lista
                    titulo="Tests"
                    href="/maestro/tests"
                    cargando={loadingTests}
                    vacio="Todavía no hay tests asignados."
                    total={tests.length}
                >
                    {tests.slice(0, 5).map((test) => (
                        <Fila key={test.testId} titulo={test.test?.titulo || 'Test'} detalle={
                            `${test.testType === 'matematicas' ? 'Matemáticas' : 'Comunicación'}${test.test?.semana ? ` · Semana ${test.test.semana}` : ''}`
                        } extra={test.estado} extraColor={test.estado === 'completado' ? '#2EBE78' : '#6D5EF6'} />
                    ))}
                </Lista>

                <Lista
                    titulo="Alumnos"
                    href="/maestro/alumnos"
                    cargando={loadingAlumnos}
                    vacio="Los alumnos de tu institución aparecen aquí."
                    total={alumnos.length}
                >
                    {alumnos.slice(0, 5).map((alumno, index) => (
                        <Fila key={`${alumno}-${index}`} titulo={alumno} pastilla={['#FDE8EE', '#FFF4D4', '#E4F8EA', '#EDE7FE'][index % 4]} tinta={['#E15B86', '#E0A322', '#2EBE78', '#7A62F0'][index % 4]} />
                    ))}
                </Lista>
            </Box>
        </Box>
    );
}

function Abrir({ href }: { href: string }) {
    return (
        <Button
            onClick={() => ir(href)}
            sx={{
                textTransform: 'none',
                color: '#1B1B3A',
                bgcolor: '#F4F5F8',
                borderRadius: '12px',
                px: 1.5,
                py: 0.4,
                minWidth: 0,
                fontSize: 13,
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#E9EBF2' },
            }}
        >
            Abrir
        </Button>
    );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '99px', bgcolor: color }} />
            <Typography sx={{ fontSize: 12, color: '#8E93A8' }}>{texto}</Typography>
        </Box>
    );
}

function Fila({
    titulo,
    detalle,
    extra,
    extraColor,
    pastilla,
    tinta,
}: {
    titulo: string;
    detalle?: string;
    extra?: string;
    extraColor?: string;
    pastilla?: string;
    tinta?: string;
}) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 1.1, borderTop: '1px solid #F3F4F8' }}>
            {pastilla && (
                <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    bgcolor: pastilla,
                    color: tinta,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                }}>
                    {titulo.trim().charAt(0).toUpperCase()}
                </Box>
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1B1B3A', fontSize: 14 }} noWrap>{titulo}</Typography>
                {detalle && <Typography sx={{ color: '#8E93A8', fontSize: 12 }} noWrap>{detalle}</Typography>}
            </Box>
            {extra && (
                <Typography sx={{ color: extraColor || '#6D5EF6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 }}>
                    {extra}
                </Typography>
            )}
        </Box>
    );
}

function Lista({
    titulo,
    href,
    cargando,
    vacio,
    total,
    children,
}: {
    titulo: string;
    href: string;
    cargando: boolean;
    vacio: string;
    total: number;
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ ...card, p: 2.25 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontWeight: 700, color: '#1B1B3A', fontSize: 16 }}>{titulo}</Typography>
                <Abrir href={href} />
            </Box>
            {cargando ? (
                <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 1.5 }}>Cargando…</Typography>
            ) : total === 0 ? (
                <Typography sx={{ color: '#8E93A8', fontSize: 14, mt: 1.5, lineHeight: 1.5 }}>{vacio}</Typography>
            ) : (
                <Box>
                    {children}
                    {total > 5 && (
                        <Typography sx={{ color: '#8E93A8', fontSize: 12, mt: 1.25 }}>y {total - 5} más</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

const IndexMaestro: React.FC<IndexMaestroProps> = ({ userData }) => {
    const [currentSection, setCurrentSection] = useState('inicio');
    const [historialRefreshTrigger, setHistorialRefreshTrigger] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [sessionError, setSessionError] = useState<Error | null>(null);

    // Verificar que el usuario sea maestro (solo una vez al cargar)
    useEffect(() => {
        const checkUserRole = () => {
            // Usar los datos del prop userData en lugar de localStorage para evitar conflictos
            if (userData) {
                if (userData.Rol !== 'Maestro') {
                    console.warn('⚠️ Usuario no es maestro:', userData.Rol);
                    setSessionError(new Error(`Acceso denegado. Rol actual: ${userData.Rol}. Se requiere rol: Maestro`));
                } else {
                    console.log('✅ Usuario es maestro, sesión válida');
                    setSessionError(null);
                }
            } else {
                // Fallback a localStorage solo si no hay userData
                const storedUser = localStorage.getItem('user_data');
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser);
                        if (user.Rol !== 'Maestro') {
                            console.warn('⚠️ Usuario no es maestro:', user.Rol);
                            setSessionError(new Error(`Acceso denegado. Rol actual: ${user.Rol}. Se requiere rol: Maestro`));
                        } else {
                            console.log('✅ Usuario es maestro, sesión válida');
                            setSessionError(null);
                        }
                    } catch (error) {
                        console.error('Error al verificar rol de usuario:', error);
                    }
                }
            }
        };

        checkUserRole();
        
        // NO escuchar cambios en localStorage para evitar conflictos entre pestañas
        // Cada pestaña mantiene su propia sesión aislada
        console.log('🔒 Panel de Maestro: Sesión aislada, no escuchando cambios de localStorage');
    }, [userData]);

    // Forzar la actualización del token al cargar el componente
    useEffect(() => {
        apiService.refreshTabToken();
    }, []);

    const handleLogout = () => {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_role');
        
        // Redirigir al inicio
        window.location.href = '/';
    };


    const refreshHistorial = () => {
        console.log('🔄 Refrescando historial...');
        setHistorialRefreshTrigger(prev => prev + 1);
    };

    const updateNotificationCount = (count: number) => {
        setNotificationCount(count);
    };

    // const handleSessionError = (error: Error) => {
    //     console.log('🚨 Error de sesión en maestro:', error);
    //     setSessionError(error);
    // };

    const clearSessionError = () => {
        setSessionError(null);
    };

    const renderContent = () => {
        switch (currentSection) {
            case 'agenda':
                return <Agenda />;
            case 'alumnos':
                return <Alumno />;
            case 'historial':
                return (
                    <Historial
                        refreshTrigger={historialRefreshTrigger}
                        onNotificationCountChange={updateNotificationCount}
                    />
                );
            case 'tests':
                return <Test onTestsCleared={refreshHistorial} />;
            default:
                return <InicioMaestro user={userData ?? null} />;
        }
    };

    const shellSection = (['inicio', 'alumnos', 'agenda', 'historial', 'tests'].includes(currentSection)
        ? currentSection
        : 'inicio') as 'inicio' | 'alumnos' | 'agenda' | 'historial' | 'tests';

    return (
        <>
            <MaestroShell
                section={shellSection}
                onLogout={handleLogout}
                notificationCount={notificationCount}
            >
                {renderContent()}
            </MaestroShell>
            <SessionErrorHandler
                error={sessionError}
                onRetry={() => {
                    clearSessionError();
                    // Recargar la sección actual
                    window.location.reload();
                }}
                onClearError={clearSessionError}
                context="maestro"
            />
            
        </>
    );
};

export default IndexMaestro;