import { describe, it, expect } from 'vitest';
import { validateLogin, validateRegistration } from '../authValidation.js';
import { validateFeedback } from '../feedbackValidation.js';

describe('validateRegistration (Правила реєстрації)', () => {
  it('нормалізує ім’я та електронну пошту для коректних даних', () => {
    const result = validateRegistration({
      name: '  Андрій Мурган ',
      email: ' Student@Example.COM ',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      name: 'Андрій Мурган',
      email: 'student@example.com',
      password: 'secret123',
    });
  });

  it('відхиляє некоректну пошту, слабкий пароль і розбіжність паролів', () => {
    const result = validateRegistration({
      name: 'Ан',
      email: 'not-an-email',
      password: 'abcdefgh',
      confirmPassword: 'abcdefg',
    });

    expect(result.ok).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(['confirmPassword', 'email', 'name', 'password']);
    expect(result.errors.password).toMatch(/цифру/);
  });
});

describe('validateLogin (Правила входу)', () => {
  it('вимагає заповнити обидва поля', () => {
    const result = validateLogin({ email: '', password: '' });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });
});

describe('validateFeedback (Форма зворотного зв’язку)', () => {
  const topics = [{ value: 'order', label: 'Замовлення' }];

  it('приймає коректне звернення та відхиляє невідому тему й коротке повідомлення', () => {
    const valid = validateFeedback(
      { name: 'Олена', email: 'olena@example.com', topic: 'order', message: 'Коли буде доставка?' },
      topics
    );
    expect(valid.ok).toBe(true);

    const invalid = validateFeedback(
      { name: 'Олена', email: 'olena@example.com', topic: 'unknown', message: 'Коротко' },
      topics
    );
    expect(invalid.ok).toBe(false);
    expect(invalid.errors.topic).toBeDefined();
    expect(invalid.errors.message).toBeDefined();
  });
});
