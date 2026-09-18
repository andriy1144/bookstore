export default function BookCard({ book }) {
  const status = book.available ? 'В наявності' : 'Очікується';
  
  return (
    <article className="book-card">
      <h3>{book.title}</h3>
      <p className="author"><strong>Автор:</strong> {book.author}</p>
      <p className="category"><strong>Жанр:</strong> {book.genre}</p>
      <p className="price"><strong>Ціна:</strong> {book.price} грн</p>
      <p>{book.description}</p>
      <p className={book.available ? 'status available' : 'status'}>
        {status}
      </p>
    </article>
  );
}