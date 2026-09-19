import Section from '../components/ui/Section.jsx';
import BookList from '../components/books/BookList.jsx';
import { books } from '../data/books.js';

export default function HomePage() {
  return (
    <Section id="catalog" title="Каталог книг">
      <p>Всього книг: {books.length}</p>
      <BookList books={books} />
    </Section>
  );
}