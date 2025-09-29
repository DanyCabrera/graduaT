import { Route, Routes } from 'react-router-dom';

// Importar páginas de institución
import LoginInstituciones from '../../pages/institution/loginIntitucion/login';    
import FormInst from '../../pages/institution/loginIntitucion/formInst';
import CodigoAccesoInstitucion from '../../components/common/institucion/codigo_acceso';
import NotFound from '../../components/ui/notFound';

// Componente de error 404 para institución
const InstitutionNotFound = () => (
  <NotFound />
);

export default function InstitutionRoutes() {
  return (
    <Routes>
      {/* Código de acceso - Primera pantalla */}
      <Route path="/" element={<CodigoAccesoInstitucion />} />
      
      {/* Formulario de registro - Solo accesible con código válido */}
      <Route path="/registro" element={<LoginInstituciones />} />
      
      {/* Formulario de institución - Ruta alternativa */}
      <Route path="/formInst" element={<FormInst />} />
      
      {/* Ruta de error 404 para institución */}
      <Route path="/*" element={<InstitutionNotFound />} />
    </Routes>
  );
}
