import { Navigate, Outlet, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth.js';

// Маршрут-охоронець: неавтентифікованого користувача перенаправляє на
// сторінку входу та запам'ятовує адресу, на яку він намагався потрапити.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
