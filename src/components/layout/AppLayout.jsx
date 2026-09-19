import Container from 'react-bootstrap/Container';
import SiteHeader from './SiteHeader.jsx';

export default function AppLayout({ title, links, children }) {
  return (
    <div className="bg-light min-vh-100 pb-5">
      <SiteHeader title={title} links={links} />
      
      <Container as="main" id="main-content" className="mt-4">
        {children}
      </Container>
      
      <footer className="text-center mt-5 text-muted">
        <small>Навчальний проєкт. Книжковий магазин "BookStore".</small>
      </footer>
    </div>
  );
}