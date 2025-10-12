import { AppRoutes } from './router';
import { ConnectionErrorHandler } from './components/common/ConnectionErrorHandler';
import './styles/App.css';

function App() {
    return (
        <ConnectionErrorHandler>
            <AppRoutes />
        </ConnectionErrorHandler>
    );
}

export default App;