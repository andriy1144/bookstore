import { useSearchParams } from 'react-router';

export default function useBookFilters(books) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') ?? '';
  const availableOnly = searchParams.get('available') === '1';
  
  const normalizedQuery = query.trim().toLowerCase();
  const visibleBooks = books.filter((book) => {
    const matchesQuery = book.title.toLowerCase().includes(normalizedQuery);
    const matchesAvailable = !availableOnly || book.available;
    return matchesQuery && matchesAvailable;
  });

  function setQuery(value) {
    const next = new URLSearchParams(searchParams);
    if (value === '') next.delete('q');
    else next.set('q', value);
    setSearchParams(next, { replace: true });
  }

  function setAvailableOnly(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('available', '1');
    else next.delete('available');
    setSearchParams(next);
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.delete('available');
    setSearchParams(next);
  }

  return { query, setQuery, availableOnly, setAvailableOnly, visibleBooks, resetFilters };
}