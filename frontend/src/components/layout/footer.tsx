import Typography from "@mui/material/Typography";

export default function Footer() {
    return (
        <>
            {/* Keyri vas hacer el footer, busca diseños en google */}
            <Typography variant="body1" component="p" sx={{ textAlign: "center", marginTop: 2 }}>
                Copyright © {new Date().getFullYear()} GraduaT. Todos los derechos reservados.
            </Typography>   
        </>
    )
}