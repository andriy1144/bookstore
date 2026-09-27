import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import MainNav from '../navigation/MainNav.jsx';

export default function SiteHeader({ title, links }) {
  return (
    <header className="bg-white shadow-sm border-bottom py-3">
      <Container className="d-flex flex-wrap align-items-center justify-content-between">
        {/* Замінили <span> на <Link> */}
        <Link to="/" className="text-decoration-none h4 mb-0 text-primary fw-bold">
          {title}
        </Link>
        <MainNav links={links} />
      </Container>
    </header>
  );
}