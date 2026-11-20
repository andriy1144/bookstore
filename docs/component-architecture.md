# Архітектура компонентів проєкту "BookStore"

Цей документ описує фінальну структуру клієнтського застосунку, розподіл відповідальності між компонентами, їхні контракти, керування станом, оптимізацію продуктивності та тестування (згідно з етапами розробки ЛР 1.1 — ЛР 4.1).

## 1. Ієрархія маршрутів та компонентів

App (Точка входу, Routes, React.lazy для сторінок)
 └── AppLayout (Спільна оболонка)
      └── AuthProvider (Context API: користувач, login / register / logout)
           ├── SiteHeader (Шапка)
           │    ├── MainNav (Навігація)
           │    └── UserMenu (Вхід / реєстрація або посилання на кабінет)
           └── BookSelectionProvider (Context API: мемоізований стан вибору книги)
                └── OrdersProvider (Context API: колекція замовлень, асинхронні стани)
                     └── Suspense (PageLoader поки завантажується код сторінки)
                          ├── / -> HomePage -> BookCover
                          ├── /books -> CatalogContainer -> BookListPage
                          │    ├── BookFilters (пошук, жанр, наявність)
                          │    └── BookList -> BookCard (React.memo) -> BookCover, AvailabilityBadge
                          ├── /books/:bookId -> BookDetailsPage
                          ├── /orders -> OrdersLayout (Вкладене компонування + OrderNotice)
                          │    ├── /orders -> OrdersPage (useMemo) -> OrderRow (React.memo)
                          │    ├── /orders/new -> OrderCreatePage -> OrderForm, OrderSummary
                          │    ├── /orders/:orderId -> OrderViewPage (Перегляд та видалення)
                          │    └── /orders/:orderId/edit -> OrderEditPage
                          ├── /contacts -> ContactsPage (форма зворотного зв'язку)
                          ├── /login -> LoginPage, /register -> RegisterPage, /logout -> LogoutRoute
                          ├── ProtectedRoute
                          │    └── /profile -> ProfilePage
                          └── * -> NotFoundPage (Сторінка 404)

## 2. Патерн "Адаптер" та предметний шар (Domain & Services)

*   `src/data/*.json`: Початкові «серверні» колекції (книги, замовлення, користувачі, дані магазину).
*   `mockStorage.js`: Імітує базу даних за допомогою `localStorage` (ледаче заповнення з JSON, версія схеми), створює штучні затримки та за потреби — випадкові збої (`VITE_SIMULATED_FAILURE_RATE`).
*   `api.js` (Адаптер): Єдина точка входу для React-компонентів (`getBooks`, `getOrders`, `createOrder`, `updateOrder`, `deleteOrder`, `register`, `login`, `sendFeedback`).
*   `authToken.js`: Створення та розбір імітації JWT (перевірка терміну дії). `passwordHash.js`: SHA-256 через Web Crypto API.
*   `authValidation.js`, `feedbackValidation.js`: Чисті функції валідації реєстрації, входу та звернень.
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
| `user` | Поточний автентифікований користувач | `AuthProvider` (відновлення з токена в `localStorage`) | `UserMenu`, `ProtectedRoute`, `ProfilePage`, `OrdersProvider`, `ContactsPage` | `login` / `register` / `logout` |
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
3. **Розділення коду (`React.lazy` + `Suspense`):**
   Усі сторінки в `App.jsx` завантажуються ліниво, тому кожна з них потрапляє в окремий фрагмент бандла й завантажується лише при першому переході на маршрут.
4. **`useCallback` для стабілізації посилань на функції:**
   У `BookSelectionProvider` функція `selectBook` мемоізована через `useCallback`, щоб мемоізовані картки `BookCard` отримували стабільний проп `onSelect`.

## 6. Тестування (Vitest + React Testing Library)

*   **Модульні тести (`orderDomain.test.js`):** Перевіряють чисті функції `validateOrder` та `selectVisibleOrders` (зокрема незмінність вхідного масиву).
*   **Модульні тести (`authValidation.test.js`, `authToken.test.js`):** Перевіряють правила реєстрації, входу й звернень, створення та відхилення простроченого або пошкодженого токена.
*   **Інтеграційні тести автентифікації (`AuthFlow.test.jsx`):** Перенаправлення з `/profile` на вхід, хибний і правильний пароль, реєстрація з перевіркою унікальності пошти, вихід, форма контактів.
*   **Компонентні та інтеграційні тести (`AppIntegration.test.jsx`):** За допомогою `MemoryRouter`, `vi.spyOn(api, ...)` та керованих `Promise` (`createDeferred`) перевіряють валідацію форми, блокування повторного подання, збереження чернетки при збої сервера, стани `loading`/`error`/`retry`/`empty`, переходи за маршрутами та видалення запису.