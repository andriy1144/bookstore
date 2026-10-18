import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

export default function useBookFilters(books) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const availableOnly = searchParams.get('available') === '1';

  const visibleBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesQuery = book.title.toLowerCase().includes(normalizedQuery);
      const matchesAvailable = !availableOnly || book.available;
      return matchesQuery && matchesAvailable;
    });
  }, [books, query, availableOnly]);

  const setQuery = useCallback(
    (value) => {
      const next = new URLSearchParams(searchParams);
      if (value === '') next.delete('q');
      else next.set('q', value);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const setAvailableOnly = useCallback(
    (value) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set('available', '1');
      else next.delete('available');
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.delete('available');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  return {
    query,
    setQuery,
    availableOnly,
    setAvailableOnly,
    visibleBooks,
    resetFilters,
  };
}