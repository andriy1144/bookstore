import { Link, useSearchParams } from 'react-router';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import PageHeading from '../components/ui/PageHeading.jsx';
import useOrders from '../hooks/useOrders.js';

export default function OrdersPage({ books }) {
  const { orders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const sortBy = searchParams.get('sort') ?? 'id';

  // Безпечна фільтрація: перевіряємо чи customerName існує
  let visibleOrders = orders.filter((o) => {
    const name = o.customerName || '';
    return name.toLowerCase().includes(query.trim().toLowerCase());
  });

  visibleOrders = [...visibleOrders].sort((a, b) => {
    if (sortBy === 'qty') return b.quantity - a.quantity;
    return a.id.localeCompare(b.id);
  });

  function handleQuery(e) {
    const next = new URLSearchParams(searchParams);
    if (e.target.value) next.set('q', e.target.value); else next.delete('q');
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
      <p className="text-muted">Дані зберігаються в локальній пам'яті застосунку (до перезавантаження).</p>
      
      {orders.length > 0 && (
        <div className="d-flex gap-3 mb-4 bg-white p-3 rounded shadow-sm">
          <Form.Control type="search" placeholder="Пошук за ім'ям..." value={query} onChange={handleQuery} style={{ maxWidth: '300px' }} />
          <Form.Select value={sortBy} onChange={handleSort} style={{ maxWidth: '200px' }}>
            <option value="id">За ідентифікатором</option>
            <option value="qty">За кількістю (спадання)</option>
          </Form.Select>
        </div>
      )}

      {visibleOrders.length === 0 ? (
        <div className="p-4 border rounded bg-white text-center">
          <p>{orders.length === 0 ? 'Замовлень ще немає.' : 'За вашим запитом нічого не знайдено.'}</p>
          {orders.length === 0 && <Link to="/books" className="btn btn-primary">Перейти до каталогу</Link>}
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
              {visibleOrders.map((order) => {
                const book = books.find((b) => b.id === order.bookId);
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName || 'Не вказано'}</td>
                    <td>{book?.title ?? 'Невідома книга'}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <Link to={`/orders/${order.id}`}>Переглянути</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}