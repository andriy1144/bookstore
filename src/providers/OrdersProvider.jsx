import { useState, useEffect, useCallback } from 'react';
import { OrdersContext } from '../context/OrdersContext.js';
import { api } from '../services/api.js';
import { validateOrder } from '../domain/orderValidation.js';

export default function OrdersProvider({ books, children }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Вже true при старті
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');

  // Завантаження при першому монтуванні (безпечне для React StrictMode)
  useEffect(() => {
    let ignore = false;

    async function initialLoad() {
      // Ми не викликаємо setIsLoading(true) тут синхронно, 
      // бо воно вже true у useState. Це усуває помилку каскадного рендеру.
      try {
        const data = await api.getOrders();
        if (!ignore) setOrders(data);
      } catch (err) {
        if (!ignore) setError(err.message || 'Не вдалося завантажити замовлення.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    initialLoad();

    // Функція очищення зупиняє оновлення стану, якщо компонент розмонтувався
    return () => {
      ignore = true;
    };
  }, []);

  // Функція для ручного оновлення (наприклад, кнопка "Спробувати ще раз")
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Не вдалося завантажити замовлення.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function createOrder(input) {
    const validation = validateOrder(input, books);
    if (!validation.ok) return validation;

    try {
      const newOrder = await api.createOrder(validation.value);
      setOrders((prev) => [...prev, newOrder]);
      setNotice('Замовлення успішно створено на сервері.');
      return { ok: true, record: newOrder };
    } catch (err) {
      return { ok: false, errors: { form: err.message } };
    }
  }

  async function updateOrder(id, input) {
    const current = orders.find((o) => o.id === id);
    if (!current) return { ok: false, message: 'Замовлення не знайдено.' };

    const validation = validateOrder(input, books);
    if (!validation.ok) return validation;

    try {
      const updated = await api.updateOrder(id, validation.value);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      setNotice('Зміни успішно збережено на сервері.');
      return { ok: true, record: updated };
    } catch (err) {
      return { ok: false, errors: { form: err.message } };
    }
  }

  async function deleteOrder(id) {
    try {
      await api.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setNotice('Замовлення успішно видалено з сервера.');
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  }

  function dismissNotice() { setNotice(''); }

  return (
    <OrdersContext.Provider value={{
      orders, isLoading, error, fetchOrders,
      createOrder, updateOrder, deleteOrder,
      notice, dismissNotice
    }}>
      {children}
    </OrdersContext.Provider>
  );
}