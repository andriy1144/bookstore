import { useParams, useNavigate, Link } from 'react-router';
import Card from 'react-bootstrap/Card';
import PageHeading from '../components/ui/PageHeading.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useOrders from '../hooks/useOrders.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function OrderViewPage({ books }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, deleteOrder } = useOrders();

  const order = orders.find((o) => o.id === orderId);
  if (!order) return <NotFoundPage title="Замовлення не знайдено" />;

  const book = books.find((b) => b.id === order.bookId);
  const total = book ? book.price * order.quantity : 0;

  function handleDelete() {
    if (window.confirm(`Дійсно скасувати замовлення ${order.id}?`)) {
      deleteOrder(order.id);
      navigate('/orders');
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <PageHeading title={`Замовлення ${order.id}`} />
      
      <Card className="mb-4">
        <Card.Body>
          <dl className="row mb-0">
            <dt className="col-sm-3">Замовник</dt>
            <dd className="col-sm-9">{order.customerName}</dd>
            
            <dt className="col-sm-3">Книга</dt>
            <dd className="col-sm-9">{book?.title ?? 'Невідома книга'}</dd>
            
            <dt className="col-sm-3">Кількість</dt>
            <dd className="col-sm-9">{order.quantity} шт.</dd>
            
            <dt className="col-sm-3">Доставка</dt>
            <dd className="col-sm-9">{order.needsDelivery ? order.deliveryAddress : 'Самовивіз'}</dd>
            
            <dt className="col-sm-3">Сума</dt>
            <dd className="col-sm-9 text-danger fw-bold">{total} ₴</dd>
          </dl>
        </Card.Body>
      </Card>

      <div className="d-flex gap-3">
        <Link to={`/orders/${order.id}/edit`} className="btn btn-primary">Редагувати</Link>
        <AppButton variant="secondary" onClick={handleDelete}>Скасувати (Видалити)</AppButton>
        <Link to="/orders" className="btn btn-outline-secondary ms-auto">Всі замовлення</Link>
      </div>
    </div>
  );
}