import initialBooks from '../data/books.json';
import initialOrders from '../data/orders.json';
import initialUsers from '../data/users.json';
import { ApiError } from './ApiError.js';
import { hashPassword } from './passwordHash.js';
import { createToken } from './authToken.js';

// Початкові «серверні» колекції, описані у JSON-файлах каталогу src/data.
const seeds = {
  books: initialBooks,
  orders: initialOrders,
  users: initialUsers,
  feedback: [],
};

// Версія схеми даних. Якщо в браузері збережено стару версію (наприклад,
// каталог із трьох книг із попередніх лабораторних), довідкові колекції
// перезаписуються, а замовлення користувача зберігаються.
const DB_VERSION = '2';

function migrate() {
  if (localStorage.getItem('db-version') === DB_VERSION) return;
  localStorage.setItem('books', JSON.stringify(seeds.books));
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(seeds.users));
  }
  localStorage.setItem('db-version', DB_VERSION);
}

// Ледаче читання колекції: якщо ключа ще немає, він заповнюється з JSON.
function readCollection(key) {
  migrate();
  const raw = localStorage.getItem(key);
  if (raw === null) {
    localStorage.setItem(key, JSON.stringify(seeds[key]));
    return structuredClone(seeds[key]);
  }
  return JSON.parse(raw);
}

function writeCollection(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const IS_TEST = import.meta.env.MODE === 'test';

// Штучна затримка для імітації мережі (у тестах вимкнена).
function delay(ms = 600) {
  if (IS_TEST) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Частку випадкових мережевих збоїв можна задати змінною середовища,
// наприклад VITE_SIMULATED_FAILURE_RATE=0.1 у файлі .env.local.
const FAILURE_RATE = Number(import.meta.env.VITE_SIMULATED_FAILURE_RATE ?? 0);

function simulateNetwork() {
  if (FAILURE_RATE > 0 && Math.random() < FAILURE_RATE) {
    throw new ApiError('Мережева помилка: сервер тимчасово недоступний.', 503);
  }
}

// Повертає дані користувача без службових полів.
function toPublicUser(user) {
  const publicUser = { ...user };
  delete publicUser.passwordHash;
  return publicUser;
}

export const mockStorage = {
  async getBooks() {
    await delay(500);
    simulateNetwork();
    return readCollection('books');
  },

  async getBookById(id) {
    await delay(300);
    const book = readCollection('books').find((b) => b.id === id);
    if (!book) throw new ApiError('Книгу не знайдено.', 404);
    return book;
  },

  async getOrders() {
    await delay(700);
    simulateNetwork();
    return readCollection('orders');
  },

  async createOrder(orderData) {
    await delay(600);
    simulateNetwork();
    const orders = readCollection('orders');

    // Імітація серверного створення ID
    const newOrder = { id: `ord-${Date.now()}`, ...orderData };
    orders.push(newOrder);

    writeCollection('orders', orders);
    return newOrder;
  },

  async updateOrder(id, orderData) {
    await delay(600);
    simulateNetwork();
    const orders = readCollection('orders');

    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new ApiError('Замовлення для оновлення не знайдено.', 404);

    // Власник замовлення не змінюється під час редагування
    const updatedOrder = { ...orderData, userId: orders[index].userId ?? null, id };
    orders[index] = updatedOrder;

    writeCollection('orders', orders);
    return updatedOrder;
  },

  async deleteOrder(id) {
    await delay(500);
    simulateNetwork();
    const orders = readCollection('orders');

    if (!orders.some((o) => o.id === id)) {
      throw new ApiError('Замовлення для видалення не знайдено.', 404);
    }

    writeCollection('orders', orders.filter((o) => o.id !== id));
    return { ok: true };
  },

  async register({ name, email, password }) {
    await delay(600);
    simulateNetwork();
    const users = readCollection('users');

    if (users.some((u) => u.email === email)) {
      throw new ApiError('Користувач із такою електронною поштою вже зареєстрований.', 409);
    }

    const user = {
      id: `usr-${Date.now()}`,
      name,
      email,
      passwordHash: await hashPassword(email, password),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeCollection('users', users);

    const publicUser = toPublicUser(user);
    return { token: createToken(publicUser), user: publicUser };
  },

  async login({ email, password }) {
    await delay(500);
    simulateNetwork();
    const user = readCollection('users').find((u) => u.email === email);
    const hash = await hashPassword(email, password);

    // Однакове повідомлення для невідомої пошти й хибного пароля,
    // щоб не розкривати, які адреси зареєстровані.
    if (!user || user.passwordHash !== hash) {
      throw new ApiError('Невірна електронна пошта або пароль.', 401);
    }

    const publicUser = toPublicUser(user);
    return { token: createToken(publicUser), user: publicUser };
  },

  async sendFeedback(message) {
    await delay(500);
    simulateNetwork();
    const feedback = readCollection('feedback');
    const record = { id: `fb-${Date.now()}`, createdAt: new Date().toISOString(), ...message };
    feedback.push(record);
    writeCollection('feedback', feedback);
    return record;
  },
};
