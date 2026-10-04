import Form from 'react-bootstrap/Form';
import AppButton from '../ui/AppButton.jsx';
import FormField from '../ui/FormField.jsx';

export default function OrderForm({ bookTitle, draft, errors, onDraftChange, onReset, onSubmit }) {
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    onDraftChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <Form onSubmit={onSubmit} noValidate className="p-4 border rounded shadow-sm bg-white h-100">
      <p className="text-muted mb-4 small">Поля з * обов'язкові до заповнення.</p>
      
      <FormField id="ord-book" label="Обрана книга" error={errors.bookId}>
        <Form.Control type="text" value={bookTitle} readOnly disabled isInvalid={!!errors.bookId} />
      </FormField>

      <FormField id="ord-name" label="Ім'я замовника *" error={errors.customerName}>
        <Form.Control type="text" name="customerName" value={draft.customerName} onChange={handleChange} isInvalid={!!errors.customerName} />
      </FormField>

      <FormField id="ord-qty" label="Кількість примірників *" hint="Від 1 до 10 шт." error={errors.quantity}>
        <Form.Control type="number" name="quantity" min="1" max="10" value={draft.quantity} onChange={handleChange} isInvalid={!!errors.quantity} />
      </FormField>

      <Form.Check type="checkbox" name="needsDelivery" label="Потрібна доставка" checked={draft.needsDelivery} onChange={handleChange} className="mb-3 fw-bold" isInvalid={!!errors.needsDelivery} />

      {draft.needsDelivery && (
        <FormField id="ord-address" label="Адреса доставки *" error={errors.deliveryAddress}>
          <Form.Control as="textarea" rows={2} name="deliveryAddress" value={draft.deliveryAddress} onChange={handleChange} isInvalid={!!errors.deliveryAddress} />
        </FormField>
      )}

      <div className="d-flex gap-2 mt-4">
        <AppButton type="reset" variant="secondary" onClick={onReset}>Очистити форму</AppButton>
        <AppButton type="submit" variant="primary">Зберегти замовлення</AppButton>
      </div>
    </Form>
  );
}