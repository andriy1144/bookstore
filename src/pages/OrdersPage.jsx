import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import PageHeading from '../components/ui/PageHeading.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import OrderRow from '../components/order/OrderRow.jsx';
import useOrders from '../hooks/useOrders.js';
import { selectVisibleOrders } from '../domain/orderFilters.js';

export default function OrdersPage({ books }) {
  const { orders, isLoading, error, fetchOrders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const sortBy = searchParams.get('sort') ?? 'id';

  // Мемоізація словника книг для швидкого доступу за ID без повторного .find() у кожному рядку
  const bookTitleById = useMemo(() => {
    const map = new Map();
    books.forEach((book) => map.set(book.id, book.title));
    return map;
  }, [books]);

  // Мемоізація відфільтрованого та відсортованого списку замовлень
  const visibleOrders = useMemo(
    () => selectVisibleOrders(orders, { query, sortBy }),
    [orders, query, sortBy]
  );

  function handleQuery(e) {
    const next = new URLSearchParams(searchParams);
    if (e.target.value) next.set('q', e.target.value);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  }

  function handleSort(e) {
    const next = new URLSearchParams(searchParams);
    next.set('sort', e.target.value);
    setSearchParams(next);
  }

  return (
    <>
      <PageHeading title="Мої замовлення" />
      <p className="text-muted">Дані завантажуються з імітаційного API.</p>

      {/* Стан: Помилка мережі */}
      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <AppButton variant="secondary" onClick={fetchOrders}>
            Спробувати ще раз
          </AppButton>
        </Alert>
      )}

      {/* Стан: Завантаження */}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Завантаження замовлень...</p>
        </div>
      ) : (
        !error && (
          <>
            {orders.length > 0 && (
              <div className="d-flex gap-3 mb-4 bg-white p-3 rounded shadow-sm">
                <Form.Control
                  type="search"
                  placeholder="Пошук за ім'ям..."
                  aria-label="Пошук за ім'ям"
                  value={query}
                  onChange={handleQuery}
                  style={{ maxWidth: '300px' }}
                />
                <Form.Select
                  aria-label="Сортування замовлень"
                  value={sortBy}
                  onChange={handleSort}
                  style={{ maxWidth: '200px' }}
                >
                  <option value="id">За ідентифікатором</option>
                  <option value="qty">За кількістю (спадання)</option>
                </Form.Select>
              </div>
            )}

            {visibleOrders.length === 0 ? (
              <div className="p-4 border rounded bg-white text-center shadow-sm">
                <p>
                  {orders.length === 0
                    ? 'Замовлень ще немає.'
                    : 'За вашим запитом нічого не знайдено.'}
                </p>
                {orders.length === 0 && (
                  <Link to="/books" className="btn btn-primary">
                    Перейти до каталогу
                  </Link>
                )}
              </div>
            ) : (
              <div className="table-responsive bg-white p-3 rounded shadow-sm border">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Замовник</th>
                      <th>Книга</th>
                      <th>К-сть</th>
                      <th>Дія</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        bookTitle={bookTitleById.get(order.bookId) ?? 'Невідома книга'}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )
      )}
    </>
  );
}