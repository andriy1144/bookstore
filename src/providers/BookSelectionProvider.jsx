import { useState, useCallback, useMemo } from 'react';
import { BookSelectionContext } from '../context/BookSelectionContext.js';

export default function BookSelectionProvider({ books, children }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedId) ?? null,
    [books, selectedId]
  );

  const selectBook = useCallback(
    (id) => {
      if (books.some((b) => b.id === id)) {
        setSelectedId(id);
      }
    },
    [books]
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      selectedBook,
      selectBook,
      clearSelection,
    }),
    [selectedId, selectedBook, selectBook, clearSelection]
  );

  return (
    <BookSelectionContext.Provider value={value}>
      {children}
    </BookSelectionContext.Provider>
  );
}