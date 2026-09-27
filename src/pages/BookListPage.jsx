import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import BookFilters from '../components/books/BookFilters.jsx';
import BookList from '../components/books/BookList.jsx';
import useBookFilters from '../hooks/useBookFilters.js';

export default function BookListPage({ books, selectedId, onSelect }) {
  const { query, setQuery, availableOnly, setAvailableOnly, visibleBooks, resetFilters } = useBookFilters(books);

  const orderSearch = selectedId ? `?${new URLSearchParams({ bookId: selectedId })}` : '';

  return (
    <>
      <PageHeading title="Каталог книг" />
      <Section id="catalog" title="Пошук і вибір">
        <BookFilters query={query} availableOnly={availableOnly} onQueryChange={setQuery} onAvailableChange={setAvailableOnly} onReset={resetFilters} />
        <p className="text-muted">Показано книг: {visibleBooks.length}</p>
        <BookList books={visibleBooks} selectedId={selectedId} onSelect={onSelect} />
        
        <div className="mt-4">
          <Link to={`/orders/new${orderSearch}`} className="btn btn-success">
            Підготувати замовлення
          </Link>
        </div>
      </Section>
    </>
  );
}