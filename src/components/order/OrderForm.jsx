import Form from 'react-bootstrap/Form';
import AppButton from '../ui/AppButton.jsx';

export default function OrderForm({ bookTitle, draft, onDraftChange, onReset }) {
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    onDraftChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()} className="p-4 border rounded shadow-sm bg-white h-100">
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Обрана книга:</Form.Label>
        <Form.Control type="text" value={bookTitle} readOnly disabled />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Кількість примірників:</Form.Label>
        <Form.Control type="number" name="quantity" min="1" value={draft.quantity} onChange={handleChange} />
      </Form.Group>
      
      <Form.Check type="checkbox" name="needsDelivery" label="Потрібна доставка" checked={draft.needsDelivery} onChange={handleChange} className="mb-3 fw-bold" />
      
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Адреса доставки:</Form.Label>
        <Form.Control as="textarea" rows={2} name="address" value={draft.address} onChange={handleChange} disabled={!draft.needsDelivery} />
      </Form.Group>
      
      <div className="d-flex gap-2">
        <AppButton variant="secondary" onClick={onReset}>Очистити поля</AppButton>
        <AppButton disabled>Оформити</AppButton>
      </div>
    </Form>
  );
}