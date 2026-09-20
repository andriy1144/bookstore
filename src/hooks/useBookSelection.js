import { useContext } from 'react';
import { BookSelectionContext } from '../context/BookSelectionContext.js';

export default function useBookSelection() {
  const context = useContext(BookSelectionContext);
  if (context === null) {
    throw new Error('useBookSelection must be used within BookSelectionProvider');
  }
  return context;
}