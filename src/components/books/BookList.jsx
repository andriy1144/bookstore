import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BookCard from './BookCard.jsx';

export default function BookList({ books }) {
  if (books.length === 0) return <p className="text-muted">Книг поки немає.</p>;
  
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {books.map((book) => (
        <Col key={book.id}>
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  );
}