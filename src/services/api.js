import { mockStorage } from './mockStorage.js';

// Адаптер: єдина точка доступу компонентів до даних. Для підключення
// справжнього backend достатньо замінити реалізацію методів на fetch-запити,
// не змінюючи контракт для провайдерів і сторінок.
export const api = {
  getBooks: () => mockStorage.getBooks(),
  getBookById: (id) => mockStorage.getBookById(id),
  getOrders: () => mockStorage.getOrders(),
  createOrder: (data) => mockStorage.createOrder(data),
  updateOrder: (id, data) => mockStorage.updateOrder(id, data),
  deleteOrder: (id) => mockStorage.deleteOrder(id),
  register: (data) => mockStorage.register(data),
  login: (credentials) => mockStorage.login(credentials),
  sendFeedback: (message) => mockStorage.sendFeedback(message),
};
