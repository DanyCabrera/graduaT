import {Routes, Route} from 'react-router-dom';
import Login from "../pages/login/login";
import PanelRol from '../components/panelCardRol';
import CodigoAcceso from '../components/codigoAcceso';
import Acceso from '../pages/login/acceso';
import RouterAdmin from './routerAdmin';
import RouteInst from './routeInsti';
import Alumno from '../pages/rol/alumno';
import Maestro from '../pages/rol/maestro';
export default function Router() {
    return (
        <Routes>
            {/* Ruta principal, ingresar codigo de Acceso para poder registrar su rol */}
            <Route path='/' element={<CodigoAcceso />} />

            {/* Ruta para el panel de roles */}
            <Route path='/panelRol' element={<PanelRol />} />

            {/* Ruta para el login */}
            <Route path='/login' element={<Login />} />

            {/* Ruta para el acceso */}
            <Route path='/acceso' element={<Acceso />} />

            <Route path='/alumno' element={<Alumno />} />

            <Route path='/maestro' element={<Maestro />} />

            {/* Ruta para el 404 */}
            <Route path='/*' element={<h1>404 - Not Found</h1>} />





            {/**Panel del administrados */}
            <Route path='/admin/*' element={<RouterAdmin />} />

            {/**Panel de registro de instituciones */}
            <Route path='/registro/*' element={<RouteInst />} />

        </Routes>
    )
}