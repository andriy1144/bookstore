import Section from '../components/ui/Section.jsx';
import BookList from '../components/books/BookList.jsx';
import BookFilters from '../components/books/BookFilters.jsx';
import useBookFilters from '../hooks/useBookFilters.js';

export default function HomePage({ books, selectedId, onSelect }) {
  const { query, setQuery, availableOnly, setAvailableOnly, visibleBooks, resetFilters } = useBookFilters(books);

  return (
    <Section id="catalog" title="Каталог книг">
      <BookFilters query={query} availableOnly={availableOnly} onQueryChange={setQuery} onAvailableChange={setAvailableOnly} onReset={resetFilters} />
      <p className="text-muted">Знайдено книг: {visibleBooks.length}</p>
      <BookList books={visibleBooks} selectedId={selectedId} onSelect={onSelect} />
    </Section>
  );
}