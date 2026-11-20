import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import PageHeading from '../components/ui/PageHeading.jsx';
import FormField from '../components/ui/FormField.jsx';
import AppButton from '../components/ui/AppButton.jsx';
import useAuth from '../hooks/useAuth.js';
import { api } from '../services/api.js';
import { validateFeedback } from '../domain/feedbackValidation.js';
import storeInfo from '../data/storeInfo.json';

export default function ContactsPage() {
  const { user } = useAuth();
  const emptyValues = { name: user?.name ?? '', email: user?.email ?? '', topic: '', message: '' };

  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    setSent(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validateFeedback(values, storeInfo.feedbackTopics);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.sendFeedback(validation.value);
      setSent(true);
      setValues(emptyValues);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeading title="Контакти" />
      <Row className="g-4">
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title as="h2" className="h4">
                Книгарня «{storeInfo.name}»
              </Card.Title>
              <dl className="mt-3">
                <dt>Адреса</dt>
                <dd>{storeInfo.address}</dd>
                <dt>Телефон</dt>
                <dd>
                  <a href={`tel:${storeInfo.phone.replace(/[^\d+]/g, '')}`}>{storeInfo.phone}</a>
                </dd>
                <dt>Електронна пошта</dt>
                <dd>
                  <a href={`mailto:${storeInfo.email}`}>{storeInfo.email}</a>
                </dd>
              </dl>
              <h3 className="h6 fw-bold">Графік роботи</h3>
              <ul className="list-unstyled mb-0">
                {storeInfo.workingHours.map((item) => (
                  <li key={item.days} className="d-flex justify-content-between border-bottom py-1">
                    <span>{item.days}</span>
                    <span>{item.hours}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Form onSubmit={handleSubmit} noValidate className="p-4 border rounded shadow-sm bg-white h-100">
            <h2 className="h4 mb-3">Зворотний зв'язок</h2>
            {sent && <Alert variant="success">Дякуємо! Ваше повідомлення надіслано.</Alert>}
            {errors.form && <Alert variant="danger">{errors.form}</Alert>}

            <Row>
              <Col md={6}>
                <FormField id="fb-name" label="Ваше ім'я *" error={errors.name}>
                  <Form.Control
                    id="fb-name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    disabled={isSubmitting}
                  />
                </FormField>
              </Col>
              <Col md={6}>
                <FormField id="fb-email" label="Електронна пошта *" error={errors.email}>
                  <Form.Control
                    id="fb-email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    disabled={isSubmitting}
                  />
                </FormField>
              </Col>
            </Row>

            <FormField id="fb-topic" label="Тема звернення *" error={errors.topic}>
              <Form.Select
                id="fb-topic"
                name="topic"
                value={values.topic}
                onChange={handleChange}
                isInvalid={!!errors.topic}
                disabled={isSubmitting}
              >
                <option value="">— оберіть тему —</option>
                {storeInfo.feedbackTopics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </Form.Select>
            </FormField>

            <FormField id="fb-message" label="Повідомлення *" hint="Від 10 до 1000 символів." error={errors.message}>
              <Form.Control
                id="fb-message"
                as="textarea"
                rows={4}
                name="message"
                value={values.message}
                onChange={handleChange}
                isInvalid={!!errors.message}
                disabled={isSubmitting}
              />
            </FormField>

            <AppButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Надсилання...' : 'Надіслати повідомлення'}
            </AppButton>
          </Form>
        </Col>
      </Row>
    </>
  );
}
