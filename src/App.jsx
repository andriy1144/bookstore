import { Routes, Route } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import OrdersLayout from './components/layout/OrdersLayout.jsx';

import HomePage from './pages/HomePage.jsx';
import BookListPage from './pages/BookListPage.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderCreatePage from './pages/OrderCreatePage.jsx';
import OrderEditPage from './pages/OrderEditPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import { books } from './data/books.js';
import { orders } from './data/orders.js';

import useBookSelection from './hooks/useBookSelection.js';

const navLinks = [
  { to: '/', label: 'Головна', end: true },
  { to: '/books', label: 'Каталог' },
  { to: '/orders', label: 'Замовлення' },
];

// Проксі-компонент для передачі Context в BookListPage
function CatalogContainer() {
  const { selectedId, selectBook } = useBookSelection();
  return <BookListPage books={books} selectedId={selectedId} onSelect={selectBook} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout title="BookStore" links={navLinks} books={books} />}>
        
        {/* Головна сторінка */}
        <Route index element={<HomePage />} />
        
        {/* Розділ каталогу книг */}
        <Route path="books">
          <Route index element={<CatalogContainer />} />
          <Route path=":bookId" element={<BookDetailsPage books={books} />} />
        </Route>

        {/* Розділ замовлень із вкладеним компонуванням (OrdersLayout) */}
        <Route path="orders" element={<OrdersLayout />}>
          <Route index element={<OrdersPage orders={orders} books={books} />} />
          <Route path="new" element={<OrderCreatePage books={books} />} />
          <Route path=":orderId/edit" element={<OrderEditPage orders={orders} books={books} />} />
        </Route>

        {/* Обробка невідомих маршрутів (Сторінка 404) */}
        <Route path="*" element={<NotFoundPage />} />
        
      </Route>
    </Routes>
  );
}