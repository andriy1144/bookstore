// Імітація токена у форматі JWT (header.payload.signature).
// Справжній JWT підписує й перевіряє сервер; клієнт лише читає корисне
// навантаження, тому підпис тут умовний і не дає жодних гарантій безпеки.

const DEFAULT_TTL_MS = 2 * 60 * 60 * 1000; // 2 години

function encodePart(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodePart(part) {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function createToken(user, { ttlMs = DEFAULT_TTL_MS, now = Date.now() } = {}) {
  const header = { alg: 'none', typ: 'JWT' };
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    iat: now,
    exp: now + ttlMs,
  };
  return `${encodePart(header)}.${encodePart(payload)}.mock-signature`;
}

// Повертає корисне навантаження або null, якщо токен пошкоджений чи прострочений.
export function decodeToken(token, { now = Date.now() } = {}) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = decodePart(parts[1]);
    if (typeof payload.exp !== 'number' || payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}
