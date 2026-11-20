import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

// Стан фільтрів зберігається в параметрах URL (?q=...&genre=...&available=1),
// тому відфільтрований каталог можна додати в закладки або надіслати посиланням.
export default function useBookFilters(books) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const genre = searchParams.get('genre') ?? '';
  const availableOnly = searchParams.get('available') === '1';

  const genres = useMemo(
    () => [...new Set(books.map((book) => book.genre))].sort((a, b) => a.localeCompare(b, 'uk')),
    [books]
  );

  const visibleBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesQuery =
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery);
      const matchesGenre = genre === '' || book.genre === genre;
      const matchesAvailable = !availableOnly || book.available;
      return matchesQuery && matchesGenre && matchesAvailable;
    });
  }, [books, query, genre, availableOnly]);

  const updateParam = useCallback(
    (key, value, options) => {
      const next = new URLSearchParams(searchParams);
      if (value === '' || value === false) next.delete(key);
      else next.set(key, value === true ? '1' : value);
      setSearchParams(next, options);
    },
    [searchParams, setSearchParams]
  );

  const setQuery = useCallback((value) => updateParam('q', value, { replace: true }), [updateParam]);
  const setGenre = useCallback((value) => updateParam('genre', value), [updateParam]);
  const setAvailableOnly = useCallback((value) => updateParam('available', value), [updateParam]);

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    ['q', 'genre', 'available'].forEach((key) => next.delete(key));
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  return {
    query,
    setQuery,
    genre,
    setGenre,
    genres,
    availableOnly,
    setAvailableOnly,
    visibleBooks,
    resetFilters,
  };
}
