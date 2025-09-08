import { Route, Routes } from 'react-router-dom';

// Importar páginas de institución
import LoginInstituciones from '../../pages/institution/loginIntitucion/login';    
import FormInst from '../../pages/institution/loginIntitucion/formInst';

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
      {/* Rutas específicas para la institución */}
      <Route path="/" element={<LoginInstituciones />} />
      <Route path="/formInst" element={<FormInst />} />
      
      {/* Ruta de error 404 para institución */}
      <Route path="/*" element={<InstitutionNotFound />} />
    </Routes>
  );
}
