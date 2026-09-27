import { NavLink } from 'react-router';
import Nav from 'react-bootstrap/Nav';

export default function MainNav({ links }) {
  return (
    <Nav as="nav" aria-label="Основна навігація">
      {links.map((link) => (
        <Nav.Item key={link.to}>
          <Nav.Link as={NavLink} to={link.to} end={link.end} className="fw-semibold text-dark">
            {link.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}