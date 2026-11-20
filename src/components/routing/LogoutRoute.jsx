import { useEffect } from 'react';
import { Navigate } from 'react-router';
import useAuth from '../../hooks/useAuth.js';

// Вихід виконується через окремий маршрут: спочатку користувач залишає
// захищену сторінку, і лише потім сесія завершується. Інакше ProtectedRoute
// встигає перенаправити його на /login замість головної сторінки.
export default function LogoutRoute() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/" replace />;
}
