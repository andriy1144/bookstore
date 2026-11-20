import { isValidEmail } from './authValidation.js';

export function validateFeedback(input, topics) {
  const errors = {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';

  if (name.length < 2) errors.name = "Вкажіть ваше ім'я (щонайменше 2 символи).";

  if (email === '') errors.email = 'Вкажіть електронну пошту для відповіді.';
  else if (!isValidEmail(email)) errors.email = 'Некоректний формат електронної пошти.';

  if (!topics.some((topic) => topic.value === input.topic)) errors.topic = 'Оберіть тему звернення.';

  if (message.length < 10) errors.message = 'Повідомлення має містити щонайменше 10 символів.';
  else if (message.length > 1000) errors.message = 'Повідомлення не може перевищувати 1000 символів.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, value: { name, email, topic: input.topic, message } };
}
