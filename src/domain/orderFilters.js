export function selectVisibleOrders(orders, { query = '', sortBy = 'id' } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = orders.filter((order) => {
    const name = order.customerName || '';
    return name.toLowerCase().includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'qty') {
      return b.quantity - a.quantity;
    }
    return a.id.localeCompare(b.id);
  });
}