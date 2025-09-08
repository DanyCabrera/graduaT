import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import Navbar from './navbar';

export default function PanelRol() {
    // Nombre de los roles
    const nombresRoles = ['Supervisor', 'Director', 'Maestro', 'Alumno'];
    // Rutas de las imágenes de los roles
    const imgRoles = [
        "https://cdn-icons-png.freepik.com/512/10992/10992894.png", 
        "https://cdn-icons-png.freepik.com/512/10992/10992894.png", 
        "https://cdn-icons-png.freepik.com/512/10992/10992894.png", 
        "https://cdn-icons-png.freepik.com/512/10992/10992894.png"];

    // Función para manejar el clic en una tarjeta
    const navigate = useNavigate();
        const handleCardClick = (rol: string) => {
        localStorage.setItem('selectedRol', rol);
        navigate("/Login");
    };
    return (
        <>
            {/* <Navbar /> */}
            <div className="container-card" 
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center', // Centra horizontalmente
                    alignItems: 'center', // Centra verticalmente
                    backgroundColor: 'rgba(13, 62, 237, 0)',
                }}
            >
                {nombresRoles.map((rol, index) => (
                    <Card
                        key={index}
                        variant="outlined"
                        sx={{
                            width: 280,
                            height: 400,
                            margin: '.8rem',
                            borderRadius: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                bgcolor: 'rgba(0, 38, 255, 0.05)',
                                boxShadow: 'rgba(0, 0, 255, 0.28) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px',
                            },
                        }}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Typography variant='h5'
                                sx={{
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {rol}
                            </Typography>
                            <img
                                    src={imgRoles[index]}
                                    alt={rol}
                                    style={{
                                        width: "170px",
                                        height: "170px",
                                    }}
                                />
                            <Button 
                                onClick={() => handleCardClick(rol)}
                                variant='outlined' 
                                color='primary' 
                                sx={{
                                width: '80%',
                                transition: 'transform 0.2s all',
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: 'rgba(25, 53, 210, 0.2)',
                                }
                            }}>
                                Entrar
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <style>
                {`
                @media (max-width: 768px) {
                    .container-card {
                        flex-direction: column;
                    }
                }
                `}
            </style>
        </>
    )
}