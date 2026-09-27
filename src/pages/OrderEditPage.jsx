import { useNavigate, useParams } from 'react-router';
import OrderPage from './OrderPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function OrderEditPage({ orders, books }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const order = orders.find((entry) => entry.id === orderId);
  if (!order) return <NotFoundPage title="Замовлення не знайдено" />;

  const book = books.find((entry) => entry.id === order.bookId);
  if (!book) return <NotFoundPage title="Книгу не знайдено" />;

  return (
    <OrderPage
      key={`edit-${order.id}`}
      book={book}
      initialDraft={{
        quantity: String(order.quantity),
        needsDelivery: order.deliveryAddress !== 'Самовивіз',
        address: order.deliveryAddress === 'Самовивіз' ? '' : order.deliveryAddress,
      }}
      onClearSelection={() => navigate('/orders')}
    />
  );
}