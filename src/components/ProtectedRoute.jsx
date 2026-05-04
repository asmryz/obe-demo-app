import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

function ProtectedRoute() {
    const { signedIn } = useStore();
    return signedIn ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;
