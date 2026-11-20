import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { api } from '../services/api.js';

// У цих тестах використовується справжній mockStorage на базі localStorage
// (setupTests.js очищає сховище після кожного тесту, затримки в режимі test вимкнені).

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('Автентифікація, захищені маршрути та контакти', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('перенаправляє неавтентифікованого користувача з /profile на сторінку входу', async () => {
    renderAt('/profile');

    expect(await screen.findByRole('heading', { name: /Вхід до кабінету/i })).toBeInTheDocument();
    expect(screen.getByText(/увійдіть до свого облікового запису/i)).toBeInTheDocument();
  });

  it('показує помилку при хибному паролі та впускає з правильними даними демо-користувача', async () => {
    const user = userEvent.setup();
    renderAt('/profile');

    await user.type(await screen.findByLabelText(/Електронна пошта/i), 'demo@bookstore.test');
    await user.type(screen.getByLabelText(/Пароль/i), 'wrong-password1');
    await user.click(screen.getByRole('button', { name: 'Увійти' }));

    expect(await screen.findByText(/Невірна електронна пошта або пароль/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/Пароль/i));
    await user.type(screen.getByLabelText(/Пароль/i), 'Bookstore2026');
    await user.click(screen.getByRole('button', { name: 'Увійти' }));

    // Після входу користувач повертається на збережену адресу /profile
    expect(await screen.findByRole('heading', { name: /Особистий кабінет/i })).toBeInTheDocument();
    expect(screen.getByText('demo@bookstore.test')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'ord-003' })).toBeInTheDocument();
  });

  it('реєструє нового користувача, не допускає повторної реєстрації тієї ж пошти та виконує вихід', async () => {
    const user = userEvent.setup();
    renderAt('/register');

    await user.type(await screen.findByLabelText(/Ім'я та прізвище/i), 'Марія Заньковецька');
    await user.type(screen.getByLabelText(/Електронна пошта/i), 'demo@bookstore.test');
    await user.type(screen.getByLabelText(/^Пароль$/i), 'teatr1882');
    await user.type(screen.getByLabelText(/Повторіть пароль/i), 'teatr1882');
    await user.click(screen.getByRole('button', { name: /Створити обліковий запис/i }));

    expect(await screen.findByText(/вже зареєстрований/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Електронна пошта/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'maria@example.com');
    await user.click(screen.getByRole('button', { name: /Створити обліковий запис/i }));

    expect(await screen.findByRole('heading', { name: /Особистий кабінет/i })).toBeInTheDocument();
    expect(screen.getByText(/Ви ще не оформили жодного замовлення/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Вийти з облікового запису/i }));
    expect(await screen.findByRole('heading', { name: /Ласкаво просимо/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Увійти' })).toBeInTheDocument();
  });

  it('валідує форму зворотного зв’язку і надсилає коректне звернення', async () => {
    const user = userEvent.setup();
    const sendSpy = vi.spyOn(api, 'sendFeedback');
    renderAt('/contacts');

    await user.click(await screen.findByRole('button', { name: /Надіслати повідомлення/i }));
    expect(await screen.findByText(/Оберіть тему звернення/i)).toBeInTheDocument();
    expect(sendSpy).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/Ваше ім'я/i), 'Олена');
    await user.type(screen.getByLabelText(/Електронна пошта/i), 'olena@example.com');
    await user.selectOptions(screen.getByLabelText(/Тема звернення/i), 'catalog');
    await user.type(screen.getByLabelText(/Повідомлення/i), 'Додайте, будь ласка, більше фентезі.');
    await user.click(screen.getByRole('button', { name: /Надіслати повідомлення/i }));

    expect(await screen.findByText(/Ваше повідомлення надіслано/i)).toBeInTheDocument();
    expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ topic: 'catalog', name: 'Олена' }));
  });
});
