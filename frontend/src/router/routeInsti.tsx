import {
    Route, Routes
} from 'react-router-dom';
import LoginInstituciones from '../pages/loginIntitucion/login';
import FormInst from '../pages/loginIntitucion/formInst';
import CodigoAcceso from '../components/codigoAcceso';

export default function RouteInst() {
    return (
        <Routes>
            {/* Aquí van las rutas específicas para la institución */}
            <Route path='/' element={<CodigoAcceso />} />
            <Route path='/login' element={<LoginInstituciones />} />
            <Route path='/formInst' element={<FormInst />} />
            <Route path='/*' element={<h1>404 - Not Found in Institucion</h1>} />
        </Routes>
    );
}
