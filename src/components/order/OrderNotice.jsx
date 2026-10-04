import Alert from 'react-bootstrap/Alert';
import useOrders from '../../hooks/useOrders.js';

export default function OrderNotice() {
  const { notice, dismissNotice } = useOrders();

  if (!notice) return null;

  return (
    <Alert variant="success" onClose={dismissNotice} dismissible className="mb-4 shadow-sm">
      {notice}
    </Alert>
  );
}