# Архітектура компонентів проєкту "BookStore"

Цей документ описує фінальну структуру клієнтського застосунку, розподіл відповідальності між компонентами, їхні контракти, керування станом, оптимізацію продуктивності та тестування (згідно з етапами розробки ЛР 1.1 — ЛР 4.1).

## 1. Ієрархія маршрутів та компонентів

App (Точка входу, Routes)
 └── AppLayout (Спільна оболонка)
      ├── SiteHeader (Шапка)
      │    └── MainNav (Навігація)
      └── BookSelectionProvider (Context API: мемоізований глобальний стан вибору книги)
           └── OrdersProvider (Context API: колекція замовлень, асинхронні стани)
                ├── / -> HomePage
                ├── /books -> CatalogContainer -> BookListPage
                │    ├── BookFilters (Керовані поля)
                │    └── BookList -> BookCard (React.memo) -> AvailabilityBadge
                ├── /books/:bookId -> BookDetailsPage
                ├── /orders -> OrdersLayout (Вкладене компонування + OrderNotice)
                │    ├── /orders -> OrdersPage (useMemo) -> OrderRow (React.memo)
                │    ├── /orders/new -> OrderCreatePage
                │    │    ├── OrderForm (Спільна керована форма)
                │    │    └── OrderSummary
                │    ├── /orders/:orderId -> OrderViewPage (Перегляд та видалення)
                │    └── /orders/:orderId/edit -> OrderEditPage (Редагування запису)
                └── * -> NotFoundPage (Сторінка 404)

## 2. Патерн "Адаптер" та предметний шар (Domain & Services)

*   `mockStorage.js`: Імітує базу даних за допомогою `localStorage` та створює штучні мережеві затримки (Promise delays).
*   `api.js` (Адаптер): Єдина точка входу для React-компонентів (`getBooks`, `getOrders`, `createOrder`, `updateOrder`, `deleteOrder`).
*   `orderValidation.js`: Чиста функція `validateOrder()`, що ізолює предметні правила валідації та нормалізації даних.
*   `orderFilters.js`: Чиста функція `selectVisibleOrders()`, що виконує фільтрацію та сортування без мутації вхідної колекції.

## 3. Контракти ключових компонентів (Props)

| Компонент | Вхідні властивості (Props) | Домовленість / Відповідальність |
| :--- | :--- | :--- |
| **AppLayout** | `title`, `links`, `books` | Створює спільну оболонку з шапкою, провайдерами, `<Outlet />` та підвалом. |
| **BookList** | `books`, `selectedId`, `onSelect` | Відповідає за мапінг масиву та обробку порожнього стану каталогу. |
| **BookCard** | `book`, `selected`, `onSelect` | Обгорнутий у `React.memo`. Рендерить картку книги та локальний опис. |
| **OrderRow** | `order`, `bookTitle` | Обгорнутий у `React.memo`. Рендерить рядок таблиці замовлень зі стабільними даними. |
| **OrderForm** | `bookTitle`, `draft`, `errors`, `isSubmitting`, + callbacks | Спільна керована форма для створення та редагування. Блокується при `isSubmitting`. |
| **FormField** | `id`, `label`, `hint`, `error`, `children` | Обгортка для полів вводу з підтримкою доступності (`htmlFor`) та виведенням помилок. |

## 4. Карта стану застосунку

| Значення / Стан | Призначення | Власник стану | Споживачі | Дія скидання / Оновлення |
| :--- | :--- | :--- | :--- | :--- |
| `orders` (масив) | Колекція збережених замовлень | `OrdersProvider` | `OrdersPage`, `OrderViewPage`, `OrderEditPage` | Оновлюється асинхронно через CRUD-методи Провайдера. |
| `isLoading`, `error` | Стани асинхронних запитів | `OrdersProvider` | Всі сторінки розділу `/orders` | Скидається при успішному `fetchOrders()`. |
| `query`, `sortBy` | Фільтрація та сортування | URL (`useSearchParams`) | `OrdersPage`, `BookListPage` | Кнопка очищення / Зміна URL. |
| `draft`, `errors` | Чернетка та помилки форми | `OrderCreatePage`, `OrderEditPage` | `OrderForm`, `OrderSummary` | Демонтування сторінки / Успішне збереження. |
| `isSubmitting` | Блокування форми при запиті | `OrderCreatePage`, `OrderEditPage` | `OrderForm` | Скидається після завершення Promise. |

## 5. Цільова оптимізація продуктивності (ЛР 4.1)

1. **`useMemo` для повторних обчислень:**
   У `OrdersPage` мемоізовано виклик `selectVisibleOrders` та побудову словника `bookTitleById` (`Map`), а у `useBookFilters` — фільтрацію каталогу `visibleBooks`.
2. **`React.memo` для стабільних елементів списку:**
   Компоненти `OrderRow` та `BookCard` обгорнуто в `React.memo`, що запобігає їх зайвому повторному рендерингу при непов'язаних змінах стану.
3. **`useCallback` для стабілізації посилань на функції:**
   У `BookSelectionProvider` функція `selectBook` мемоізована через `useCallback`, щоб мемоізовані картки `BookCard` отримували стабільний проп `onSelect`.

## 6. Тестування (Vitest + React Testing Library)

*   **Модульні тести (`orderDomain.test.js`):** Перевіряють чисті функції `validateOrder` та `selectVisibleOrders` (зокрема незмінність вхідного масиву).
*   **Компонентні та інтеграційні тести (`AppIntegration.test.jsx`):** За допомогою `MemoryRouter`, `vi.spyOn(api, ...)` та керованих `Promise` (`createDeferred`) перевіряють валідацію форми, блокування повторного подання, збереження чернетки при збої сервера, стани `loading`/`error`/`retry`/`empty`, переходи за маршрутами та видалення запису.