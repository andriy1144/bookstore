import Form from 'react-bootstrap/Form';

export default function FormField({ id, label, hint, error, children }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={id} className="fw-bold">{label}</Form.Label>
      {children}
      {hint && !error && <Form.Text className="text-muted d-block">{hint}</Form.Text>}
      {error && <Form.Text className="text-danger fw-bold d-block" role="alert">{error}</Form.Text>}
    </Form.Group>
  );
}