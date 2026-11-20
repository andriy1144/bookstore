import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import OrdersLayout from './components/layout/OrdersLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import LogoutRoute from './components/routing/LogoutRoute.jsx';

import books from './data/books.json';
import useBookSelection from './hooks/useBookSelection.js';

// Розділення коду за маршрутами: кожна сторінка — окремий фрагмент бандла
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const BookListPage = lazy(() => import('./pages/BookListPage.jsx'));
const BookDetailsPage = lazy(() => import('./pages/BookDetailsPage.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const OrderCreatePage = lazy(() => import('./pages/OrderCreatePage.jsx'));
const OrderViewPage = lazy(() => import('./pages/OrderViewPage.jsx'));
const OrderEditPage = lazy(() => import('./pages/OrderEditPage.jsx'));
const ContactsPage = lazy(() => import('./pages/ContactsPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

const navLinks = [
  { to: '/', label: 'Головна', end: true },
  { to: '/books', label: 'Каталог' },
  { to: '/orders', label: 'Замовлення' },
  { to: '/contacts', label: 'Контакти' },
];

// Контейнер передає стан вибору книги з Context у презентаційну сторінку каталогу
function CatalogContainer() {
  const { selectedId, selectBook } = useBookSelection();
  return <BookListPage books={books} selectedId={selectedId} onSelect={selectBook} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout title="BookStore" links={navLinks} books={books} />}>
        <Route index element={<HomePage books={books} />} />

        <Route path="books">
          <Route index element={<CatalogContainer />} />
          <Route path=":bookId" element={<BookDetailsPage books={books} />} />
        </Route>

        <Route path="orders" element={<OrdersLayout />}>
          <Route index element={<OrdersPage books={books} />} />
          <Route path="new" element={<OrderCreatePage books={books} />} />
          <Route path=":orderId" element={<OrderViewPage books={books} />} />
          <Route path=":orderId/edit" element={<OrderEditPage books={books} />} />
        </Route>

        <Route path="contacts" element={<ContactsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="logout" element={<LogoutRoute />} />

        {/* Захищені маршрути: доступні лише після входу */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage books={books} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
