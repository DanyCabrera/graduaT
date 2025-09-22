import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";

interface NavbarProps {
    onLogout?: () => void;
}
export default function NavbarDirector({ onLogout }: NavbarProps) {
    return(
        <>
            <h1>Hola</h1>
            <Button 
                onClick={onLogout}
                startIcon={<Logout />}
                sx={{
                    color: '#d32f2f',
                    '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                    }
                }}>
                Cerrar Sesión
            </Button>
        </>
    )
}