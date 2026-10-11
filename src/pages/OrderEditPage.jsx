import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import OrderForm from '../components/order/OrderForm.jsx';
import OrderSummary from '../components/order/OrderSummary.jsx';
import useOrders from '../hooks/useOrders.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function OrderEditPage({ books }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, isLoading, updateOrder } = useOrders();
  
  const order = orders.find((o) => o.id === orderId);
  const book = order ? books.find((b) => b.id === order.bookId) : null;
  
  const [draft, setDraft] = useState({
    bookId: order?.bookId ?? '',
    customerName: order?.customerName ?? '',
    quantity: String(order?.quantity ?? '1'),
    needsDelivery: order?.needsDelivery ?? false,
    deliveryAddress: order?.deliveryAddress ?? '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Стан завантаження з API
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Завантаження даних для редагування...</p>
      </div>
    );
  }

  if (!order) return <NotFoundPage title="Замовлення не знайдено" />;
  if (!book) return <NotFoundPage title="Книгу не знайдено" />;

  function handleDraftChange(name, value) {
    setDraft((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    const result = await updateOrder(order.id, draft);
    
    setIsSubmitting(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    navigate(`/orders/${order.id}`);
  }

  return (
    <>
      <PageHeading title={`Редагування: ${order.id}`} />
      <Section id="order-edit" title="Поля та підсумок">
        <Row className="g-4 mb-4">
          <Col md={7}>
            <OrderForm 
              bookTitle={book.title} draft={draft} errors={errors} isSubmitting={isSubmitting}
              onDraftChange={handleDraftChange} 
              onReset={() => navigate(`/orders/${order.id}`)} 
              onSubmit={handleSubmit}
            />
          </Col>
          <Col md={5}>
            <OrderSummary bookTitle={book.title} draft={draft} price={book.price} />
          </Col>
        </Row>
      </Section>
    </>
  );
}