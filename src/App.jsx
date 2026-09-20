import AppLayout from './components/layout/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import BookSelectionProvider from './providers/BookSelectionProvider.jsx';
import useBookSelection from './hooks/useBookSelection.js';
import { books } from './data/books.js';

const links = [
  { href: '#catalog', label: 'Каталог' },
  { href: '#order', label: 'Оформлення замовлення' },
];

// Проміжний компонент для читання контексту
function AppContent() {
  const { selectedId, selectedBook, selectBook, clearSelection } = useBookSelection();
  return (
    <>
      <HomePage books={books} selectedId={selectedId} onSelect={selectBook} />
      {/* key гарантує очищення чернетки при зміні обраної книги */}
      <OrderPage key={selectedId ?? 'empty'} book={selectedBook} onClearSelection={clearSelection} />
    </>
  );
}

export default function App() {
  return (
    <AppLayout title="BookStore" links={links}>
      <BookSelectionProvider books={books}>
        <AppContent />
      </BookSelectionProvider>
    </AppLayout>
  );
}