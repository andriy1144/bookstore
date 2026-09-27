import { Link } from 'react-router';
import Table from 'react-bootstrap/Table';
import PageHeading from '../components/ui/PageHeading.jsx';

export default function OrdersPage({ orders, books }) {
  return (
    <>
      <PageHeading title="Мої замовлення" />
      <p className="text-muted">Нижче наведено локальні демонстраційні записи.</p>
      
      {orders.length === 0 ? (
        <div className="p-4 border rounded bg-white text-center">
          <p>Замовлень ще немає.</p>
          <Link to="new" className="btn btn-primary">Оформити нове замовлення</Link>
        </div>
      ) : (
        <div className="table-responsive bg-white p-3 rounded shadow-sm border">
          <Table hover>
            <thead>
              <tr>
                <th>Обладнання (Книга)</th>
                <th>Кількість</th>
                <th>Адреса доставки</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const book = books.find((b) => b.id === order.bookId);
                return (
                  <tr key={order.id}>
                    <td>{book?.title ?? 'Книга відсутня в каталозі'}</td>
                    <td>{order.quantity} шт.</td>
                    <td>{order.deliveryAddress}</td>
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