import { Box, Typography, Button, Link, Grid } from "@mui/material";
import logo from "../../assets/logoo1.png";

// Footer para Maestro
export function FooterMaestro() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#113507ff",
        color: "white",
        mt: "auto",
        py: 4,
        px: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        
        <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "left" }}>
          <Box
            component="img"
            src={logo}
            alt="GraduaT logo"
            sx={{ height: 60,  ml: { xs: 0, md: 3 } }}
          />
        </Grid>

      
        <Grid item xs={12} md={4} textAlign="center">
          {["Inicio", "Alumnos", "Agenda", "Historial", "Test"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              underline="none"
              color="inherit"
              sx={{ mx: 2, "&:hover": { color: "gray" } }}
            >
              {item}
            </Link>
          ))}
        </Grid>

       
        <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "right" }}>
          <Button
            variant="outlined"
            color="inherit"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=graduat502@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contáctanos
          </Button>
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 3, color: "gray" }}
      >
        © {new Date().getFullYear()} GraduaT. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}

// Footer para Alumno
export function FooterAlumno() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#113507ff",
        color: "white",
        mt: "auto",
        py: 4,
        px: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
       
        <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "left" }}>
          <Box
            component="img"
            src={logo}
            alt="GraduaT logo"
            sx={{ height: 60, ml: { xs: 0, md: 3 } }}
          />
        </Grid>

       
        <Grid item xs={12} md={4} textAlign="center">
          {["Inicio", "PruebaT", "Progreso"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              underline="none"
              color="inherit"
              sx={{ mx: 2, "&:hover": { color: "gray" } }}
            >
              {item}
            </Link>
          ))}
        </Grid>

       
        <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "right" }}>
          <Button
            variant="outlined"
            color="inherit"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=graduat502@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contáctanos
          </Button>
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 3, color: "gray" }}
      >
        © {new Date().getFullYear()} GraduaT. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
