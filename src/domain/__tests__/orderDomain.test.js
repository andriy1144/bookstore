import { describe, it, expect } from 'vitest';
import { validateOrder } from '../orderValidation.js';
import { selectVisibleOrders } from '../orderFilters.js';

const sampleBooks = [
  { id: 'bk-001', title: 'Чистий код', available: true, price: 650 },
  { id: 'bk-002', title: '1984', available: false, price: 320 },
];

describe('validateOrder (Предметні правила замовлення)', () => {
  it('нормалізує коректні дані та встановлює "Самовивіз", якщо доставка не потрібна', () => {
    const result = validateOrder(
      {
        bookId: 'bk-001',
        customerName: '  Андрій Мурган  ',
        quantity: '3',
        needsDelivery: false,
        deliveryAddress: '',
      },
      sampleBooks
    );

    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      bookId: 'bk-001',
      customerName: 'Андрій Мурган',
      quantity: 3,
      needsDelivery: false,
      deliveryAddress: 'Самовивіз',
    });
  });

  it('повертає помилки для порожнього імені, некоректної кількості та відсутньої адреси при доставці', () => {
    const result = validateOrder(
      {
        bookId: 'bk-001',
        customerName: 'А',
        quantity: '15',
        needsDelivery: true,
        deliveryAddress: 'Коротка',
      },
      sampleBooks
    );

    expect(result.ok).toBe(false);
    expect(result.errors.customerName).toBeDefined();
    expect(result.errors.quantity).toBeDefined();
    expect(result.errors.deliveryAddress).toBeDefined();
  });
});

describe('selectVisibleOrders (Відбір та сортування без мутації)', () => {
  const sampleOrders = [
    { id: 'ord-002', customerName: 'Леся Українка', quantity: 5 },
    { id: 'ord-001', customerName: 'Іван Франко', quantity: 2 },
  ];

  it('фільтрує за ім’ям без урахування регістру та сортує за спаданням кількості', () => {
    const snapshot = structuredClone(sampleOrders);

    const byQty = selectVisibleOrders(sampleOrders, { query: '', sortBy: 'qty' });
    expect(byQty.map((o) => o.id)).toEqual(['ord-002', 'ord-001']);

    const filtered = selectVisibleOrders(sampleOrders, { query: 'франко', sortBy: 'id' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('ord-001');

    // Перевірка незмінності вхідного масиву
    expect(sampleOrders).toEqual(snapshot);
  });
});