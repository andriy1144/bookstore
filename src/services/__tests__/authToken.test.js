import { describe, it, expect } from 'vitest';
import { createToken, decodeToken } from '../authToken.js';

const user = { id: 'usr-1', name: 'Тест Тестович', email: 'test@example.com', createdAt: '2026-01-01' };

describe('authToken (Імітація JWT)', () => {
  it('створює токен із трьох частин і повертає корисне навантаження з кирилицею', () => {
    const token = createToken(user, { now: 1000, ttlMs: 5000 });

    expect(token.split('.')).toHaveLength(3);
    expect(decodeToken(token, { now: 2000 })).toMatchObject({
      sub: 'usr-1',
      name: 'Тест Тестович',
      exp: 6000,
    });
  });

  it('повертає null для простроченого або пошкодженого токена', () => {
    const token = createToken(user, { now: 1000, ttlMs: 5000 });

    expect(decodeToken(token, { now: 6000 })).toBeNull();
    expect(decodeToken('abc.def', { now: 2000 })).toBeNull();
    expect(decodeToken('a.%%%.c', { now: 2000 })).toBeNull();
    expect(decodeToken(null)).toBeNull();
  });
});
