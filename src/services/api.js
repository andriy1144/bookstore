import { mockStorage } from './mockStorage.js';

export const api = {
  getBooks: () => mockStorage.getBooks(),
  getBookById: (id) => mockStorage.getBookById(id),
  getOrders: () => mockStorage.getOrders(),
  createOrder: (data) => mockStorage.createOrder(data),
  updateOrder: (id, data) => mockStorage.updateOrder(id, data),
  deleteOrder: (id) => mockStorage.deleteOrder(id),
};