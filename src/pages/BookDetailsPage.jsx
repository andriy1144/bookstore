import { Link, useNavigate, useParams } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import AvailabilityBadge from '../components/books/AvailabilityBadge.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useBookSelection from '../hooks/useBookSelection.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function BookDetailsPage({ books }) {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { selectBook } = useBookSelection();
  
  const book = books.find((b) => b.id === bookId);

  if (!book) return <NotFoundPage title="Книгу не знайдено" />;

  function handleOrder() {
    selectBook(book.id);
    navigate(`/orders/new?bookId=${book.id}`);
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <PageHeading title={book.title} />
      <h5 className="text-muted mb-4">{book.author}</h5>
      <p><strong>Жанр:</strong> {book.genre}</p>
      <p>{book.description}</p>
      <AvailabilityBadge available={book.available} />
      <h4 className="text-danger my-3">{book.price} ₴</h4>
      
      <div className="d-flex gap-3 mt-4">
        <AppButton onClick={handleOrder} disabled={!book.available}>Замовити книгу</AppButton>
        <Link to="/books" className="btn btn-outline-secondary">До каталогу</Link>
      </div>
    </div>
  );
}