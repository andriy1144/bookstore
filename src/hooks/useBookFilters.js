import { useState } from 'react';

export default function useBookFilters(books) {
  const [query, setQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  
  const visibleBooks = books.filter((book) => {
    const matchesQuery = book.title.toLowerCase().includes(normalizedQuery);
    const matchesAvailable = !availableOnly || book.available;
    return matchesQuery && matchesAvailable;
  });

  function resetFilters() {
    setQuery('');
    setAvailableOnly(false);
  }

  return { query, setQuery, availableOnly, setAvailableOnly, visibleBooks, resetFilters };
}