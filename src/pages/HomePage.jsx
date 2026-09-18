import BookCard from '../components/BookCard.jsx';
import { books } from '../data/books.js';

export default function HomePage() {
  return (
    <>
      <section id="about" aria-labelledby="about-title">
        <h1 id="about-title">BookStore</h1>
        <p>Ваш улюблений онлайн-магазин технічної та художньої літератури.</p>
        <p>Обирайте найкращі книги для свого розвитку та відпочинку.</p>
      </section>

      <section id="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Каталог книг</h2>
        <p>Книг у каталозі: {books.length}</p>
        
        {books.length === 0 ? (
          <p>Книг поки немає.</p>
        ) : (
          <ul className="books-grid">
            {books.map((book) => (
              <li key={book.id}>
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}