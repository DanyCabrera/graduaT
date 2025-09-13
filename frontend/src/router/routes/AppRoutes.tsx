import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';

// Importar páginas
import RegistroLogin from "../../pages/auth/login/registro";
import Acceso from '../../pages/auth/login/acceso';
import Alumno from '../../pages/roles/alumno';
import Maestro from '../../pages/roles/maestro';

// Importar componentes
import Login from '../../pages/auth/login/login';
import CodigoAcceso from '../../components/forms/codigoAcceso';
import PanelRol from '../../components/ui/panelCardRol';
import VerifyEmail from '../../pages/auth/verify-email';

// Importar sub-routers
import AdminRoutes from './AdminRoutes';
import InstitutionRoutes from './InstitutionRoutes';

// Componente de error 404
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h1>404 - Página no encontrada</h1>
    <p>La página que buscas no existe.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route path={ROUTES.HOME} element={<Login />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.CODIGO_ACCESO} element={<CodigoAcceso />} />
      <Route path={ROUTES.PANEL_ROL} element={<PanelRol />} />
      <Route path={ROUTES.REGISTROL} element={<RegistroLogin />} />
      <Route path={ROUTES.ACCESO} element={<Acceso />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Rutas de roles */}
      <Route path={ROUTES.ALUMNO} element={<Alumno />} />
      <Route path={ROUTES.MAESTRO} element={<Maestro />} />

      {/* Sub-rutas de administración */}
      <Route path={`${ROUTES.ADMIN}/*`} element={<AdminRoutes />} />

      {/* Sub-rutas de institución */}
      <Route path={`${ROUTES.REGISTRO}/*`} element={<InstitutionRoutes />} />

      {/* Ruta de error 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}