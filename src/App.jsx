import AppLayout from './components/layout/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import { books } from './data/books.js';

const links = [
  { href: '#catalog', label: 'Каталог' },
  { href: '#order', label: 'Оформлення замовлення' },
];

export default function App() {
  // Для демонстрації ЛР 1.2 жорстко передаємо першу книгу
  const demoBook = books[0]; 

  return (
    <AppLayout title="BookStore" links={links}>
      <HomePage />
      <OrderPage book={demoBook} />
    </AppLayout>
  );
}