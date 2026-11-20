import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import PageHeading from '../components/ui/PageHeading.jsx';
import FormField from '../components/ui/FormField.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useAuth from '../hooks/useAuth.js';

const emptyValues = { name: '', email: '', password: '', confirmPassword: '' };

const fields = [
  { name: 'name', label: "Ім'я та прізвище", type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Електронна пошта', type: 'email', autoComplete: 'email' },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    autoComplete: 'new-password',
    hint: 'Щонайменше 8 символів, літера та цифра.',
  },
  { name: 'confirmPassword', label: 'Повторіть пароль', type: 'password', autoComplete: 'new-password' },
];

export default function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from ?? '/profile';

  if (isAuthenticated && !isSubmitting) return <Navigate to={redirectTo} replace />;

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await register(values);
    setIsSubmitting(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '520px' }}>
      <PageHeading title="Реєстрація" />
      <Form onSubmit={handleSubmit} noValidate className="p-4 border rounded shadow-sm bg-white">
        {errors.form && <Alert variant="danger">{errors.form}</Alert>}

        {fields.map((field) => (
          <FormField
            key={field.name}
            id={`reg-${field.name}`}
            label={field.label}
            hint={field.hint}
            error={errors[field.name]}
          >
            <Form.Control
              id={`reg-${field.name}`}
              type={field.type}
              name={field.name}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={handleChange}
              isInvalid={!!errors[field.name]}
              disabled={isSubmitting}
            />
          </FormField>
        ))}

        <div className="d-grid mt-4">
          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Створення...' : 'Створити обліковий запис'}
          </AppButton>
        </div>
        <p className="text-center text-muted mt-3 mb-0">
          Вже зареєстровані? <Link to="/login" state={location.state}>Увійти</Link>
        </p>
      </Form>
    </div>
  );
}
