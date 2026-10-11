import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import PageHeading from '../components/ui/PageHeading.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useOrders from '../hooks/useOrders.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function OrderViewPage({ books }) {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, isLoading, deleteOrder } = useOrders();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Завантаження даних замовлення...</p>
      </div>
    );
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) return <NotFoundPage title="Замовлення не знайдено" />;

  const book = books.find((b) => b.id === order.bookId);
  const total = book ? book.price * order.quantity : 0;

  async function handleDelete() {
    if (window.confirm(`Дійсно скасувати замовлення ${order.id}?`)) {
      setIsDeleting(true);
      setDeleteError(null);
      
      const result = await deleteOrder(order.id);
      
      setIsDeleting(false);
      if (result.ok) {
        navigate('/orders');
      } else {
        setDeleteError(result.message || 'Не вдалося видалити замовлення.');
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm position-relative">
      {isDeleting && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 10 }}>
          <Spinner animation="border" variant="danger" />
        </div>
      )}

      <PageHeading title={`Замовлення ${order.id}`} />
      
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}

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
        <Link to={`/orders/${order.id}/edit`} className={`btn btn-primary ${isDeleting ? 'disabled' : ''}`}>Редагувати</Link>
        <AppButton variant="secondary" onClick={handleDelete} disabled={isDeleting}>Скасувати (Видалити)</AppButton>
        <Link to="/orders" className="btn btn-outline-secondary ms-auto">Всі замовлення</Link>
      </div>
    </div>
  );
}