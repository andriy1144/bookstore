import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import OrderForm from '../components/order/OrderForm.jsx';
import OrderSummary from '../components/order/OrderSummary.jsx';
import useBookSelection from '../hooks/useBookSelection.js';
import useOrders from '../hooks/useOrders.js';
import NotFoundPage from './NotFoundPage.jsx';

const emptyDraft = { customerName: '', quantity: '1', needsDelivery: false, deliveryAddress: '' };

export default function OrderCreatePage({ books }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedId, clearSelection } = useBookSelection();
  const { createOrder } = useOrders();
  
  const bookId = searchParams.get('bookId');
  const [draft, setDraft] = useState({ ...emptyDraft, bookId: bookId || '' });
  const [errors, setErrors] = useState({});

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
  if (!book) return <NotFoundPage title="Помилка" message="Книгу не знайдено." />;

  function handleDraftChange(name, value) {
    setDraft(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined })); // Очищення помилки при зміні
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = createOrder(draft);
    if (!result.ok) {
      setErrors(result.errors); // Валідація не пройшла
      return;
    }
    clearSelection();
    navigate(`/orders/${result.record.id}`); // Перехід до перегляду
  }

  return (
    <Section id="order-create" title="Нове замовлення">
      <Row className="g-4 mb-4">
        <Col md={7}>
          <OrderForm 
            bookTitle={book.title} draft={draft} errors={errors}
            onDraftChange={handleDraftChange} 
            onReset={() => { setDraft({ ...emptyDraft, bookId }); setErrors({}); }} 
            onSubmit={handleSubmit}
          />
        </Col>
        <Col md={5}>
          <OrderSummary bookTitle={book.title} draft={draft} price={book.price} />
        </Col>
      </Row>
      <button className="btn btn-outline-secondary" onClick={() => navigate('/books')}>Скасувати</button>
    </Section>
  );
}