import { Link, useNavigate, useSearchParams } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import OrderPage from './OrderPage.jsx'; 
import useBookSelection from '../hooks/useBookSelection.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function OrderCreatePage({ books }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedId, clearSelection } = useBookSelection();
  
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    const lastSearch = selectedId ? `?bookId=${selectedId}` : '';
    return (
      <div className="text-center">
        <PageHeading title="Нове замовлення" />
        <p>Спочатку виберіть книгу з каталогу.</p>
        <Link to="/books" className="btn btn-primary me-2">До каталогу</Link>
        {lastSearch && <Link to={lastSearch} className="btn btn-success">Використати останній вибір</Link>}
      </div>
    );
  }

  const book = books.find((b) => b.id === bookId);
  if (!book) return <NotFoundPage title="Помилка" message="Книгу не знайдено в каталозі." />;

  function handleCancel() {
    clearSelection();
    navigate('/books', { replace: true });
  }

  return <OrderPage key={`new-${book.id}`} book={book} onClearSelection={handleCancel} />;
}