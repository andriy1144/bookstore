import Section from '../components/ui/Section.jsx';
import OrderPreview from '../components/order/OrderPreview.jsx';

export default function OrderPage({ book }) {
  return (
    <Section id="order" title="Кошик / Замовлення">
      {book ? (
        <OrderPreview bookTitle={book.title} />
      ) : (
        <p>Виберіть книгу з каталогу.</p>
      )}
    </Section>
  );
}