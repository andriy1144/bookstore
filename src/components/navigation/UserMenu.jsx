import { Link, NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth.js';

export default function UserMenu() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="d-flex gap-2">
        <Link to="/login" className="btn btn-outline-primary btn-sm">
          Увійти
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
          Реєстрація
        </Link>
      </div>
    );
  }

  return (
    <NavLink to="/profile" className="btn btn-light btn-sm d-flex align-items-center gap-2">
      <span className="profile-avatar profile-avatar--small" aria-hidden="true">
        {user.name.charAt(0).toUpperCase()}
      </span>
      <span>{user.name}</span>
    </NavLink>
  );
}
