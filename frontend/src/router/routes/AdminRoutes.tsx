import { Route, Routes } from 'react-router-dom';

// Importar componentes y páginas de administración
import LoginAdmin from '../../components/common/admin/login';
import AdminPanel from '../../pages/admin/admin';

// Componente de error 404 para admin
const AdminNotFound = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h1>404 - Página de administración no encontrada</h1>
    <p>La página de administración que buscas no existe.</p>
  </div>
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