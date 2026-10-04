export function validateOrder(input, books) {
  const errors = {};
  
  const customerName = typeof input.customerName === 'string' ? input.customerName.trim() : '';
  const address = typeof input.deliveryAddress === 'string' ? input.deliveryAddress.trim() : '';
  const quantityText = String(input.quantity ?? '').trim();
  const quantity = Number(quantityText);

  if (!books.some((book) => book.id === input.bookId)) {
    errors.bookId = 'Виберіть наявну книгу з каталогу.';
  }

  if (customerName.length === 0) {
    errors.customerName = "Вкажіть ваше ім'я.";
  } else if (customerName.length < 3 || customerName.length > 100) {
    errors.customerName = "Ім'я має містити від 3 до 100 символів.";
  }

  if (quantityText === '') {
    errors.quantity = 'Вкажіть кількість примірників.';
  } else if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    errors.quantity = 'Кількість має бути цілим числом від 1 до 10.';
  }

  if (typeof input.needsDelivery !== 'boolean') {
    errors.needsDelivery = 'Ознака доставки має бути логічним значенням.';
  } else if (input.needsDelivery && address.length < 10) {
    errors.deliveryAddress = 'Для доставки вкажіть повну адресу (мінімум 10 символів).';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: {},
    value: {
      bookId: input.bookId,
      customerName,
      quantity,
      needsDelivery: input.needsDelivery,
      deliveryAddress: input.needsDelivery ? address : 'Самовивіз',
    },
  };
}