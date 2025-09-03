import {
    Route, Routes
} from 'react-router-dom';
import LoginAdmin from '../components/admin/login';
import AdminPanel from '../pages/admin/admin';

export default function RouterAdmin() {
    return (
        <Routes>
            {/* Aquí van las rutas específicas para el administrador */}
            <Route path='/' element={<LoginAdmin />} />
            <Route path='/admin' element={<AdminPanel />} />
            <Route path='/*' element={<h1>404 - Not Found in Admin</h1>} />
        </Routes>
    )
}