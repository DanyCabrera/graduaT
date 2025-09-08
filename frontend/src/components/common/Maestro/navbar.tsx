import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Navbar() {
    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "white",
                    color: "black",
                    boxShadow: "none",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", marginLeft: 3 }}
                    >
                        Maestro
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button color="inherit">
                            Inicio
                        </Button>
                        <Button color="inherit">
                            Alumnos
                        </Button>
                        <Button color="inherit">
                            Agenda
                        </Button>
                        <Button color="inherit">
                            Historial
                        </Button>
                        <Button color="inherit">
                            Tests
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}
