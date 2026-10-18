import { memo } from 'react';
import { Link } from 'react-router';

function OrderRow({ order, bookTitle }) {
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.customerName || 'Не вказано'}</td>
      <td>{bookTitle}</td>
      <td>{order.quantity}</td>
      <td>
        <Link to={`/orders/${order.id}`}>Переглянути</Link>
      </td>
    </tr>
  );
}

export default memo(OrderRow);