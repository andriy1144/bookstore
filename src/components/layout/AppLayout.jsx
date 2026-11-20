import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Container from 'react-bootstrap/Container';
import SiteHeader from './SiteHeader.jsx';
import PageLoader from '../ui/PageLoader.jsx';
import AuthProvider from '../../providers/AuthProvider.jsx';
import BookSelectionProvider from '../../providers/BookSelectionProvider.jsx';
import OrdersProvider from '../../providers/OrdersProvider.jsx';

export default function AppLayout({ title, links, books }) {
  return (
    <AuthProvider>
      <div className="bg-light min-vh-100 pb-5">
        <SiteHeader title={title} links={links} />
        <Container as="main" id="main-content" className="mt-4">
          <BookSelectionProvider books={books}>
            <OrdersProvider books={books}>
              {/* Код сторінок завантажується ліниво (React.lazy) */}
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </OrdersProvider>
          </BookSelectionProvider>
        </Container>
        <footer className="text-center mt-5 text-muted">
          <small>Навчальний проєкт. Книжковий магазин «BookStore», 2026.</small>
        </footer>
      </div>
    </AuthProvider>
  );
}
