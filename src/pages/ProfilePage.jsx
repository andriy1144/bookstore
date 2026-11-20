import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import PageHeading from '../components/ui/PageHeading.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useAuth from '../hooks/useAuth.js';
import useOrders from '../hooks/useOrders.js';

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'long' });

export default function ProfilePage({ books }) {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();

  const myOrders = useMemo(() => orders.filter((o) => o.userId === user.id), [orders, user.id]);

  const bookById = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const totalSpent = myOrders.reduce(
    (sum, order) => sum + (bookById.get(order.bookId)?.price ?? 0) * order.quantity,
    0
  );

  function handleLogout() {
    navigate('/logout');
  }

  return (
    <>
      <PageHeading title="Особистий кабінет" />
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="profile-avatar mb-3" aria-hidden="true">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <Card.Title>{user.name}</Card.Title>
              <dl className="mb-4">
                <dt>Електронна пошта</dt>
                <dd>{user.email}</dd>
                <dt>Дата реєстрації</dt>
                <dd>{user.createdAt ? dateFormatter.format(new Date(user.createdAt)) : '—'}</dd>
                <dt>Замовлень / сума</dt>
                <dd>
                  {myOrders.length} / {totalSpent} ₴
                </dd>
              </dl>
              <AppButton variant="secondary" onClick={handleLogout}>
                Вийти з облікового запису
              </AppButton>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4 mb-3">
                Мої замовлення
              </Card.Title>
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : myOrders.length === 0 ? (
                <p className="text-muted">
                  Ви ще не оформили жодного замовлення. <Link to="/books">Перейти до каталогу</Link>
                </p>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Книга</th>
                      <th>К-сть</th>
                      <th>Доставка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <Link to={`/orders/${order.id}`}>{order.id}</Link>
                        </td>
                        <td>{bookById.get(order.bookId)?.title ?? 'Невідома книга'}</td>
                        <td>{order.quantity}</td>
                        <td>{order.needsDelivery ? order.deliveryAddress : 'Самовивіз'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
