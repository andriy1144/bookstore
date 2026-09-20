import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Section from '../components/ui/Section.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import OrderForm from '../components/order/OrderForm.jsx';
import OrderSummary from '../components/order/OrderSummary.jsx';

const emptyDraft = { quantity: '1', needsDelivery: false, address: '' };

export default function OrderPage({ book, onClearSelection }) {
  const [draft, setDraft] = useState(emptyDraft);

  // Ефект: зміна заголовка вкладки
  useEffect(() => {
    const prevTitle = document.title;
    if (book) document.title = `Замовлення: ${book.title} | BookStore`;
    return () => { document.title = prevTitle; };
  }, [book]);

  function handleDraftChange(name, value) {
    setDraft(prev => ({ ...prev, [name]: value }));
  }

  if (!book) return (
    <Section id="order" title="Оформлення замовлення">
      <p className="text-muted">Будь ласка, оберіть книгу з каталогу.</p>
    </Section>
  );

  return (
    <Section id="order" title="Оформлення замовлення">
      <Row className="g-4 mb-4">
        <Col md={7}>
          <OrderForm bookTitle={book.title} draft={draft} onDraftChange={handleDraftChange} onReset={() => setDraft(emptyDraft)} />
        </Col>
        <Col md={5}>
          <OrderSummary bookTitle={book.title} draft={draft} price={book.price} />
        </Col>
      </Row>
      <AppButton variant="secondary" onClick={onClearSelection}>Скасувати вибір</AppButton>
    </Section>
  );
}