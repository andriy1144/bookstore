import { books as initialBooks } from '../data/books.js';
import { orders as initialOrders } from '../data/orders.js';
import { ApiError } from './ApiError.js';

// Ініціалізація бази даних у localStorage
function initDB() {
  if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(initialBooks));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(initialOrders));
  }
}

initDB();

// Штучна затримка для імітації мережі
function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Імітація випадкових мережевих помилок (вимкнено для стабільності під час розробки, можна поставити Math.random() < 0.1)
function simulateNetwork() {
  if (Math.random() < 0.05) {
    throw new ApiError('Мережева помилка: сервер тимчасово недоступний.', 503);
  }
}

export const mockStorage = {
  async getBooks() {
    await delay(500);
    simulateNetwork();
    return JSON.parse(localStorage.getItem('books'));
  },

  async getBookById(id) {
    await delay(300);
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find((b) => b.id === id);
    if (!book) throw new ApiError('Книгу не знайдено.', 404);
    return book;
  },

  async getOrders() {
    await delay(700);
    simulateNetwork();
    return JSON.parse(localStorage.getItem('orders'));
  },

  async createOrder(orderData) {
    await delay(600);
    simulateNetwork();
    const orders = JSON.parse(localStorage.getItem('orders'));
    
    // Імітація серверного створення ID
    const newOrder = { id: `ord-${Date.now()}`, ...orderData };
    orders.push(newOrder);
    
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
  },

  async updateOrder(id, orderData) {
    await delay(600);
    simulateNetwork();
    const orders = JSON.parse(localStorage.getItem('orders'));
    
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new ApiError('Замовлення для оновлення не знайдено.', 404);
    
    const updatedOrder = { ...orderData, id };
    orders[index] = updatedOrder;
    
    localStorage.setItem('orders', JSON.stringify(orders));
    return updatedOrder;
  },

  async deleteOrder(id) {
    await delay(500);
    simulateNetwork();
    const orders = JSON.parse(localStorage.getItem('orders'));
    
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new ApiError('Замовлення для видалення не знайдено.', 404);
    
    const newOrders = orders.filter((o) => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(newOrders));
    return { ok: true };
  }
};