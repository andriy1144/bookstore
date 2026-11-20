// Хешування пароля засобами Web Crypto API (SHA-256).
// У реальній системі пароль хешується лише на сервері повільним алгоритмом
// (bcrypt, Argon2); тут хеш потрібен, щоб імітаційне сховище не тримало
// паролі у відкритому вигляді в localStorage.
export async function hashPassword(email, password) {
  const data = new TextEncoder().encode(`bookstore:${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
