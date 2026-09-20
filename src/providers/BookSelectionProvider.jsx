import { useState } from 'react';
import { BookSelectionContext } from '../context/BookSelectionContext.js';

export default function BookSelectionProvider({ books, children }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedBook = books.find(b => b.id === selectedId);

  function selectBook(id) { setSelectedId(id); }
  function clearSelection() { setSelectedId(null); }

  return (
    <BookSelectionContext.Provider value={{ selectedId, selectedBook, selectBook, clearSelection }}>
      {children}
    </BookSelectionContext.Provider>
  );
}