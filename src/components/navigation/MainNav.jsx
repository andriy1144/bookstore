import Nav from 'react-bootstrap/Nav';

export default function MainNav({ links }) {
  return (
    <Nav as="nav" aria-label="Основна навігація">
      {links.map((link) => (
        <Nav.Item key={link.href}>
          <Nav.Link href={link.href} className="fw-semibold text-dark">
            {link.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}