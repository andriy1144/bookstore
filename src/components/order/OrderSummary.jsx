import Card from 'react-bootstrap/Card';

export default function OrderSummary({ bookTitle, draft, price }) {
  const total = price ? price * (Number(draft.quantity) || 1) : 0;

  return (
    <Card className="h-100 bg-light border-0 shadow-sm">
      <Card.Body>
        <Card.Title>Підсумок замовлення</Card.Title>
        <hr />
        <dl>
          <dt>Книга:</dt> <dd>{bookTitle}</dd>
          <dt>Кількість:</dt> <dd>{draft.quantity} шт.</dd>
          <dt>Доставка:</dt> <dd>{draft.needsDelivery ? 'Потрібна' : 'Самовивіз'}</dd>
          {draft.needsDelivery && <><dt>Адреса:</dt> <dd>{draft.address || 'Не вказано'}</dd></>}
        </dl>
        <h4 className="text-danger mt-4">Разом: {total} ₴</h4>
      </Card.Body>
    </Card>
  );
}