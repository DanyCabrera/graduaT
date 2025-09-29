import { Route, Routes } from 'react-router-dom';

// Importar componentes y páginas de administración
import LoginAdmin from '../../components/common/admin/login';
import AdminPanel from '../../pages/admin/admin';
import NotFound from '../../components/ui/notFound';

// Componente de error 404 para admin
const AdminNotFound = () => (
  <NotFound />
);
  

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Rutas específicas para el administrador */}
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/panel" element={<AdminPanel />} />
      
      {/* Ruta de error 404 para admin */}
      <Route path="/*" element={<AdminNotFound />} />
    </Routes>
  );
}