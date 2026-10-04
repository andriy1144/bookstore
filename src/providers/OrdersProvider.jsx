import { useState } from 'react';
import { OrdersContext } from '../context/OrdersContext.js';
import { orders as initialOrders } from '../data/orders.js';
import { validateOrder } from '../domain/orderValidation.js';

export default function OrdersProvider({ books, children }) {
  const [orders, setOrders] = useState(() => initialOrders.map(o => ({ ...o })));
  const [notice, setNotice] = useState('');

  function createOrder(input) {
    const validation = validateOrder(input, books);
    if (!validation.ok) return validation;

    const record = { id: `ord-${crypto.randomUUID()}`, ...validation.value };
    setOrders((prev) => [...prev, record]);
    setNotice('Замовлення успішно створено в локальній базі.');
    return { ok: true, record };
  }

  function updateOrder(id, input) {
    const current = orders.find((o) => o.id === id);
    if (!current) return { ok: false, message: 'Замовлення не знайдено.' };

    const validation = validateOrder(input, books);
    if (!validation.ok) return validation;

    const record = { ...validation.value, id: current.id };
    setOrders((prev) => prev.map((o) => (o.id === id ? record : o)));
    setNotice('Зміни замовлення збережено.');
    return { ok: true, record };
  }

  function deleteOrder(id) {
    if (!orders.some((o) => o.id === id)) {
      return { ok: false, message: 'Замовлення не знайдено.' };
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setNotice('Замовлення видалено.');
    return { ok: true };
  }

  function dismissNotice() { setNotice(''); }

  return (
    <OrdersContext.Provider value={{ orders, createOrder, updateOrder, deleteOrder, notice, dismissNotice }}>
      {children}
    </OrdersContext.Provider>
  );
}