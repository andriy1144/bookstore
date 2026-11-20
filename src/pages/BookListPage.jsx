import { Link } from 'react-router';
import PageHeading from '../components/ui/PageHeading.jsx';
import Section from '../components/ui/Section.jsx';
import BookFilters from '../components/books/BookFilters.jsx';
import BookList from '../components/books/BookList.jsx';
import useBookFilters from '../hooks/useBookFilters.js';

export default function BookListPage({ books, selectedId, onSelect }) {
  const filters = useBookFilters(books);
  const { visibleBooks } = filters;

  const orderSearch = selectedId ? `?${new URLSearchParams({ bookId: selectedId })}` : '';

  return (
    <>
      <PageHeading title="Каталог книг" />
      <Section id="catalog" title="Пошук і вибір">
        <BookFilters
          query={filters.query}
          genre={filters.genre}
          genres={filters.genres}
          availableOnly={filters.availableOnly}
          onQueryChange={filters.setQuery}
          onGenreChange={filters.setGenre}
          onAvailableChange={filters.setAvailableOnly}
          onReset={filters.resetFilters}
        />
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <p className="text-muted mb-0">
            Показано книг: {visibleBooks.length} з {books.length}
          </p>
          <Link to={`/orders/new${orderSearch}`} className="btn btn-success">
            Підготувати замовлення
          </Link>
        </div>
        <BookList books={visibleBooks} selectedId={selectedId} onSelect={onSelect} />
      </Section>
    </>
  );
}
