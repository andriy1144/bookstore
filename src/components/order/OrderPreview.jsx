import Form from 'react-bootstrap/Form';
import AppButton from '../ui/AppButton.jsx';

export default function OrderPreview({ bookTitle }) {
  return (
    <Form 
      onSubmit={(e) => e.preventDefault()} 
      className="p-4 border rounded shadow-sm bg-white" 
      style={{ maxWidth: '500px' }}
    >
      <h4 className="mb-4">Дані для замовлення</h4>
      
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Обрана книга:</Form.Label>
        <Form.Control type="text" value={bookTitle} readOnly disabled />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Кількість примірників:</Form.Label>
        <Form.Control type="number" defaultValue="1" min="1" />
      </Form.Group>
      
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Адреса доставки:</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="Місто, відділення пошти..." />
      </Form.Group>
      
      <div className="d-grid">
        <AppButton disabled>Підтвердити замовлення (недоступно)</AppButton>
      </div>
    </Form>
  );
}