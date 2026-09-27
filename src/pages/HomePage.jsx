import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';

export default function HomePage() {
  return (
    <div className="text-center mt-5">
      <PageHeading title="Ласкаво просимо до BookStore" />
      <p className="lead">Найкращі книги для вашого розвитку та відпочинку.</p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/books" className="btn btn-primary btn-lg">Перейти до каталогу</Link>
        <Link to="/orders" className="btn btn-outline-secondary btn-lg">Мої замовлення</Link>
      </div>
    </div>
  );
}