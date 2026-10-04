import { NavLink, Outlet } from 'react-router';
import Nav from 'react-bootstrap/Nav';
import OrderNotice from '../order/OrderNotice.jsx';

export default function OrdersLayout() {
  return (
    <>
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link as={NavLink} to="." end>Список замовлень</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="new">Нове замовлення</Nav.Link>
        </Nav.Item>
      </Nav>
      
      <OrderNotice />
      
      <Outlet />
    </>
  );
}