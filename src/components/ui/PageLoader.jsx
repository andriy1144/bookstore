import Spinner from 'react-bootstrap/Spinner';

// Запасний вміст для Suspense, поки завантажується код сторінки.
export default function PageLoader({ message = 'Завантаження сторінки...' }) {
  return (
    <div className="text-center py-5" role="status">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
}
