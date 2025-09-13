import { Route, Routes } from 'react-router-dom';

// Importar páginas de institución
import LoginInstituciones from '../../pages/institution/loginIntitucion/login';    
import FormInst from '../../pages/institution/loginIntitucion/formInst';
import CodigoAccesoInstitucion from '../../components/common/institucion/codigo_acceso';

// Componente de error 404 para institución
const InstitutionNotFound = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h1>404 - Página de institución no encontrada</h1>
    <p>La página de institución que buscas no existe.</p>
  </div>
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
