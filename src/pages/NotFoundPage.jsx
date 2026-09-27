import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';

export default function NotFoundPage({ 
  title = '404: Сторінку не знайдено', 
  message = 'Перевірте адресу або поверніться до каталогу.' 
}) {
  return (
    <div className="text-center mt-5">
      <PageHeading title={title} />
      <p className="text-muted">{message}</p>
      <Link to="/books" className="btn btn-primary me-2">Відкрити каталог</Link>
      <Link to="/" className="btn btn-outline-secondary">На головну</Link>
    </div>
  );
}