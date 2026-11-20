import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import PageHeading from '../components/ui/PageHeading.jsx';
import FormField from '../components/ui/FormField.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useAuth from '../hooks/useAuth.js';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
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
    const result = await login(values);
    setIsSubmitting(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '480px' }}>
      <PageHeading title="Вхід до кабінету" />
      {location.state?.from && (
        <Alert variant="info">Щоб відкрити цю сторінку, увійдіть до свого облікового запису.</Alert>
      )}
      <Form onSubmit={handleSubmit} noValidate className="p-4 border rounded shadow-sm bg-white">
        {errors.form && <Alert variant="danger">{errors.form}</Alert>}

        <FormField id="login-email" label="Електронна пошта" error={errors.email}>
          <Form.Control
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField id="login-password" label="Пароль" error={errors.password}>
          <Form.Control
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            disabled={isSubmitting}
          />
        </FormField>

        <div className="d-grid mt-4">
          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Перевірка...' : 'Увійти'}
          </AppButton>
        </div>
        <p className="text-center text-muted mt-3 mb-0">
          Немає облікового запису? <Link to="/register" state={location.state}>Зареєструватися</Link>
        </p>
      </Form>
    </div>
  );
}
