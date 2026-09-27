import { Outlet } from 'react-router';
import Container from 'react-bootstrap/Container';
import SiteHeader from './SiteHeader.jsx';
import BookSelectionProvider from '../../providers/BookSelectionProvider.jsx';

export default function AppLayout({ title, links, books }) {
  return (
    <div className="bg-light min-vh-100 pb-5">
      <SiteHeader title={title} links={links} />
      <Container as="main" id="main-content" className="mt-4">
        <BookSelectionProvider books={books}>
          <Outlet />
        </BookSelectionProvider>
      </Container>
      <footer className="text-center mt-5 text-muted">
        <small>Навчальний проєкт. Книжковий магазин "BookStore".</small>
      </footer>
    </div>
  );
}