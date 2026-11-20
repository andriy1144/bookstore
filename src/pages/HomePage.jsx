import { Link } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import PageHeading from '../components/ui/PageHeading.jsx';
import BookCover from '../components/books/BookCover.jsx';

const features = [
  { title: 'Зручний каталог', text: 'Пошук за назвою чи автором, фільтр за жанром і наявністю.' },
  { title: 'Швидке замовлення', text: 'Оформлення у кілька кроків із перевіркою даних і підсумком вартості.' },
  { title: 'Особистий кабінет', text: 'Історія власних замовлень і контактні дані в одному місці.' },
];

export default function HomePage({ books }) {
  const featured = books.filter((book) => book.available).slice(0, 4);

  return (
    <>
      <div className="text-center py-5 mb-4 bg-white rounded shadow-sm">
        <PageHeading title="Ласкаво просимо до BookStore" />
        <p className="lead px-3">Найкращі книги для вашого розвитку та відпочинку.</p>
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <Link to="/books" className="btn btn-primary btn-lg">
            Перейти до каталогу
          </Link>
          <Link to="/orders" className="btn btn-outline-secondary btn-lg">
            Мої замовлення
          </Link>
        </div>
      </div>

      <Row xs={1} md={3} className="g-4 mb-5">
        {features.map((feature) => (
          <Col key={feature.title}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  {feature.title}
                </Card.Title>
                <Card.Text className="text-muted">{feature.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 className="h4 mb-3">Рекомендуємо</h2>
      <Row xs={2} md={4} className="g-4">
        {featured.map((book) => (
          <Col key={book.id}>
            <Link to={`/books/${book.id}`} className="text-decoration-none">
              <BookCover book={book} size="sm" />
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}
