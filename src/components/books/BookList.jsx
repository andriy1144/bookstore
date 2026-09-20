import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BookCard from './BookCard.jsx';

// 1. Додаємо сюди selectedId та onSelect
export default function BookList({ books, selectedId, onSelect }) {
  if (books.length === 0) return <p className="text-muted">Книг поки немає.</p>;
  
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {books.map((book) => (
        <Col key={book.id}>
          {/* 2. Прокидаємо ці пропси нижче у картку */}
          <BookCard 
            book={book} 
            selected={book.id === selectedId} 
            onSelect={onSelect} 
          />
        </Col>
      ))}
    </Row>
  );
}