import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import AppButton from '../ui/AppButton.jsx';
import FormField from '../ui/FormField.jsx';

export default function OrderForm({ bookTitle, draft, errors, isSubmitting, onDraftChange, onReset, onSubmit }) {
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    onDraftChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <Form onSubmit={onSubmit} noValidate className="p-4 border rounded shadow-sm bg-white h-100 position-relative">
      {/* Затемнення форми під час відправки */}
      {isSubmitting && (
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 10 }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      <p className="text-muted mb-4 small">Поля з * обов'язкові до заповнення.</p>
      
      {/* Серверна помилка */}
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <FormField id="ord-book" label="Обрана книга" error={errors.bookId}>
        <Form.Control type="text" value={bookTitle} readOnly disabled isInvalid={!!errors.bookId} />
      </FormField>

      <FormField id="ord-name" label="Ім'я замовника *" error={errors.customerName}>
        <Form.Control type="text" name="customerName" value={draft.customerName} onChange={handleChange} isInvalid={!!errors.customerName} disabled={isSubmitting} />
      </FormField>

      <FormField id="ord-qty" label="Кількість примірників *" hint="Від 1 до 10 шт." error={errors.quantity}>
        <Form.Control type="number" name="quantity" min="1" max="10" value={draft.quantity} onChange={handleChange} isInvalid={!!errors.quantity} disabled={isSubmitting} />
      </FormField>

      <Form.Check type="checkbox" name="needsDelivery" label="Потрібна доставка" checked={draft.needsDelivery} onChange={handleChange} className="mb-3 fw-bold" isInvalid={!!errors.needsDelivery} disabled={isSubmitting} />

      {draft.needsDelivery && (
        <FormField id="ord-address" label="Адреса доставки *" error={errors.deliveryAddress}>
          <Form.Control as="textarea" rows={2} name="deliveryAddress" value={draft.deliveryAddress} onChange={handleChange} isInvalid={!!errors.deliveryAddress} disabled={isSubmitting} />
        </FormField>
      )}

      <div className="d-flex gap-2 mt-4">
        <AppButton type="reset" variant="secondary" onClick={onReset} disabled={isSubmitting}>Очистити форму</AppButton>
        <AppButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Відправка...' : 'Зберегти замовлення'}
        </AppButton>
      </div>
    </Form>
  );
}