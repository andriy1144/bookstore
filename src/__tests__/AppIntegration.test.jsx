import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { api } from '../services/api.js';

// Допоміжна функція для керування асинхронними відповідями в тестах
function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const initialTestOrders = [
  {
    id: 'ord-001',
    bookId: 'bk-001',
    customerName: 'Іван Франко',
    quantity: 1,
    needsDelivery: false,
    deliveryAddress: 'Самовивіз',
  },
];

describe('Інтеграційні та компонентні тести BookStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('показує помилки валідації при поданні некоректної форми і не викликає сервіс створення', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'getOrders').mockResolvedValue(initialTestOrders);
    const createSpy = vi.spyOn(api, 'createOrder');

    render(
      <MemoryRouter initialEntries={['/orders/new?bookId=bk-001']}>
        <App />
      </MemoryRouter>
    );

    const submitBtn = await screen.findByRole('button', { name: /Зберегти замовлення/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/Вкажіть ваше ім'я/i)).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('блокує повторне подання під час збереження та не знищує чернетку у разі відмови сервера', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'getOrders').mockResolvedValue(initialTestOrders);

    const deferredCreate = createDeferred();
    vi.spyOn(api, 'createOrder').mockReturnValue(deferredCreate.promise);

    render(
      <MemoryRouter initialEntries={['/orders/new?bookId=bk-001']}>
        <App />
      </MemoryRouter>
    );

    const nameInput = await screen.findByLabelText(/Ім'я замовника/i);
    await user.type(nameInput, 'Тарас Шевченко');

    const submitBtn = screen.getByRole('button', { name: /Зберегти замовлення/i });
    await user.click(submitBtn);

    // Під час виконання запиту кнопка заблокована
    expect(screen.getByRole('button', { name: /Відправка.../i })).toBeDisabled();

    // Імітуємо помилку сервера
    deferredCreate.reject(new Error('Сервер тимчасово недоступний'));

    // Повідомлення про помилку з'явилося, але введене ім'я у чернетці збережено
    expect(await screen.findByText(/Сервер тимчасово недоступний/i)).toBeInTheDocument();
    expect(nameInput).toHaveValue('Тарас Шевченко');
  });

  it('відтворює стани loading, error, retry та empty у розділі замовлень', async () => {
    const user = userEvent.setup();
    const deferredLoad = createDeferred();

    const getOrdersSpy = vi
      .spyOn(api, 'getOrders')
      .mockReturnValueOnce(deferredLoad.promise)
      .mockResolvedValueOnce([]);

    render(
      <MemoryRouter initialEntries={['/orders']}>
        <App />
      </MemoryRouter>
    );

    // 1. Стан завантаження (loading)
    expect(screen.getByText(/Завантаження замовлень.../i)).toBeInTheDocument();

    // 2. Стан помилки (error)
    deferredLoad.reject(new Error('Помилка з’єднання з API'));
    expect(await screen.findByText(/Помилка з’єднання з API/i)).toBeInTheDocument();

    // 3. Повторна спроба (retry) -> Порожній список (empty)
    const retryBtn = screen.getByRole('button', { name: /Спробувати ще раз/i });
    await user.click(retryBtn);

    expect(await screen.findByText(/Замовлень ще немає/i)).toBeInTheDocument();
    expect(getOrdersSpy).toHaveBeenCalledTimes(2);
  });

  it('створює замовлення та переходить на сторінку перегляду за підтвердженим ідентифікатором', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'getOrders').mockResolvedValue(initialTestOrders);
    vi.spyOn(api, 'createOrder').mockResolvedValue({
      id: 'ord-777',
      bookId: 'bk-001',
      customerName: 'Ольга Кобилянська',
      quantity: 2,
      needsDelivery: false,
      deliveryAddress: 'Самовивіз',
    });

    render(
      <MemoryRouter initialEntries={['/orders/new?bookId=bk-001']}>
        <App />
      </MemoryRouter>
    );

    await user.type(await screen.findByLabelText(/Ім'я замовника/i), 'Ольга Кобилянська');
    await user.click(screen.getByRole('button', { name: /Зберегти замовлення/i }));

    expect(await screen.findByRole('heading', { name: /Замовлення ord-777/i })).toBeInTheDocument();
    expect(screen.getByText('Ольга Кобилянська')).toBeInTheDocument();
  });

  it('перевіряє підтвердження видалення та обробляє невідомі маршрути (404)', async () => {
    const user = userEvent.setup();
    vi.spyOn(api, 'getOrders').mockResolvedValue(initialTestOrders);
    const deleteSpy = vi.spyOn(api, 'deleteOrder').mockResolvedValue({ ok: true });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { unmount } = render(
      <MemoryRouter initialEntries={['/orders/ord-001']}>
        <App />
      </MemoryRouter>
    );

    const deleteBtn = await screen.findByRole('button', { name: /Скасувати \(Видалити\)/i });
    await user.click(deleteBtn);

    expect(deleteSpy).toHaveBeenCalledWith('ord-001');
    expect(await screen.findByText(/Замовлення успішно видалено/i)).toBeInTheDocument();

    unmount();

    // Перевірка невідомого маршруту з очікуванням завершення фонового ефекту провайдера
    render(
      <MemoryRouter initialEntries={['/unknown-page']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /404/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(api.getOrders).toHaveBeenCalledTimes(2);
    });
  });
});