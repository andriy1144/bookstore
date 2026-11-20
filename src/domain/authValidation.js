const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

export function validateLogin(input) {
  const errors = {};
  const email = normalizeEmail(input.email);
  const password = typeof input.password === 'string' ? input.password : '';

  if (email === '') errors.email = 'Вкажіть електронну пошту.';
  else if (!isValidEmail(email)) errors.email = 'Некоректний формат електронної пошти.';

  if (password === '') errors.password = 'Вкажіть пароль.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, value: { email, password } };
}

export function validateRegistration(input) {
  const errors = {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = normalizeEmail(input.email);
  const password = typeof input.password === 'string' ? input.password : '';
  const confirmPassword = typeof input.confirmPassword === 'string' ? input.confirmPassword : '';

  if (name.length === 0) errors.name = "Вкажіть ваше ім'я.";
  else if (name.length < 3 || name.length > 100) errors.name = "Ім'я має містити від 3 до 100 символів.";

  if (email === '') errors.email = 'Вкажіть електронну пошту.';
  else if (!isValidEmail(email)) errors.email = 'Некоректний формат електронної пошти.';

  if (password.length < 8) {
    errors.password = 'Пароль має містити щонайменше 8 символів.';
  } else if (!/[A-Za-zА-Яа-яІіЇїЄєҐґ]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Пароль має містити хоча б одну літеру та одну цифру.';
  }

  if (confirmPassword !== password) errors.confirmPassword = 'Паролі не збігаються.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, value: { name, email, password } };
}
