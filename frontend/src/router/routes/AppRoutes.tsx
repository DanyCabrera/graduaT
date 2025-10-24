import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';

// Importar páginas
import RegistroLogin from "../../pages/auth/login/registro";
import Acceso from '../../pages/auth/login/acceso';
import Alumno from '../../pages/roles/alumno';
import Maestro from '../../pages/roles/maestro';
import Director from '../../pages/roles/director'; 
import Supervisor from '../../pages/roles/supervisor';

//Alumno
import ProgresoPage from '../../pages/roles/alumno/ProgresoPage';
import MatematicasPage from '../../pages/roles/alumno/MatematicasPage';
import ComunicacionPage from '../../pages/roles/alumno/ComunicacionPage';

//Maestro
import AgendaPage from '../../pages/roles/maestro/AgendaPage';
import AlumnosPage from '../../pages/roles/maestro/AlumnosPage';
import HistorialPage from '../../pages/roles/maestro/HistorialPage';
import TestsPage from '../../pages/roles/maestro/TestsPage';

//Director
import DirectorAlumnosPage from '../../pages/roles/director/AlumnosPage';
import DirectorMaestrosPage from '../../pages/roles/director/MaestrosPage';
import DirectorCursosPage from '../../pages/roles/director/CursosPage';
import DirectorRendimientoPage from '../../pages/roles/director/RendimientoPage';
import DirectorInformacionPage from '../../pages/roles/director/InformacionPage';

//Supervisor

// Importar componentes
import Login from '../../pages/auth/login/login';
import CodigoAcceso from '../../components/forms/codigoAcceso';
import PanelRol from '../../components/ui/panelCardRol';
import VerifyEmail from '../../pages/auth/verify-email';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

// Importar sub-routers
import AdminRoutes from './AdminRoutes';
import InstitutionRoutes from './InstitutionRoutes';

//Importar not found
import NotFound from '../../components/ui/notFound';


export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route path={ROUTES.HOME} element={<Login />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.CODIGO_ACCESO} element={<CodigoAcceso />} />
      <Route path={ROUTES.PANEL_ROL} element={
        <ProtectedRoute requiredAccess="ROL">
          <PanelRol />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.REGISTROL} element={<RegistroLogin />} />
      <Route path={ROUTES.ACCESO} element={<Acceso />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Rutas de roles */}
      <Route path={ROUTES.ALUMNO} element={<Alumno />} />
      <Route path={ROUTES.MAESTRO} element={<Maestro />} />
      <Route path={ROUTES.DIRECTOR} element={<Director />} />
      <Route path={ROUTES.SUPERVISOR} element={<Supervisor />} />

      {/*Alumno*/}
      <Route path={ROUTES.PROGRESO} element={<ProgresoPage />} />
      <Route path={ROUTES.ALUMNO_MATEMATICAS} element={<MatematicasPage />} />
      <Route path={ROUTES.ALUMNO_COMUNICACION} element={<ComunicacionPage />} />
      
      {/*Maestro*/}
      <Route path={ROUTES.MAESTRO_AGENDA} element={<AgendaPage />} />
      <Route path={ROUTES.MAESTRO_ALUMNOS} element={<AlumnosPage />} />
      <Route path={ROUTES.MAESTRO_HISTORIAL} element={<HistorialPage />} />
      <Route path={ROUTES.MAESTRO_TESTS} element={<TestsPage />} />
      
      {/*Director*/}
      <Route path={ROUTES.DIRECTOR_ALUMNOS} element={<DirectorAlumnosPage />} />
      <Route path={ROUTES.DIRECTOR_MAESTROS} element={<DirectorMaestrosPage />} />
      <Route path={ROUTES.DIRECTOR_CURSOS} element={<DirectorCursosPage />} />
      <Route path={ROUTES.DIRECTOR_RENDIMIENTO} element={<DirectorRendimientoPage />} />
      <Route path={ROUTES.DIRECTOR_INFORMACION} element={<DirectorInformacionPage />} />
      
      {/*Supervisor*/}

      {/* Sub-rutas de administración */}
      <Route path={`${ROUTES.ADMIN}/*`} element={<AdminRoutes />} />

      {/* Sub-rutas de institución */}
      <Route path={`${ROUTES.REGISTRO}/*`} element={<InstitutionRoutes />} />

      {/* Ruta de error 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}